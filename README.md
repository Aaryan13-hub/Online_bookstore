# Online Bookstore With Reviews and Recommendations

## Overview :
This project is a modern Online Bookstore that integrates:
- Spring Boot Backend(Authentication, Orders, Reviews, Business Logic)
- React Frontend (User Interface and Interaction)
- Python FastAPI Recommendation Engine (Collaborative Filtering + Hybrid Model)

The system provides:
- Secure login using JWT  
- Smart personalized book recommendations  
- Real-time stock validation  
- Order placement & review handling  
- Admin controls for managing inventory

## Technologies Used :
Frontend : React, Axios, Redux
Backend : Spring Boot, Spring security (JWT)
Database : MySQL
Recommendation Model : Python, FastAPI, NumPy, Pandas, sckit-learn
Deployment style : Local Microservices Architecture

## Steps to setup and run the project :
1.Clone the repository n your local machine
use this command in git or cmd : "git clone https://github.com/Aaryan13-hub/Online_bookstore.git"

2.Setup and run backend (Spring boot via IntelliJ IDEA)
i)Install and open IntelliJ-IDEA -> File -> Open folders as->Online_bookstore->Online_Bookstore_project ->SpringBoot_BookStore
ii)Wait for Maven to download dependencies
iii)Configure JDK → JDK 17
iv)Create DB in MySQL as follows : 
	CREATE DATABASE onlinebookstore;
	USE onlinebookstore;

## Run below script to create all tables :
	-- -------------------------------
-- Users Table
-- -------------------------------
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    phone VARCHAR(255),
    role VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255),
    pincode VARCHAR(255),
    occupation VARCHAR(255),
    favourite_genre VARCHAR(255),
    birthdate DATETIME(6)
);

-- -------------------------------
-- Authors Table
-- -------------------------------
CREATE TABLE authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);

-- -------------------------------
-- Books Table
-- -------------------------------
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    genre VARCHAR(255),
    price DOUBLE,
    stock INT,
    image_url VARCHAR(255),
    slug VARCHAR(255),
    author VARCHAR(255)
);

-- -------------------------------
-- Mapping Table (Many-to-Many: Book ↔ Author)
-- -------------------------------
CREATE TABLE book_author (
    book_id INT,
    author_id INT,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE
);

-- -------------------------------
-- Orders Table
-- -------------------------------
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_date DATETIME(6),
    total_amount DECIMAL(10,2),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- -------------------------------
-- Order Items Table
-- -------------------------------
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    book_id INT,
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

-- -------------------------------
-- Reviews Table
-- -------------------------------
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    book_id INT,
    rating INT,
    review_text VARCHAR(500),
    review_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

Open application.properties and update credentials:

spring.datasource.url=jdbc:mysql://localhost:3306/onlinebookstore
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
//keep else part as it is

3.Run app:
i)Open SpringBootBookStoreApplication.java-> Right-click  → Run 
ii)http://localhost:8080 

4. Setup & Run Python Microservice (PyCharm)
i)setup and run virtual environment :
cd recommendation-cf-service
python -m venv venv
ii)Activate it:venv\Scripts\activate
iii)Install Required Libraries
pip install -r requirements.txt

(If missing, use:)
pip install fastapi uvicorn numpy pandas scikit-learn requests matplotlib	
iv) Run the Recommendation Service :  uvicorn app:app --reload --port 8000
v)Service runs at : http://localhost:8000

5.Setup and run React Frontend (VS code)
i)Open folder named 'Online_Bookstore_frontend' in VS Code
ii)Install dependencies : npm install
iii)Ensure backend API is set in axiosConfig.js : const BASE_URL = "http://localhost:8080";
iv)Start Frontend : npm run dev



