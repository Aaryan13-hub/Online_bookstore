package com.aryan.controller;

import com.aryan.model.Books;
import com.aryan.service.BooksService;
import com.aryan.service.CFClientService;
import com.aryan.service.RecommendedBook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/recommend")
@CrossOrigin
public class CFController {

    @Autowired
    private CFClientService cfClientService;

    @Autowired
    private BooksService booksService;

    @GetMapping("/cf/{userId}")
    public List<Books> recommendForUser(@PathVariable int userId, @RequestParam(defaultValue = "10") int n) {
        List<RecommendedBook> cfRecs = cfClientService.getUserCFRecommendations(userId, n);

        List<Books> results = new ArrayList<>();
        for (RecommendedBook rec : cfRecs) {
            Optional<Books> bookOpt = booksService.getBook(rec.getBookId());
            bookOpt.ifPresent(results::add);
        }
        return results;
    }
}
