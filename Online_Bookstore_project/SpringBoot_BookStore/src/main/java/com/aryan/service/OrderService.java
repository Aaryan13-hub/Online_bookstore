package com.aryan.service;

import com.aryan.dto.OrderItemRequest;
import com.aryan.dto.OrderRequest;
import com.aryan.model.Books;
import com.aryan.model.Order;
import com.aryan.model.OrderItem;
import com.aryan.model.Users;
import com.aryan.repo.BooksRepository;
import com.aryan.repo.OrderItemRepository;
import com.aryan.repo.OrderRepository;
import com.aryan.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class OrderService {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Autowired
    BooksRepository booksRepository;

    public Order createOrder(OrderRequest orderRequest) {

        Users user = userRepository.findById(orderRequest.getUserId())
                .orElseThrow(()->new RuntimeException("User not found"));

        Order order = new Order();
        order.setUsers(user);


        order.setOrderDate(new Date());
        order.setTotalAmount(orderRequest.getTotalAmount());

        Order savedOrder = orderRepository.save(order);

        for(OrderItemRequest orderItemRequest : orderRequest.getOrderItems()){
            Books book = booksRepository.findById(orderItemRequest.getBookId())
                    .orElseThrow(()->new RuntimeException("book not found"));

            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(savedOrder);
            orderItem.setBook(book);
            orderItem.setQuantity(orderItemRequest.getQuantity());

            orderItemRepository.save(orderItem);
        }



        return savedOrder;


    }
}
