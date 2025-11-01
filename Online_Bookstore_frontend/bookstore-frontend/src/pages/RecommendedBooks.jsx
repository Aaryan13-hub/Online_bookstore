import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../Config/axiosConfig";
import { addToCart } from "../stores/cart";
import "../style/BookList.css";

function RecommendedBooks() {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedBooks, setAddedBooks] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user.userData);

  const handleAddToCart = (bookId) => {
    dispatch(
      addToCart({
        bookId: bookId,
        quantity: 1,
      })
    );

    // Show feedback
    setAddedBooks({ ...addedBooks, [bookId]: true });
    setTimeout(() => {
      setAddedBooks({ ...addedBooks, [bookId]: false });
    }, 2000);
  };

  useEffect(() => {
    if (!userData?.userId) {
      navigate("/login");
      return;
    }

    setLoading(true);

    axiosInstance
      .get(`/recommend/hybrid/${userId}`)
      .then((res) => {
        setRecommendedBooks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recommendations:", err);
        setLoading(false);
      });
  }, [userData?.userId, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Finding your perfect books...</p>
      </div>
    );
  }

  if (!recommendedBooks || recommendedBooks.length === 0) {
    return (
      <div className="booklist-container">
        <div className="hero-section">
          <h1 className="hero-title">No Recommendations Yet</h1>
          <p className="hero-subtitle">
            Start exploring books to get personalized recommendations!
          </p>
          <Link to="/" className="btn-back-home">
            Browse All Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="booklist-container">
      {/* Hero Section */}
      <div className="hero-section recommended-hero">
        <div className="hero-icon">✨</div>
        <h1 className="hero-title">Your Personalized Recommendations</h1>
        <p className="hero-subtitle">
          We found {recommendedBooks.length} books perfect for you based on your preferences
        </p>
        <Link to="/" className="btn-browse-all">
          ← Browse All Books
        </Link>
      </div>

      {/* Books Display */}
      <div className="books-content">
        <div className="genre-section">
          <div className="genre-header">
            <h2 className="genre-title">Recommended For You</h2>
            <span className="genre-count">{recommendedBooks.length} books</span>
          </div>

          <div className="books-grid">
            {recommendedBooks.map((book) => (
              <div key={book.bookId} className="book-card">
                {/* Recommended Badge */}
                <div className="recommended-badge">
                  <span className="badge-star">⭐</span>
                  <span>Recommended</span>
                </div>

                {/* Book Image */}
                <div className="book-image-container">
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="book-image"
                    />
                  ) : (
                    <div className="book-image-placeholder">
                      <span>📖</span>
                    </div>
                  )}
                  {book.stock < 5 && book.stock > 0 && (
                    <span className="badge badge-low-stock">
                      Only {book.stock} left
                    </span>
                  )}
                  {book.stock === 0 && (
                    <span className="badge badge-out-stock">Out of Stock</span>
                  )}
                </div>

                {/* Book Info */}
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">
                    {book.authors && book.authors.length > 0
                      ? book.authors.map((a) => a.name).join(", ")
                      : "Unknown Author"}
                  </p>

                  <div className="book-footer">
                    <div className="book-price">
                      <span className="price-symbol">₹</span>
                      <span className="price-amount">{book.price}</span>
                    </div>

                    <div className="book-actions">
                      <button
                        className={`btn-add-cart ${
                          addedBooks[book.bookId] ? "added" : ""
                        }`}
                        onClick={() => handleAddToCart(book.bookId)}
                        disabled={book.stock === 0}
                      >
                        {addedBooks[book.bookId] ? (
                          <>
                            <span className="checkmark">✓</span> Added
                          </>
                        ) : (
                          <>
                            <span className="cart-icon-small">🛒</span> Add
                          </>
                        )}
                      </button>
                      <Link
                        to={`/books/${book.slug}`}
                        className="btn-view-details"
                      >
                        <span className="eye-icon">👁️</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecommendedBooks;