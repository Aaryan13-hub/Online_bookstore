package com.aryan.service;

import com.aryan.model.Books;
import com.aryan.model.Users;
import com.aryan.repo.BooksRepository;
import com.aryan.repo.ReviewRepository;
import com.aryan.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookRecommendationService {

    @Autowired
    private BooksRepository booksRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Books> recommendBooksForUser(int userId){
        Users user = userRepository.findById(userId).orElse(null);

        if(user == null)return Collections.emptyList();

        String favGenre = user.getFavouriteGenre();


        if(favGenre!=null && !favGenre.trim().isEmpty()){
            return getTopRatedBooksByGenre(favGenre);
        }

        List<String> reviewedGenres = reviewRepository.findDistinctGenresByUserId(userId);


        if(!reviewedGenres.isEmpty()){
            String topGenre = getMostFrequentGenre(reviewedGenres);
            return getTopRatedBooksByGenre(topGenre);
        }

        

        return getTopRatedBooksOverall();

    }

    private List<Books> getTopRatedBooksOverall() {
        List<Books> allBooks = booksRepository.findAll();
        allBooks.sort((b1, b2) -> {
            double avg1 = reviewRepository.getAverageRatingByBookId(b1.getBookId());
            double avg2 = reviewRepository.getAverageRatingByBookId(b2.getBookId());
            return Double.compare(avg2, avg1);
        });
        return allBooks.stream().limit(5).collect(Collectors.toList());
    }

    private String getMostFrequentGenre(List<String> reviewedGenres) {
        return reviewedGenres.stream()
                .collect(Collectors.groupingBy(g->g,Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
    }

    private List<Books> getTopRatedBooksByGenre(String favGenre) {
        List<Object[]> results = booksRepository.getTopRatedBooksByGenreProcedure(favGenre);
        List<Books> books = new ArrayList<>();

        for (Object[] row : results) {
            Books book = new Books();
            book.setBookId((Integer) row[0]);
            book.setTitle((String) row[1]);
            book.setGenre((String) row[2]);
            book.setPrice(((Number) row[3]).doubleValue());
            book.setStock((Integer) row[4]);
            book.setImageUrl((String) row[5]);
            book.setSlug((String) row[6]);
            book.setAuthor((String) row[7]);

            books.add(book);
        }
        return books;
    }
}
