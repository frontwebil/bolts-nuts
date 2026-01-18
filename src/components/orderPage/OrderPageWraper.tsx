"use client";

import "./style.css";
import Image from "next/image";
import { Breadcrums } from "../breadcrums/Breadcrums";
import { OrderLayout } from "./OrderLayout/OrderLayout";
import { OrderTotal } from "./OrderTotal/OrderTotal";
import Link from "next/link";
import { useDispatch } from "react-redux";
import {
  setShippingAdress,
  setUserData,
  userDataType,
} from "@/redux/main/slices/orderCartSlice";
import { useEffect } from "react";

type AddressState = {
  postalCode: string;
  city: string;
  province: string;
  addressLine: string;
  company?: string;
  apartment?: string;
  userId?: string;
};

export function OrderPageWrapper({
  userData,
  addresses,
}: {
  userData: userDataType;
  addresses: AddressState[] | null;
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setUserData(
        userData ?? {
          email: "",
          name: "",
          surname: "",
          phoneNumber: "",
        },
      ),
    );
  }, [dispatch, userData]);

  useEffect(() => {
    const mainAdress = addresses?.find((el) => el.userId);
    dispatch(
      setShippingAdress({
        postalCode: mainAdress?.postalCode ?? "",
        city: mainAdress?.city ?? "",
        province: mainAdress?.province ?? "",
        address: mainAdress?.addressLine ?? "",
        company: mainAdress?.company ?? "",
        apartment: mainAdress?.apartment ?? "",
      }),
    );
  }, [addresses]);

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
