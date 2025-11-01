import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../style/Navbar.css";
import carticon from "../assets/images/carticon.png";
import { useDispatch, useSelector } from "react-redux";
import { toggleStatusTab } from "../stores/cart";
import { useAuth } from "../Context/AuthContext";

function Navbar() {
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const carts = useSelector((store) => store.cart.items);
  const userData = useSelector((store) => store.user.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  // 🧮 Calculate total quantity in cart
  useEffect(() => {
    let total = 0;
    carts.forEach((item) => (total += item.quantity));
    setTotalQuantity(total);
  }, [carts]);

  // 🌫️ Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🚪 Handle Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🛒 Toggle Cart Tab
  const handleOpenTabCart = () => {
    dispatch(toggleStatusTab());
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <span className="logo-icon">📚</span>
          <h2 className="logo-text">BookStore</h2>
        </div>

        {/* Hamburger Menu */}
        <div className="hamburger" onClick={toggleMenu}>
          <span className={isMenuOpen ? "active" : ""}></span>
          <span className={isMenuOpen ? "active" : ""}></span>
          <span className={isMenuOpen ? "active" : ""}></span>
        </div>

        {/* Navigation Links */}
        <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <li className={isActive("/") ? "active" : ""}>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <span className="nav-icon">🏠</span> Home
            </Link>
          </li>

          <li className={isActive("/books") ? "active" : ""}>
            <Link to="/books" onClick={() => setIsMenuOpen(false)}>
              <span className="nav-icon">📖</span> Books
            </Link>
          </li>

          {isAuthenticated && isAdmin && (
            <li className={isActive("/admin") ? "active" : ""}>
              <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                <span className="nav-icon">⚙️</span> Admin Dashboard
              </Link>
            </li>
          )}

          {isAuthenticated && (
            <li className={isActive("/profile") ? "active" : ""}>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                <span className="nav-icon">👤</span> Profile
              </Link>
            </li>
          )}
        </ul>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* User Info */}
          {isAuthenticated && userData && (
            <div className="user-info">
              <span className="user-avatar">
                {userData.username
                  ? userData.username[0].toUpperCase()
                  : "U"}
              </span>
              <span className="user-name">{userData.username || "User"}</span>
            </div>
          )}

          {/* Cart Button */}
          {isAuthenticated && (
            <button className="cart-button" onClick={handleOpenTabCart}>
              <img src={carticon} alt="Cart" className="cart-icon" />
              {totalQuantity > 0 && (
                <span className="cart-badge">{totalQuantity}</span>
              )}
            </button>
          )}

          {/* Auth Buttons */}
          <div className="auth-buttons">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn-login">
                  Login
                </Link>
                <Link to="/signup" className="btn-signup">
                  Sign Up
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="btn-logout">
                <span className="logout-icon">🚪</span> Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
