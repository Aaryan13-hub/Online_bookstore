import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../stores/cart";
import "../style/RecommendationsModal.css"

const RecommendationsModal = ({ recommendedBooks, onClose }) => {
  const [addedBooks, setAddedBooks] = useState({});
  const dispatch = useDispatch();

  const handleAddToCart = (bookId) => {
    dispatch(
      addToCart({
        bookId: bookId,
        quantity: 1,
      })
    );
    
    setAddedBooks({ ...addedBooks, [bookId]: true });
    setTimeout(() => {
      setAddedBooks({ ...addedBooks, [bookId]: false });
    }, 2000);
  };

  if (!recommendedBooks || recommendedBooks.length === 0) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <span className="sparkle-icon">✨</span>
            <h2 className="modal-title">Recommended For You</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Modal Subtitle */}
        <p className="modal-subtitle">
          Based on your reading preferences, we think you'll love these books!
        </p>

        {/* Books Grid */}
        <div className="modal-books-grid">
          {recommendedBooks.map((book) => (
            <div key={book.bookId} className="modal-book-card">
              {/* Book Image */}
              <div className="modal-book-image-container">
                {book.imageUrl ? (
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="modal-book-image"
                  />
                ) : (
                  <div className="modal-book-placeholder">
                    <span>📖</span>
                  </div>
                )}
                {book.stock < 5 && book.stock > 0 && (
                  <span className="modal-badge modal-badge-low">
                    Only {book.stock} left
                  </span>
                )}
                {book.stock === 0 && (
                  <span className="modal-badge modal-badge-out">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Book Info */}
              <div className="modal-book-info">
                <h3 className="modal-book-title">{book.title}</h3>
                <p className="modal-book-author">
                      {book.author
                        ? Array.isArray(book.author)
                         ? book.author.map((a) => a.name).join(", ")  // if array of objects
                         : book.author                               // if plain string
                        : "Unknown Author"}
                </p>
                <p className="modal-book-genre">{book.genre}</p>

                <div className="modal-book-footer">
                  <div className="modal-book-price">
                    <span className="modal-price-symbol">₹</span>
                    <span className="modal-price-amount">{book.price}</span>
                  </div>

                  <div className="modal-book-actions">
                    <button
                      className={`modal-btn-add ${
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
                          <span className="cart-icon">🛒</span> Add
                        </>
                      )}
                    </button>
                    <Link
                      to={`/books/${book.slug}`}
                      className="modal-btn-view"
                      onClick={onClose}
                    >
                      <span className="eye-icon">👁️</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Browse All Button */}
        <div className="modal-footer">
          <button className="modal-browse-btn" onClick={onClose}>
            Browse All Books
          </button>
        </div>
      </div>
    </div>
  
    )
}     
export default RecommendationsModal;