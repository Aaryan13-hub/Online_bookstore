import React from "react";
import { Outlet } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./Navbar";
import CartTab from "./cartTab";
import axiosInstance from "../Config/axiosConfig";
import { toggleStatusTab } from "../stores/cart";
import { useEffect,userState } from "react";
import { setUserData, setLoading, setError } from "../stores/users";
import "../style/Layout.css";

function Layout() {
  const statusTab = useSelector(store => store.cart.statusTab);
  const dispatch = useDispatch();


  const handleOverlayClick = () => {
    dispatch(toggleStatusTab());
  };

      useEffect(() => {
    const fetchProfile = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axiosInstance.get("/get-profile");
        
        dispatch(setUserData(res.data));
        console.log("profile data: ",res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        dispatch(setError(error.message));
         dispatch(setUserData(null));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchProfile();

      return () => {
    dispatch(setUserData(null));
  };
  }, [dispatch]);

  return (
    <div className="layout-container">
      <Navbar />
      <div className="main-content">
        <Outlet />
      </div>
      <div 
        className={`cart-overlay ${statusTab ? "show" : ""}`}
        onClick={handleOverlayClick}
      />
      <CartTab />
    </div>
  );
}

export default Layout;