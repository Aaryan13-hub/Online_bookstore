// components/BookDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../stores/cart";
import "../style/BookDetail.css";
import axiosInstance from "../Config/axiosConfig";
import Reviews from "../Components/Reviews";

function BookDetail() {
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/books/${slug}`)
      .then((res) => {
        setBook(res.data);
       
        
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const handleMinusQuantity = () => {
    setQuantity(quantity - 1 < 1 ? 1 : quantity - 1);
  };

  const handlePlusQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        bookId: book.bookId,
        quantity: quantity,
      })
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="book-detail-loading">
        <div className="spinner"></div>
        <p>Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-detail-error">
        <h2>Book not found</h2>
        <p>Sorry, we couldn't find the book you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="book-detail-container">
      <div className="book-detail-wrapper">
        {/* Image Section */}
        <div className="book-image-section">
          <div className="book-image-wrapper">
            <img src={book.imageUrl} alt={book.title} className="book-image" />
          </div>
        </div>

        {/* Details Section */}
        <div className="book-info-section">
          <div className="book-header">
            <h1 className="book-title">{book.title}</h1>
            <p className="book-author">by 
            {book.authors && book.authors.length > 0
              ? book.authors.map((a) => a.name).join(", ")
              : "Unknown Author"}</p>
          </div>

          {/* Price */}
          <div className="book-price-section">
            <span className="price-label">Price:</span>
            <span className="book-price">₹{book.price}</span>
          </div>

          {/* Description */}
          {book.description && (
            <div className="book-description">
              <h3>Description</h3>
              <p>{book.description}</p>
            </div>
          )}

          {/* Additional Info */}
          <div className="book-metadata">
            {book.genre && (
              <div className="metadata-item">
                <span className="metadata-label">Genre:</span>
                <span className="metadata-value">{book.genre}</span>
              </div>
            )}
            {book.publicationYear && (
              <div className="metadata-item">
                <span className="metadata-label">Published:</span>
                <span className="metadata-value">{book.publicationYear}</span>
              </div>
            )}
            {book.isbn && (
              <div className="metadata-item">
                <span className="metadata-label">ISBN:</span>
                <span className="metadata-value">{book.isbn}</span>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="quantity-section">
            <label className="quantity-label">Quantity:</label>
            <div className="quantity-controls">
              <button
                className="quantity-btn minus"
                onClick={handleMinusQuantity}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="quantity-display">{quantity}</span>
              <button className="quantity-btn plus" onClick={handlePlusQuantity}>
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className={`btn btn-add-cart ${addedToCart ? "added" : ""}`}
              onClick={handleAddToCart}
            >
              {addedToCart ? (
                <>
                  <span className="checkmark">✓</span> Added to Cart
                </>
              ) : (
                <>
                  <span className="cart-icon">🛒</span> Add to Cart
                </>
              )}
            </button>
            <button className="btn btn-buy-now">
              <span className="lightning-icon">⚡</span> Buy Now
            </button>
          </div>

          {/* Stock Status */}
          <div className="stock-status">
            <span className="stock-indicator available"></span>
            <span className="stock-text">In Stock - Ready to Ship</span>
          </div>

          
        </div>
        <Reviews bookId={book.bookId}  />
      </div>
    </div>
  );
}

export default BookDetail;