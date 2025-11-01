package com.aryan.service;


import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Arrays;
import java.util.List;

@Service
public class CFClientService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String CF_URL = "http://localhost:8000/recommend/user/";

    public List<RecommendedBook> getUserCFRecommendations(int userId, int limit) {
        String url = CF_URL + userId + "?n=" + limit;

        RecommendedBook[] response = restTemplate.getForObject(url, RecommendedBook[].class);

        return Arrays.asList(response);
    }
}