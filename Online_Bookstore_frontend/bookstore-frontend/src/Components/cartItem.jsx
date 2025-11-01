import axios from "axios";
import "../style/CartItem.css"
import { useDispatch } from "react-redux";
import { changeQuantity } from "../stores/cart";
import { useState,useEffect } from "react";
import axiosInstance from "../Config/axiosConfig";

const CartItem = ({ data }) => {
  const { bookId, quantity } = data;
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`/getbook/${bookId}`)
      .then(res => {
        setDetail(res.data);
        console.log(detail);
        
        setLoading(false);
      })
      .catch(err => {
        console.log(err)
        setError("Failed to load book details");
        setLoading(false);
      });
  }, [bookId]);

  console.log(detail);

   const handleMinusQuantity = ()=>{
    dispatch(changeQuantity({
        bookId:bookId,
        quantity:quantity - 1
    }));
 }

 const handlePlusQuantity = ()=>{
    dispatch(changeQuantity({
        bookId:bookId,
        quantity:quantity+1
    }));
 }

   if (loading) {
    return (
      <div className="cart-item">
        <div className="cart-item-loading">Loading...</div>
      </div>
    );
  }

    if (error || !detail) {
    return (
      <div className="cart-item">
        <div className="cart-item-error">Error loading book</div>
      </div>
    );
  }

  const bookImage =  detail.imageUrl;
  const bookName = detail.title;
  const bookPrice = detail.price;

    return (
    <div className="cart-item">
      <img src={bookImage} alt="" className="cart-item-image" />
      <div className="cart-item-info">
        <h3>{bookName}</h3>
        <p>{bookPrice * quantity}</p>
        <div className="cart-item-quantity">
          <button className="quantity-btn" onClick={handleMinusQuantity}>-</button>
          <span>{quantity}</span>
          <button className="quantity-btn" onClick={handlePlusQuantity}>+</button>
        </div>
      </div>
    </div>
  );
};

export default CartItem
