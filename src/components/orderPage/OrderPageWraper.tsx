"use client";

import "./style.css";
import Image from "next/image";
import { Breadcrums } from "../breadcrums/Breadcrums";
import { OrderLayout } from "./OrderLayout/OrderLayout";
import { OrderTotal } from "./OrderTotal/OrderTotal";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setUserData, userDataType } from "@/redux/main/slices/orderCartSlice";
import { useEffect } from "react";

export function OrderPageWrapper({
  userData,
}: {
  userData: userDataType | null;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userData) {
      return;
    }
    dispatch(setUserData(userData));
  }, [dispatch, userData]);

  return (
    <div className="container">
      <Link href={"/"} className="logo-order-page">
        <Image src={"/logo.PNG"} alt="logo-order" width={270} height={70} />
      </Link>
      <Breadcrums
        links={[
          { title: "Home", href: "/catalog" },
          {
            title: "Cart",
            href: "/cart",
          },
          { title: "Order" },
        ]}
      />
      <div className="OrderPage-container">
        <OrderLayout />
        <OrderTotal />
      </div>
    </div>
  );
}
