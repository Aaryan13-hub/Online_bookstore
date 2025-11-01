package com.aryan.controller;

import com.aryan.dto.OrderRequest;
import com.aryan.model.Order;
import com.aryan.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class OrderController {

    @Autowired
    OrderService orderService;

    @PostMapping("/orders/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest){
        try{
            Order order = orderService.createOrder(orderRequest);
            return ResponseEntity.ok(order);
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }



    }

}
