package com.aryan.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aryan.model.Users;
import java.util.List;


public interface UserRepository extends JpaRepository<Users, Integer> {

	Users findByEmail(String email);
}
