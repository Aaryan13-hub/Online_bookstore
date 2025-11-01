// src/components/Reviews.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../Config/axiosConfig";
import "../style/Reviews.css";
import { useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";

const Reviews = ({ bookId}) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [avgRating, setAvgRating] = useState(null);
   const userData = useSelector(store => store.user.userData);  

  // Fetch all reviews and average rating
  useEffect(() => {
    console.log("user data fetched ",userData);
    
    
    axiosInstance
      .get(`reviews/getreviews/${bookId}`)
      .then((res) => {
        setReviews(res.data);
        if (res.data.length > 0) {
          const avg =
            res.data.reduce((sum, r) => sum + (r.rating || 0), 0) /
            res.data.length;
          setAvgRating(avg.toFixed(1));
        } else {
          setAvgRating(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
      });
  }, [bookId]);

  // Add review
  const handleAddReview = () => {
    if (newReview.trim() === "" || rating === 0) return;

    axiosInstance
      .post(`reviews/add`, {
        bookId,
        user: userData,
        reviewText: newReview,
        rating,
      })
      .then((res) => {
        setReviews([...reviews, res.data]);
        
        
        setNewReview("");
        setRating(0);
        setShowAdd(false);
      })
      .catch((err) => console.error("Error adding review:", err));
  };

  return (
    <div className="reviews-section">
      <h4>Customer Reviews</h4>

      {avgRating && (
        <p className="average-rating">
          ⭐ Average Rating: <strong>{avgRating}</strong>/5
        </p>
      )}

      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews yet</p>
      ) : (
        <ul className="review-list">
          {reviews.map((r, i) => (
            <li key={i} className="review-item">
              <div className="review-header">
                <strong>{r.users?.username}</strong>
                  <p>{r.reviewText}</p>
              </div>
            
            </li>
          ))}
        </ul>
      )}

      {userData && (
        <div className="add-review">
          {!showAdd ? (
            <button className="add-review-btn" onClick={() => setShowAdd(true)}>
              + Add Review
            </button>
          ) : (
            <div className="add-review-form">
              <label>Rating:</label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                    <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`star ${rating >= star ? "selected" : ""}`}
                    >
                    ⭐
                    </span>
              ))}
            </div>


              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Write your review..."
              />

              <div className="review-actions">
                <button onClick={handleAddReview}>Submit</button>
                <button onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reviews;
