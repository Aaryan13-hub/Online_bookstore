import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import "../style/Auth.css";
import axiosInstance from "../Config/axiosConfig";

function Login() {
  const navigate = useNavigate();
   const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setMessage(""); // Clear message when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await axiosInstance.post("/login", credentials, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data === "invalid credentials") {
        setMessage("Invalid email or password");
        setMessageType("error");
        setIsLoading(false);
      } else {
        // Save JWT token to localStorage
        login(res.data.token,res.data.user);
        setMessage("Login successful! Redirecting...");
        setMessageType("success");
        
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setMessage("Login failed. Please try again.");
      setMessageType("error");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="branding-content">
            <div className="brand-logo">📚</div>
            <h1 className="brand-title">BookStore</h1>
            <p className="brand-tagline">
              Your gateway to endless stories and knowledge
            </p>
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Thousands of books</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Fast delivery</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="auth-form-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2 className="auth-title">Welcome Back</h2>
              <p className="auth-subtitle">Login to your account to continue</p>
            </div>

            {message && (
              <div className={`auth-message ${messageType}`}>
                <span className="message-icon">
                  {messageType === "success" ? "✓" : "⚠"}
                </span>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">
                  <span className="label-icon">✉️</span>
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <span className="label-icon">🔒</span>
                  Password
                </label>
                <div className="input-wrapper password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="auth-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🚀</span>
                    Login
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="social-login">
              <button className="social-btn google">
                <span className="social-icon">🔵</span>
                Continue with Google
              </button>
              <button className="social-btn facebook">
                <span className="social-icon">📘</span>
                Continue with Facebook
              </button>
            </div>

            <div className="auth-footer">
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="auth-link">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;