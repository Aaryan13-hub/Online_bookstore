import React, { useState, useEffect } from "react";
import "../style/Profile.css";
import axiosInstance from "../Config/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, setLoading, setError } from "../stores/users";

function Profile() {
  const dispatch = useDispatch();
  const isLoading = useSelector((store) => store.user.isLoading);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    birthdate: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    favouriteGenre: "",
    occupation: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch user profile when page loads
  useEffect(() => {
    const fetchProfile = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axiosInstance.get("/get-profile");
        setFormData(res.data);
        dispatch(setUserData(res.data));
        console.log("profile data: ",res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchProfile();
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");

    try {
      await axiosInstance.put("/update-profile", {
        username: formData.username,
        phone: formData.phone,
        birthdate: formData.birthdate,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        favouriteGenre: formData.favouriteGenre,
        occupation: formData.occupation,
      });

      dispatch(setUserData(formData));
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("❌ Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="spinner-large"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="avatar-section">
            <div className="avatar-wrapper">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="User Avatar"
                className="profile-avatar"
              />
              <div className="avatar-badge">
                <span>✓</span>
              </div>
            </div>
            <h3 className="profile-name">{formData.username || "User"}</h3>
            <p className="profile-email">{formData.email || "user@mail.com"}</p>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-icon">📚</span>
              <div className="stat-info">
                <p className="stat-label">Favorite Genre</p>
                <p className="stat-value">
                  {formData.favouriteGenre || "Not set"}
                </p>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">💼</span>
              <div className="stat-info">
                <p className="stat-label">Occupation</p>
                <p className="stat-value">{formData.occupation || "Not set"}</p>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📍</span>
              <div className="stat-info">
                <p className="stat-label">Location</p>
                <p className="stat-value">
                  {formData.city
                    ? `${formData.city}, ${formData.country}`
                    : "Not set"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="profile-form-container">
          <div className="form-header">
            <h2 className="form-title">
              <span className="title-icon">⚙️</span>
              Profile Settings
            </h2>
            <p className="form-subtitle">Manage your account information</p>
          </div>

          {successMessage && (
            <div className="success-banner">
              <span className="success-icon">✓</span>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="form-section">
              <h3 className="section-title">Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="username">
                    <span className="label-icon">👤</span>
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <span className="label-icon">✉️</span>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    <span className="label-icon">📱</span>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Contact Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="birthdate">
                    <span className="label-icon">🎂</span>
                    Birth Date
                  </label>
                  <input
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="occupation">
                    <span className="label-icon">💼</span>
                    Occupation
                  </label>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    placeholder="Your profession"
                    value={formData.occupation}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="favouriteGenre">
                    <span className="label-icon">📖</span>
                    Favorite Genre
                  </label>
                  <input
                    type="text"
                    id="favouriteGenre"
                    name="favouriteGenre"
                    placeholder="Favorite book genre"
                    value={formData.favouriteGenre}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="form-section">
              <h3 className="section-title">Address Information</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="address">
                    <span className="label-icon">🏠</span>
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Enter your street address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">
                    <span className="label-icon">🏙️</span>
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Your city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">
                    <span className="label-icon">🗺️</span>
                    State/Region
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    placeholder="State or region"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">
                    <span className="label-icon">🌍</span>
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    placeholder="Your country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pincode">
                    <span className="label-icon">📮</span>
                    Pincode
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    placeholder="Postal code"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="save-btn" disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="btn-spinner"></span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="btn-icon">💾</span>
                  Save Profile
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;