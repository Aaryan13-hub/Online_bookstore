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


## 🔧 Steps to setup and run the project :
```
# Clone the repository in your local machine
"git clone https://github.com/Aaryan13-hub/Online_bookstore.git"
```

2.Setup and run backend (Spring boot via IntelliJ IDEA)
- Install and open IntelliJ-IDEA -> File -> Open folders as->Online_bookstore->Online_Bookstore_project ->SpringBoot_BookStore
- Wait for Maven to download dependencies
- Configure JDK → JDK 17
- Create DB in MySQL as follows : 
- CREATE DATABASE onlinebookstore;
	USE onlinebookstore;
- Run below script to create all tables :
	-- -------------------------------
-- Users Table
-- -------------------------------
```sql
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
```

-- -------------------------------
-- Authors Table
-- -------------------------------
```sql
CREATE TABLE authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);
```
-- -------------------------------
-- Books Table
-- -------------------------------
```sql
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
```
-- -------------------------------
-- Mapping Table (Many-to-Many: Book ↔ Author)
-- -------------------------------
```sql
CREATE TABLE book_author (
    book_id INT,
    author_id INT,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE
);
```

-- -------------------------------
-- Orders Table
-- -------------------------------
```sql
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_date DATETIME(6),
    total_amount DECIMAL(10,2),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

-- -------------------------------
-- Order Items Table
-- -------------------------------
```sql
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    book_id INT,
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);
```
-- -------------------------------
-- Reviews Table
-- -------------------------------
```sql
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
```

Open application.properties and update credentials:
```
spring.datasource.url=jdbc:mysql://localhost:3306/onlinebookstore
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
```
3.Run app:
- Open SpringBootBookStoreApplication.java-> Right-click  → Run 
- http://localhost:8080 

4.Setup & Run Python Microservice (PyCharm)
```
# setup and run virtual environment :
cd recommendation-cf-service
python -m venv venv
# Activate it
venv\Scripts\activate
# Install Required Libraries
pip install -r requirements.txt

# (If missing, use:)
pip install fastapi uvicorn numpy pandas scikit-learn requests matplotlib	
- Run the Recommendation Service :  uvicorn app:app --reload --port 8000
- Service runs at : http://localhost:8000
```
5.Setup and run React Frontend (VS code)
- Open folder named 'Online_Bookstore_frontend' in VS Code
- Install dependencies : npm install
- Ensure backend API is set in axiosConfig.js : const BASE_URL = "http://localhost:8080";
- Start Frontend : npm run dev

## 🛠️ Technologies Used
[Java](https://www.java.com/)- Core programming language
[Spring Boot](https://spring.io/projects/spring-boot)  - Backend framework for building REST APIs
[React](https://react.dev/) – Frontend user interface 
[Python](https://www.python.org/) – For Recommendation System
[MySQL](https://www.mysql.com/) – Database management system
[Spring Security](https://spring.io/projects/spring-security) – Authentication and authorization

## 🤝 Contributing
We welcome contributions! If you'd like to support the project:

Fork the repository
Create a new branch (git checkout -b feature-idea)
Commit your changes (git commit -m 'Add new feature')
Push to the branch (git push origin feature-idea)
Create a pull request

## 📄 License
This project is licensed under an [Open License](LICENSE).  
Feel free to use, modify, and distribute the project according to the license terms.
