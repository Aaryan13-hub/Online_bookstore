import os
import time
import math
import threading
from typing import List, Dict, Optional, Tuple

import numpy as np
import pandas as pd
import requests
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix

# ----------------------------
# Config (override with env)
# ----------------------------
SPRING_BASE_URL = os.getenv("SPRING_BASE_URL", "http://localhost:8080")
# optional: existing content-based endpoint (if you have one)
CONTENT_BASED_URL = os.getenv("CONTENT_BASED_URL", "")  # e.g., http://localhost:8080/recommend/content?userId=
# shared secret (optional) for basic protection
API_SECRET = os.getenv("API_SECRET", "")

# model params
TOPK_ITEM_SIM = int(os.getenv("TOPK_ITEM_SIM", "100"))   # keep top-K neighbors per item
MIN_RATINGS_PER_USER = int(os.getenv("MIN_RATINGS_PER_USER", "1"))

# hybrid blending weight: final_score = alpha*CF + (1-alpha)*Content
ALPHA = float(os.getenv("HYBRID_ALPHA", "0.8"))

# ----------------------------
# Data/model state
# ----------------------------
app = FastAPI(title="Book CF Service", version="1.0")
_state_lock = threading.Lock()

class ModelState:
    def __init__(self):
        self.ready = False
        self.last_trained = None

        # Mappings
        self.user_id_to_idx: Dict[int, int] = {}
        self.idx_to_user_id: List[int] = []

        self.item_id_to_idx: Dict[int, int] = {}
        self.idx_to_item_id: List[int] = []

        # Matrices
        self.R: Optional[csr_matrix] = None           # user-item rating sparse matrix
        self.item_sim_topk: Optional[Dict[int, List[Tuple[int, float]]]] = None  # item -> list of (neighbor_item_idx, sim)

        # Popularity fallback
        self.item_popularity: Optional[np.ndarray] = None  # average rating or count

STATE = ModelState()

# ----------------------------
# Helpers
# ----------------------------
def _auth_ok(secret: Optional[str]) -> bool:
    if not API_SECRET:
        return True
    return secret == API_SECRET

def fetch_reviews_df() -> pd.DataFrame:
    """
    Expects Spring to return a list of Review JSON with at least:
      {
        "reviewId": 123,
        "rating": 4,
        "users": {"userId": 10, ...},
        "books": {"bookId": 55, ...}
      }
    """
    url = f"{SPRING_BASE_URL}/reviews"
    resp = requests.get(url, timeout=30)
    if resp.status_code != 200:
        raise HTTPException(500, f"Failed to fetch reviews: {resp.status_code} {resp.text}")

    data = resp.json()
    rows = []
    for r in data:
        try:
            user_id = r["users"]["userId"]
            book_id = r["books"]["bookId"]
            rating = r.get("rating", None)
            if rating is None:
                continue
            rows.append((user_id, book_id, float(rating)))
        except Exception:
            # Skip malformed record
            continue

    df = pd.DataFrame(rows, columns=["user_id", "book_id", "rating"])
    return df

def build_mappings(df: pd.DataFrame):
    users = sorted(df["user_id"].unique().tolist())
    items = sorted(df["book_id"].unique().tolist())

    user_id_to_idx = {u: i for i, u in enumerate(users)}
    item_id_to_idx = {b: i for i, b in enumerate(items)}
    idx_to_user_id = users
    idx_to_item_id = items
    return user_id_to_idx, item_id_to_idx, idx_to_user_id, idx_to_item_id

def build_sparse_matrix(df: pd.DataFrame, user_map, item_map) -> csr_matrix:
    ui = df["user_id"].map(user_map).values
    ii = df["book_id"].map(item_map).values
    vv = df["rating"].values.astype(np.float32)
    n_users = len(user_map)
    n_items = len(item_map)
    R = csr_matrix((vv, (ui, ii)), shape=(n_users, n_items))
    return R

def topk_item_similarity(R: csr_matrix, topk: int = 100) -> Dict[int, List[Tuple[int, float]]]:
    """
    Compute item-item cosine similarity. For efficiency, we use item vectors (columns).
    We store only the top-K neighbors per item.
    """
    # normalize columns
    Rt = R.T.tocsr()  # items x users
    # cosine sim on sparse matrix: use dense chunks via sklearn if size is reasonable
    # For moderate catalogs this is okay; for very large, switch to approximate methods.
    dense = Rt.toarray()
    sims = cosine_similarity(dense)  # (n_items, n_items)
    np.fill_diagonal(sims, 0.0)

    topk_neighbors: Dict[int, List[Tuple[int, float]]] = {}
    n_items = sims.shape[0]
    k = min(topk, n_items - 1) if n_items > 1 else 0
    for i in range(n_items):
        if k <= 0:
            topk_neighbors[i] = []
            continue
        # get top-k indices
        idx = np.argpartition(-sims[i], k)[:k]
        # sort them
        sub = sorted(((j, float(sims[i, j])) for j in idx if j != i),
                     key=lambda t: t[1], reverse=True)[:k]
        topk_neighbors[i] = sub
    return topk_neighbors

def compute_item_popularity(df: pd.DataFrame, item_map) -> np.ndarray:
    n_items = len(item_map)
    pop = np.zeros(n_items, dtype=np.float32)
    counts = np.zeros(n_items, dtype=np.int32)
    for _, row in df.iterrows():
        j = item_map[row["book_id"]]
        pop[j] += float(row["rating"])
        counts[j] += 1
    counts[counts == 0] = 1
    return pop / counts  # average rating

def user_recommendations(user_id: int, n: int = 10) -> List[Tuple[int, float]]:
    if not STATE.ready or STATE.R is None:
        raise HTTPException(503, "Model not trained yet")

    if user_id not in STATE.user_id_to_idx:
        # Cold start: no ratings for this user → use hybrid fallback
        return hybrid_fallback_for_cold_user(user_id, n)

    u = STATE.user_id_to_idx[user_id]
    user_vector = STATE.R.getrow(u)  # (1, n_items)
    rated_items = set(STATE.R.getrow(u).indices.tolist())

    scores = np.zeros(len(STATE.idx_to_item_id), dtype=np.float32)

    # Score by summing similarities to items the user rated, weighted by rating
    for j in user_vector.indices:
        rating = STATE.R[u, j]
        for nbr, sim in STATE.item_sim_topk.get(j, []):
            if nbr in rated_items:
                continue
            scores[nbr] += float(rating) * float(sim)

    # if all zero, fall back on popularity
    if np.all(scores == 0):
        scores = STATE.item_popularity.copy()

    # merge with content-based if available (hybrid)
    if CONTENT_BASED_URL:
        cf_pairs = [(idx, float(scores[idx])) for idx in range(len(scores))]
        return blend_with_content(user_id, cf_pairs, n)

    # Otherwise, pure CF
    top_idx = np.argsort(-scores)[:n]
    return [(STATE.idx_to_item_id[i], float(scores[i])) for i in top_idx]

def similar_items(book_id: int, n: int = 10) -> List[Tuple[int, float]]:
    if not STATE.ready or STATE.item_sim_topk is None:
        raise HTTPException(503, "Model not trained yet")

    if book_id not in STATE.item_id_to_idx:
        return []

    j = STATE.item_id_to_idx[book_id]
    neighbors = STATE.item_sim_topk.get(j, [])[:n]
    return [(STATE.idx_to_item_id[i], float(s)) for (i, s) in neighbors]

def hybrid_fallback_for_cold_user(user_id: int, n: int):
    """
    If user has no ratings:
      - If content-based endpoint exists, return it.
      - Else return top-N by popularity.
    """
    if CONTENT_BASED_URL:
        try:
            url = f"{CONTENT_BASED_URL}{user_id}"
            res = requests.get(url, timeout=10)
            if res.status_code == 200:
                items = res.json()  # assume list of {bookId, score}
                # keep only known items; if unknown, pass through anyway
                out = []
                for it in items[:n]:
                    bid = it.get("bookId") or it.get("book_id")
                    sc = float(it.get("score", 1.0))
                    out.append((int(bid), sc))
                return out[:n]
        except Exception:
            pass

    # Popularity fallback
    idx = np.argsort(-STATE.item_popularity)[:n]
    return [(STATE.idx_to_item_id[i], float(STATE.item_popularity[i])) for i in idx]

def blend_with_content(user_id: int, cf_pairs: List[Tuple[int, float]], n: int):
    """
    Blend CF and content-based scores: final = ALPHA*cf + (1-ALPHA)*content
    """
    try:
        url = f"{CONTENT_BASED_URL}{user_id}"
        res = requests.get(url, timeout=10)
        content_scores = {}
        if res.status_code == 200:
            for it in res.json():
                bid = it.get("bookId") or it.get("book_id")
                sc = float(it.get("score", 1.0))
                content_scores[int(bid)] = sc
        # Normalize both to [0,1] to be safe
        def normalize(pairs):
            if not pairs:
                return {}
            vals = np.array([s for _, s in pairs], dtype=np.float32)
            if np.all(vals == 0):
                return {i: 0.0 for i, _ in pairs}
            lo, hi = float(vals.min()), float(vals.max())
            rng = (hi - lo) if hi > lo else 1.0
            return {i: (float(s) - lo) / rng for i, s in pairs}

        cf_norm = normalize(cf_pairs)
        content_norm = {}
        if content_scores:
            v = np.array(list(content_scores.values()), dtype=np.float32)
            lo, hi = float(v.min()), float(v.max())
            rng = (hi - lo) if hi > lo else 1.0
            for k, s in content_scores.items():
                content_norm[k] = (float(s) - lo) / rng

        # blend
        keys = set(cf_norm.keys()) | set(content_norm.keys())
        blended = []
        for k in keys:
            cf = cf_norm.get(k, 0.0)
            cb = content_norm.get(k, 0.0)
            blended.append((k, ALPHA * cf + (1.0 - ALPHA) * cb))

        blended.sort(key=lambda t: t[1], reverse=True)
        return blended[:n]
    except Exception:
        # If the content call fails, return CF only
        cf_pairs.sort(key=lambda t: t[1], reverse=True)
        return [(STATE.idx_to_item_id[i] if isinstance(i, int) and i < len(STATE.idx_to_item_id) else i, s)
                for i, s in cf_pairs[:n]]


# ----------------------------
# API models
# ----------------------------
class RetrainRequest(BaseModel):
    secret: Optional[str] = None


# ----------------------------
# Routes
# ----------------------------
@app.get("/health")
def health():
    return {
        "status": "ok" if STATE.ready else "warming",
        "last_trained": STATE.last_trained,
        "spring_base_url": SPRING_BASE_URL,
        "content_based_url": CONTENT_BASED_URL or None
    }

@app.post("/retrain")
def retrain(req: RetrainRequest):
    if not _auth_ok(req.secret):
        raise HTTPException(401, "Unauthorized")
    with _state_lock:
        df = fetch_reviews_df()
        if df.empty:
            # no data yet → initialize empty model
            STATE.ready = False
            STATE.last_trained = time.time()
            raise HTTPException(400, "No reviews found to train on")

        # drop users with no/too few ratings (optional)
        counts = df.groupby("user_id")["book_id"].count()
        keep_users = set(counts[counts >= MIN_RATINGS_PER_USER].index.tolist())
        df = df[df["user_id"].isin(keep_users)].reset_index(drop=True)
        if df.empty:
            STATE.ready = False
            STATE.last_trained = time.time()
            raise HTTPException(400, "Not enough data after filtering")

        user_map, item_map, idx_to_user, idx_to_item = build_mappings(df)
        R = build_sparse_matrix(df, user_map, item_map)
        item_sim = topk_item_similarity(R, TOPK_ITEM_SIM)
        popularity = compute_item_popularity(df, item_map)

        STATE.user_id_to_idx = user_map
        STATE.item_id_to_idx = item_map
        STATE.idx_to_user_id = idx_to_user
        STATE.idx_to_item_id = idx_to_item
        STATE.R = R
        STATE.item_sim_topk = item_sim
        STATE.item_popularity = popularity
        STATE.ready = True
        STATE.last_trained = time.time()

    return {"status": "trained", "n_users": len(STATE.idx_to_user_id), "n_items": len(STATE.idx_to_item_id)}

@app.get("/recommend/user/{user_id}")
def recommend_for_user(user_id: int, n: int = Query(10, ge=1, le=100)):
    results = user_recommendations(user_id, n)
    return [{"bookId": int(bid), "score": float(score)} for (bid, score) in results]

@app.get("/similar/book/{book_id}")
def similar_for_book(book_id: int, n: int = Query(10, ge=1, le=100)):
    results = similar_items(book_id, n)
    return [{"bookId": int(bid), "score": float(score)} for (bid, score) in results]
