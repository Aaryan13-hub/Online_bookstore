package com.aryan.repo;

import com.aryan.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review,Integer> {
    List<Review> findByBooks_BookId(int bookId);


    // NEW:
    List<Review> findByUsers_UserId(int userId);

//    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.books.bookId = :bookId")
    @Procedure(procedureName = "GetAverageRatingByBookId")
    Double getAverageRatingByBookId(@Param("bookId") int bookId);

    @Query("SELECT DISTINCT r.books.genre FROM Review r WHERE r.users.userId = :userId")
    List<String> findDistinctGenresByUserId(@Param("userId") int userId);


}
