"use client";

import Link from "next/link";
import "./style.css";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/main/slices/orderCartSlice";
import { useEffect } from "react";

export default function PaymentSuccess() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);
  return (
    <div className="PaymentSuccess-container">
      <div className="PaymentSuccess-wrapper">
        <h2>
          Your order has been placed{" "}
          <span style={{ color: "#FF5A00" }}>successfully!</span>{" "}
        </h2>
        <h3>We’ve received your order and have started processing it.</h3>
        <Link href={"/catalog"}>Back to Shopping</Link>
        <p>
          You’ll receive a confirmation email shortly with your order details
          and tracking information.
        </p>
      </div>
    </div>
  );
}
