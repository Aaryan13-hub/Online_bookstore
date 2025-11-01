package com.aryan.dto;

import java.util.List;


public class BookRequest {

    private String title;
    private String genre;
    private Double price;
    private Integer stock;

    
    


	private List<String> authorNames; 
	
    private String imageUrl;

   
    public BookRequest() {
    	
    }

    
    public BookRequest(String title, String genre, Double price, Integer stock,List<String> authorNames, 
    		String imageUrl) {
		super();
		this.title = title;
		this.genre = genre;
		this.price = price;
		this.stock = stock;
		this.authorNames = authorNames;
		this.imageUrl = imageUrl;
	}


	public BookRequest(Double price, Integer stock) {
		super();
		this.price = price;
		this.stock = stock;
	}


	public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public List<String> getAuthorNames() {
        return authorNames;
    }

    public void setAuthorNames(List<String> authorNames) {
        this.authorNames = authorNames;
    }
    
    public String getImageUrl() {
		return imageUrl;
	}


	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

    @Override
    public String toString() {
        return "BookRequest [title=" + title + ", genre=" + genre + ", price=" + price + ", stock=" + stock
                + ", authorIds=" + authorNames + "]";
    }
}
