package com.aryan.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aryan.model.Author;

public interface AuthorRepository extends JpaRepository<Author, Integer> {

	public Optional<Author> findByname(String name);
}
