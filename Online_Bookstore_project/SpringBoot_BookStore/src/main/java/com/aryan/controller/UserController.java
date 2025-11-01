package com.aryan.controller;

import java.nio.channels.NonReadableChannelException;
import java.util.Optional;

import com.aryan.dto.LoginResponse;
import org.hibernate.query.NativeQuery.ReturnableResultNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.aryan.model.Users;
import com.aryan.repo.UserRepository;
import com.aryan.service.UsersService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class UserController {
 
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private UsersService usersService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@PostMapping("/register") 
	public Users createUser(@RequestBody Users user) { 
		user.setPassword(passwordEncoder.encode(user.getPassword())); 
		return userRepository.save(user); 
		
	}

	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody Users requestUser) {
		
		String token = usersService.verify(requestUser);
		if (token.equals("invalid credentials")) {
			return ResponseEntity.status(401).body("Invalid credentials");
		}

		Users user = userRepository.findByEmail(requestUser.getEmail());

		return ResponseEntity.ok(new LoginResponse(token, user));
		
	}

	
	@PutMapping("/update-profile")
	public ResponseEntity<String> updateProfile(@RequestBody Users updatedUser,Authentication authentication){
		
		return usersService.updateProfile(updatedUser,authentication);
	}
	
	@GetMapping("/get-profile")
	public 	ResponseEntity<?>	getProfile(Authentication authentication){
		return usersService.getProfile(authentication);
	}


}
