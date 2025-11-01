package com.aryan.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aryan.dto.BookRequest;
import com.aryan.model.Author;
import com.aryan.model.Books;
import com.aryan.repo.AuthorRepository;
import com.aryan.repo.BooksRepository;

@Service
public class BooksService {

	@Autowired
	private BooksRepository booksRepo;
	
	@Autowired
	private AuthorRepository authorRepo;
	
	public Books saveBookWithAuthors(BookRequest request) {
		List<Author> authors = new ArrayList<>();
		
		for(String name : request.getAuthorNames()) {
			Author author = authorRepo.findByname(name)
							.orElseGet(()->authorRepo.save(new Author(0,name)));
			
			authors.add(author);
			
		}
		
		 	Books book = new Books();
		    book.setTitle(request.getTitle());
		    book.setGenre(request.getGenre());
		    book.setPrice(request.getPrice());
		    book.setStock(request.getStock());
		    book.setAuthors(authors);
		    book.setImageUrl(request.getImageUrl());

			book.setSlug(generateSlug(request.getTitle()));
		    
		    return booksRepo.save(book);
	}

	private String generateSlug(String title) {
		if(title==null)
			return null;
		return title
				.toLowerCase()
				.replaceAll("[^a-z0-9\\s]","")
				.replaceAll("\\s+","-");
	}

	public Books updateBook(int id, BookRequest request) throws IOException {
		 Books bobj =  booksRepo.findById(id).orElse(null);
		 bobj.setTitle(request.getTitle());
		 bobj.setGenre(request.getGenre());
		 bobj.setPrice(request.getPrice());
		 bobj.setStock(request.getStock());
		 
	        if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
	            bobj.setImageUrl(request.getImageUrl());
	        }

			bobj.setSlug(generateSlug(request.getTitle()));
		 
		 return booksRepo.save(bobj);
	}

	public String deleteBook(int id) {
		
		if(booksRepo.existsById(id)) {
			booksRepo.deleteById(id);
			return "Book deleted successfully";
		}
		else {
			return "Book not found!";	
		}
	}

	public List<Books> getAllBooks() {
		
		return booksRepo.findAll();
	}
	
	public ResponseEntity<String> uploadImage(MultipartFile file){
		String uploadDir = "uploads/";
		
		try {
			Path uploadPath = Paths.get(uploadDir);
			
			if(!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}
			
			String fileName = file.getOriginalFilename();
			Path filePath = uploadPath.resolve(fileName);
			Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
			
			 String fileUrl = "http://localhost:8080/uploads/" + fileName;
			 return ResponseEntity.ok(fileUrl);
			
		} catch (Exception e) {
			e.printStackTrace();
            return ResponseEntity.status(500).body("Image upload failed");
		}
	}


	public Books getBookBySlug(String slug) {
		return booksRepo.findBySlug(slug);
	}

	public Optional<Books> getBook(int bookId) {
		return booksRepo.findById(bookId);
	}
}
