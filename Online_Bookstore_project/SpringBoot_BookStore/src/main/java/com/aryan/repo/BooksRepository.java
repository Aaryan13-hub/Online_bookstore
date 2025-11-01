package com.aryan.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aryan.model.Books;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BooksRepository extends JpaRepository<Books, Integer> {

    Books findBySlug(String slug);

    @Query(value = "CALL GetTopRatedBooksByGenre(:genreName)", nativeQuery = true)
    List<Object[]> getTopRatedBooksByGenreProcedure(@Param("genreName") String genreName);
}
