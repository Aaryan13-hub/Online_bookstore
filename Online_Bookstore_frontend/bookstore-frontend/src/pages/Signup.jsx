import React, { useState } from "react";
import axiosInstance from "../Config/axiosConfig";
import "../style/Auth.css";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axiosInstance.post("/register", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        setIsError(false);
        setMessage("Registration successful!");
        setFormData({ username: "", email: "", password: "" }); // clear form
      }
    } catch (err) {
      console.error("Error registering user:", err);
      setIsError(true);
      setMessage("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        {/* Left Branding Side */}
        <div className="auth-branding">
          <div className="branding-content">
            <div className="brand-logo">📚</div>
            <h1 className="brand-title">BookVerse</h1>
            <p className="brand-tagline">Discover, Read, and Share your favorite books.</p>
            <div className="brand-features">
              <div className="feature-item">
                <div className="feature-icon">✨</div>
                Wide range of genres
              </div>
              <div className="feature-item">
                <div className="feature-icon">💬</div>
                Read & write reviews
              </div>
              <div className="feature-item">
                <div className="feature-icon">🛒</div>
                Smooth online purchase
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="auth-form-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2 className="auth-title">Create Account</h2>
              <p className="auth-subtitle">Join our book community today!</p>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`auth-message ${isError ? "error" : "success"}`}
              >
                <div className="message-icon">
                  {isError ? <FaExclamationCircle /> : <FaCheckCircle />}
                </div>
                {message}
              </div>
            )}

            {/* Signup Form */}
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">
                  <FaUser className="label-icon" /> Full Name
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope className="label-icon" /> Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group password-input">
                <label htmlFor="password">
                  <FaLock className="label-icon" /> Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? <div className="btn-spinner"></div> : "Sign Up"}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{" "}
                <a href="/login" className="auth-link">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
