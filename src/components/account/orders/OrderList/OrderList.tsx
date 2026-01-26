"use client";

import { Order } from "@prisma/client";
import "./style.css";
import { OrderCard } from "./OrderCard";

export function UserOrdersList({ orders }: { orders: Order[] }) {
  return (
    <div className="orders-container">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
