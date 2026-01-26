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
  console.log(orders);
  return (
    <div className="orders-container">
      {orders.map((order) => {
        const address = order.address as OrderAddress;
        const items = Array.isArray(order.items)
          ? (order.items as OrderItem[])
          : [];
        const statusColors: Record<
          string,
          { bg: string; border: string; text: string }
        > = {
          Accepted: { bg: "#FF5A000D", border: "#FF5A00", text: "#FF5A00" }, // зелений
          Cancelled: { bg: "#fee2e2", border: "#ef4444", text: "#7f1d1d" }, // червоний
          "Order Shipped": {
            bg: "#e0f2fe",
            border: "#3b82f6",
            text: "#1e3a8a",
          }, // синій
          "Refund requested": {
            bg: "#fef9c3",
            border: "#facc15",
            text: "#78350f",
          }, // жовтий
          Refund: { bg: "#f3e8ff", border: "#a78bfa", text: "#5b21b6" }, // фіолетовий
        };

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
            {/* Status row */}
            <div className="order-status-row">
              <div className="order-shipping">
                <strong>Shipping:</strong> {address?.shippingName ?? "-"} ($
                {order.shippingPrice})
              </div>

              <div className="order-total">
                Total: ${order.total.toFixed(2)} <span></span>
              </div>
            </div>

            <div className="order-address">
              <strong>GST/HST:</strong> ${order.taxPrice.toFixed(2)}
            </div>

            {/* Address */}
            <div className="order-address">
              <strong>Address:</strong> {address?.address}, {address?.city},{" "}
              {address?.province}, {address?.postalCode}
            </div>

            <div className="order-navigation">
              <div className="order-navigation-status-wrapper">
                <div
                  className="order-navigation-status"
                  style={{
                    backgroundColor:
                      statusColors[
                        order.orderStatus === "New Order"
                          ? "Accepted"
                          : order.orderStatus
                      ]?.bg,
                    border: `1px solid ${
                      statusColors[
                        order.orderStatus === "New Order"
                          ? "Accepted"
                          : order.orderStatus
                      ]?.border
                    }`,
                    color:
                      statusColors[
                        order.orderStatus === "New Order"
                          ? "Accepted"
                          : order.orderStatus
                      ]?.text,
                  }}
                >
                  {order.orderStatus === "New Order"
                    ? "Accepted"
                    : order.orderStatus}
                </div>
                <div className="order-navigation-func-wrapper">
                  <div className="cancel-order-button">Cancel Order</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
