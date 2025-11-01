import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../Config/axiosConfig";
import Navbar from "../Components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import RecommendationsModal from "../Components/RecommendationsModal";
import { addToCart } from "../stores/cart";
import "../style/BookList.css";

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [addedBooks, setAddedBooks] = useState({});
  const carts = useSelector((store) => store.cart.items);
  const dispatch = useDispatch();
  const userData = useSelector(store => store.user.userData); 
  const userId = userData?.userId;
  const [recommendedBooks,setRecommendedBooks] = useState({});
  const [showRecommendations, setShowRecommendations] = useState(false);

   
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
    setLoading(true);
    axiosInstance.get("/getbooks")
      .then((res) => {
        setBooks(res.data);
        console.log("user id",userId);
        
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

  }, []);

  useEffect(()=>{

    setRecommendedBooks(null);
  if (!userData?.userId) {
    console.log("No userId available yet");
    return;
  }
       let isCancelled = false;

         console.log("Fetching recommendations for userId:", userData.userId);
      axiosInstance.get(`/recommend/hybrid/${userId}`)
    .then(res => {
      if(!isCancelled){
      setRecommendedBooks(res.data);
      console.log("res.data:",res.data);

                if (res.data && res.data.length > 0) {
            // Delay modal appearance for better UX
            setTimeout(() => {
              setShowRecommendations(true);
            }, 1000);
          }
      
      }
    })
    .catch(err => {
      if(!isCancelled)   
      console.error(err)
  });
    
    return()=>{
      isCancelled = true;
    };
    

  },[userData?.userId])

useEffect(() => {
  if (recommendedBooks) {
    console.log("Recommended books state updated:", recommendedBooks);
  }
}, [recommendedBooks]);

  const handleCloseModal = () => {
    setShowRecommendations(false);
  };

  // Group books by genre
  const groupedBooks = books.reduce((acc, book) => {
    if (!acc[book.genre]) acc[book.genre] = [];
    acc[book.genre].push(book);
    return acc;
  }, {});

  // Get all unique genres
  const allGenres = ["All", ...Object.keys(groupedBooks)];

  // Filter books based on search and genre
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.authors &&
        book.authors.some((a) =>
          a.name.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    const matchesGenre =
      selectedGenre === "All" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Regroup filtered books
  const displayedBooks = filteredBooks.reduce((acc, book) => {
    if (!acc[book.genre]) acc[book.genre] = [];
    acc[book.genre].push(book);
    return acc;
  }, {});

  if (loading) {
    return (
      <>
       
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading amazing books...</p>
        </div>
      </>
    );
  }

  return (
    <>
            {/* Recommendations Modal */}
      {showRecommendations && recommendedBooks && recommendedBooks.length > 0 && (
        <RecommendationsModal 
          recommendedBooks={recommendedBooks}
          onClose={handleCloseModal}
        />
      )}

      <div className="booklist-container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">Discover Your Next Great Read</h1>
          <p className="hero-subtitle">
            Explore our collection of {books.length}+ amazing books
          </p>

           {/* Show Recommendations Button (if available) */}
          {recommendedBooks && recommendedBooks.length > 0 && (
            <button 
              className="show-recommendations-btn"
              onClick={() => setShowRecommendations(true)}
            >
              ✨ View Your Personalized Recommendations
            </button>
          )}

          {/* Search Bar */}
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Genre Filter */}
          <div className="genre-filter">
            {allGenres.map((genre) => (
              <button
                key={genre}
                className={`genre-btn ${
                  selectedGenre === genre ? "active" : ""
                }`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Books Display */}
        <div className="books-content">
          {Object.keys(displayedBooks).length === 0 ? (
            <div className="no-results">
              <span className="no-results-icon">📚</span>
              <h3>No books found</h3>
              <p>Try adjusting your search or filter</p>
            </div>
          ) : (
            Object.keys(displayedBooks).map((genre) => (
              <div key={genre} className="genre-section">
                <div className="genre-header">
                  <h2 className="genre-title">{genre}</h2>
                  <span className="genre-count">
                    {displayedBooks[genre].length} books
                  </span>
                </div>

                <div className="books-grid">
                  {displayedBooks[genre].map((book) => (
                    <div key={book.bookId} className="book-card">
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
                          <span className="badge badge-out-stock">
                            Out of Stock
                          </span>
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
                                  <span className="cart-icon-small">🛒</span>{" "}
                                  Add
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
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default BookList;