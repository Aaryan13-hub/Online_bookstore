import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState,useEffect } from 'react';
import CartItem from './cartItem.jsx';
import "../style/CartTab.css";
import { toggleStatusTab } from '../stores/cart.js';
import axios from 'axios';
import axiosInstance from '../Config/axiosConfig.js';

const CartTab = () => {
  const dispatch = useDispatch();
  const carts = useSelector(store => store.cart.items);
  const statusTab = useSelector(store => store.cart.statusTab);
   const userData = useSelector(store => store.user.userData);  

  const [totalAmount, setTotalAmount] = useState(0);
  const [bookDetails, setBookDetails] = useState({});
  const [loading, setLoading] = useState(false);

    useEffect(() => {
    const fetchBookDetails = async () => {
      const details = {};
      
      for (const item of carts) {
        try {
          const res = await axiosInstance.get(`/getbook/${item.bookId}`);
          details[item.bookId] = res.data;
        } catch (error) {
          console.error(`Error fetching book ${item.bookId}:`, error);
        }
      }
      
      setBookDetails(details);
    };

    if (carts.length > 0) {
      fetchBookDetails();
    }
  }, [carts]);


    useEffect(() => {
    let total = 0;
    carts.forEach(item => {
      const book = bookDetails[item.bookId];
      
      
      
 if (book && book.price !== undefined) {
        console.log(`Book ${item.bookId} price: ${book.price}`);
        total += book.price * item.quantity;
      }
    });
    setTotalAmount(total);
  }, [carts, bookDetails]);

  const handleClose = ()=>{
    dispatch(toggleStatusTab());
  }

  const handleCheckOut = async()=>{

     if (userData) {
      console.log("User data:", userData);
      
      if (carts.length === 0) {
      alert("Your cart is empty");
      return;
    } 
      // Proceed with checkout logic

         const orderData = {
      userId: userData.userId, 
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      orderItems: carts.map(item => ({
        bookId: item.bookId,
        quantity: item.quantity
      }))
    };

     console.log("Order data to be sent:", orderData);

     try {
      
            const response = await axiosInstance.post('/orders/create', orderData, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`

        }

        
      });
      console.log("Order created successfully:", response.data);
      alert("✅ Order placed successfully!");

      dispatch(toggleStatusTab());
     } catch (error) {
      console.error("Error creating order:", error);
      alert("❌ Failed to place order. Please try again.");
     }
     finally{
      setLoading(false);
     }

    } else {
      alert("Please complete your profile before checkout");
    }
  }

  return (  
    <div className={`cart-tab ${statusTab ? "show" : "hide"}`}>
      {/* Header */}
      <h2 className="cart-header">Shopping Cart</h2>

      {/* User Info */}
      {userData && (
        <div className="cart-user-info">
          <p>Logged in as: {userData.username || userData.email}</p>
        </div>
      )}

      {/* Cart Items */}
      <div className="cart-items">

        {carts.length>0?(
        carts.map((item, key) => ( 
          <CartItem key={key} data={item} />
        ))
        ):(
          <p className="empty-cart">Your cart is empty</p>
        )}
      
      </div>

            {/* Total Amount */}
      {carts.length > 0 && (
        <div className="cart-total">
          <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
        </div>
      )}

      {/* Action Buttons */}
      <div className="cart-actions">
        <button onClick={handleClose} className="close-btn">CLOSE</button>
        <button  onClick={handleCheckOut} className="checkout-btn"  disabled={loading || carts.length === 0} >{loading ? "PROCESSING..." : "CHECKOUT"}</button>
      </div>
    </div>
  );
};

export default CartTab;
