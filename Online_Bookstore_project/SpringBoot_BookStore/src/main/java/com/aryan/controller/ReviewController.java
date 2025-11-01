package com.aryan.controller;

import com.aryan.dto.ReviewRequest;
import com.aryan.model.Review;
import com.aryan.repo.BooksRepository;

import com.aryan.repo.ReviewRepository;
import com.aryan.repo.UserRepository;
import com.aryan.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ReviewController {

    @Autowired
    ReviewService reviewService;

    @Autowired
    BooksRepository booksRepository;

    @Autowired
    UserRepository userRepository;

     @Autowired
    ReviewRepository reviewRepository;


     @GetMapping("/reviews/getreviews/{bookId}")
     public List<Review> getAllReviews(@PathVariable int bookId){
         return reviewService.getAllReviewsByBook(bookId);
     }

    @GetMapping("/user/{userId}")
    public List<Review> getReviewsByUser(@PathVariable int userId) {
        return reviewService.getReviewsByUser(userId); // implement in service
    }

    @GetMapping("/reviews")
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews(); // returns all reviews
    }

     @PostMapping("/reviews/add")
    public ResponseEntity<Review> addReview(@RequestBody ReviewRequest reviewRequest){
         Review review = reviewService.addReview(reviewRequest);

         return ResponseEntity.ok(review);
     }

}
