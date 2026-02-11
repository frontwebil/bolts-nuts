// OrderPageWrapper.tsx
"use client";

import "./style.css";
import Image from "next/image";
import { Breadcrums } from "../breadcrums/Breadcrums";
import { OrderLayout } from "./OrderLayout/OrderLayout";
import { OrderTotal } from "./OrderTotal/OrderTotal";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  setAvaliableAddresses,
  setShippingAdress,
  setUserData,
  userDataType,
} from "@/redux/main/slices/orderCartSlice";
import { useEffect } from "react";
import { RootState } from "@/redux/main/store";
import { useRouter } from "next/navigation";

type AddressState = {
  postalCode: string;
  city: string;
  province: string;
  address: string; // вже нормалізовано
  company?: string;
  apartment?: string;
  userId?: string;
};

export function OrderPageWrapper({
  userData,
  addresses,
  mainAddress, // правильне ім'я
}: {
  userData: userDataType;
  addresses: AddressState[] | null;
  mainAddress: AddressState | null;
}) {
  const router = useRouter();

  const dispatch = useDispatch();
  const { shippingAddress, orderProducts } = useSelector(
    (store: RootState) => store.orderCartSlice,
  );

  useEffect(() => {
    if (
      userData.email !== "" ||
      userData.name !== "" ||
      userData.phoneNumber !== "" ||
      userData.surname !== ""
    ) {
      dispatch(setUserData(userData));
    }
  }, [dispatch, userData]);

  useEffect(() => {
    if (!addresses?.length) return;

    dispatch(setAvaliableAddresses(addresses));

    if (shippingAddress.postalCode.length <= 0) {
      dispatch(
        setShippingAdress({
          postalCode: mainAddress?.postalCode ?? "",
          city: mainAddress?.city ?? "",
          province: mainAddress?.province ?? "",
          address: mainAddress?.address ?? "",
          company: mainAddress?.company ?? "",
          apartment: mainAddress?.apartment ?? "",
        }),
      );
    }
  }, [addresses, mainAddress, dispatch]);

  useEffect(() => {
    if (orderProducts && orderProducts.length <= 0) {
      router.replace("/");
    }
  }, [orderProducts]);

  return (
    <div className="container">
      <Link href={"/"} className="logo-order-page">
        <Image src={"/logo.svg"} alt="logo-order" width={270} height={70} />
      </Link>
      <Breadcrums
        links={[
          { title: "Home", href: "/catalog" },
          { title: "Cart", href: "/cart" },
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
