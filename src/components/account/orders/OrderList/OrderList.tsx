"use client";

import { Order } from "@prisma/client";
import "./style.css";
import { OrderCard } from "./OrderCard";

type OrderAddress = {
  city: string;
  address: string;
  postalCode: string;
  province?: string;
  shippingName?: string;
};

type OrderItem = {
  title: string;
  quantity: number;
  price: number;
  variant: {
    label: string;
    value: string;
    unit?: string;
  };
};

export function UserOrdersList({ orders }: { orders: Order[] }) {
  return (
    <div className="orders-container">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
