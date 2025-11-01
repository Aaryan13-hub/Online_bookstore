package com.aryan.dto;

import com.aryan.model.Users;

public class LoginResponse {
    private String token;
    private Users user;

    public LoginResponse() {
    }

    public LoginResponse(String token, Users user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }
}
