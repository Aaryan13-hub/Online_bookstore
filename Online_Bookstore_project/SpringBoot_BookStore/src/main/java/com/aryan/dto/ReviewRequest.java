package com.aryan.dto;

import com.aryan.model.Users;

public class ReviewRequest {
private int bookId;
private Users user;
private String reviewText;
private int rating;

    public ReviewRequest() {
    }

    public ReviewRequest(int bookId, Users user, String reviewText, int rating) {
        this.bookId = bookId;
        this.user = user;
        this.reviewText = reviewText;
        this.rating = rating;
    }

    public int getBookId() {
        return bookId;
    }

    public void setBookId(int bookId) {
        this.bookId = bookId;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}
