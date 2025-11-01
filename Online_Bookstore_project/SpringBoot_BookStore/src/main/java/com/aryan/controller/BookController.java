package com.aryan.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.aryan.service.BookRecommendationService;
import com.aryan.service.CFClientService;
import com.aryan.service.RecommendedBook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aryan.dto.BookRequest;
import com.aryan.model.Books;
import com.aryan.service.BooksService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class BookController {

	@Autowired
	private BooksService booksService;

	@Autowired
	CFClientService cfClientService;

	@Autowired
	BookRecommendationService bookRecommendationService;
	
	@PostMapping("/add")
	public Books addBook(@RequestBody BookRequest request) {
		return booksService.saveBookWithAuthors(request);
	}


	@GetMapping("/getbook/{bookId}")
	public Optional<Books> getBook(@PathVariable int bookId){
		return booksService.getBook(bookId);
	}

	@GetMapping("/getbooks")
	public List<Books> getAllBooks(){
		return booksService.getAllBooks();
	}
	
	@PutMapping("/update/{id}")
	public Books updateBook(@PathVariable int id, @RequestBody BookRequest request) throws IOException {
		return booksService.updateBook(id,request);
	}
	
	@DeleteMapping("/delete/{id}")
	public String deleteBook(@PathVariable int id) {
		return booksService.deleteBook(id);
	}
	
	@PostMapping("/upload")
	public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file){
		
		return booksService.uploadImage(file);
		
	}

	@GetMapping("/books/{slug}")
	public Books getBookBySlug(@PathVariable String slug){
		Books book = booksService.getBookBySlug(slug);
		if(book==null){
			throw new RuntimeException("Book not found with slug:"+slug);
		}
		return book;
	}

	@GetMapping("/recommend/content/{userId}")
	public ResponseEntity<?> getRecommendations(@PathVariable int userId){
		List<Books> recommended = bookRecommendationService.recommendBooksForUser(userId);
		return ResponseEntity.ok(recommended);
	}

	@GetMapping("/recommend/hybrid/{userId}")
	public List<Books> getHybridRecommendations(@PathVariable int userId) {

		// CF recommendations first
		List<RecommendedBook> cfRecs = cfClientService.getUserCFRecommendations(userId, 10);
		List<Books> cfBooks = new ArrayList<>();
		// If CF gives enough items, return it
		for (RecommendedBook rec : cfRecs) {
			booksService.getBook(rec.getBookId()).ifPresent(cfBooks::add);
		}

		// If CF gave enough, return mapped books
		if (!cfBooks.isEmpty()) return cfBooks;

		// Else fallback to content-based recommendations
		return bookRecommendationService.recommendBooksForUser(userId);
	}
}
