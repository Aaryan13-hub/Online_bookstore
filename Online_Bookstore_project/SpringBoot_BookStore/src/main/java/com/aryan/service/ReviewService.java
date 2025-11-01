package com.aryan.service;

import com.aryan.dto.ReviewRequest;
import com.aryan.model.Books;
import com.aryan.model.Review;
import com.aryan.repo.BooksRepository;
import com.aryan.repo.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    BooksRepository booksRepository;

    @Autowired
    ReviewRepository reviewRepository;

    public Review addReview(ReviewRequest reviewRequest) {
        Books book = booksRepository.findById(reviewRequest.getBookId())
                .orElseThrow(()->new RuntimeException("book not found"));

        Review review = new Review();
        review.setBooks(book);
        review.setUsers(reviewRequest.getUser());
        review.setReviewText(reviewRequest.getReviewText());
        review.setRating(reviewRequest.getRating());

        reviewRepository.save(review);

        return review;
    }

    public List<Review> getAllReviewsByBook(int bookId) {
        return reviewRepository.findByBooks_BookId(bookId);
    }

    public List<Review> getReviewsByUser(int userId) {
        return reviewRepository.findByUsers_UserId(userId);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
}
