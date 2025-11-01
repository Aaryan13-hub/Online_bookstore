package com.aryan.dto;

import com.aryan.model.OrderItem;

import java.math.BigDecimal;
import java.util.List;

public class OrderRequest {
    private int userId;
    private BigDecimal totalAmount;
    private List<OrderItemRequest> orderItems;

    public OrderRequest() {
    }

    public OrderRequest(int userId, BigDecimal totalAmount, List<OrderItemRequest> orderItemsRequest) {
        this.userId = userId;
        this.totalAmount = totalAmount;
        this.orderItems = orderItemsRequest;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<OrderItemRequest> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemRequest> orderItems) {
        this.orderItems = orderItems;
    }
}
