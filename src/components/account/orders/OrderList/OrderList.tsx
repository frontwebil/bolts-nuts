"use client";

import { Order } from "@prisma/client";
import "./style.css";

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
      {orders.map((order) => {
        const address = order.address as OrderAddress;
        const items = Array.isArray(order.items)
          ? (order.items as OrderItem[])
          : [];

        return (
          <div key={order.id} className="order-card">
            {/* Header */}
            <div className="order-header">
              <div className="order-name">
                {order.name} {order.surname}
              </div>

              <div className="order-date">
                {new Date(order.createdAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {/* Address */}
            <div className="order-address">
              <strong>Address:</strong> {address?.address}, {address?.city},{" "}
              {address?.province}, {address?.postalCode}
            </div>

            {/* Status row */}
            <div className="order-status-row">
              <div className="order-shipping">
                <strong>Shipping:</strong> {address?.shippingName ?? "-"} (${order.shippingPrice})
              </div>

              {/* <div className="order-total">
                Total: ${order.total.toFixed(2)}
              </div> */}
            </div>

            {/* Items */}
            <div className="order-items">
              <div className="order-items-title">Items:</div>

              {items.map((item, idx) => (
                <div key={idx} className="order-item-row">
                  <div className="order-item-info">
                    <div className="order-item-title">{item.title}</div>
                    <div className="order-item-variant">
                      {item.variant.label}: {item.variant.value}{" "}
                      {item.variant.unit}
                    </div>
                  </div>

                  <div className="order-item-price">
                    {item.quantity} × ${item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="order-navigation"></div>
          </div>
        );
      })}
    </div>
  );
}
