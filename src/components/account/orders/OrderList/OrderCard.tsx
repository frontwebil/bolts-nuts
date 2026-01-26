"use client";

import { Order } from "@prisma/client";

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

type OrderCardProps = {
  order: Order;
};

const statusColors: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  Accepted: { bg: "#FF5A000D", border: "#FF5A00", text: "#FF5A00" },
  Cancelled: { bg: "#fee2e2", border: "#ef4444", text: "#7f1d1d" },
  "Order Shipped": { bg: "#e0f2fe", border: "#3b82f6", text: "#1e3a8a" },
  "Refund requested": { bg: "#fef9c3", border: "#facc15", text: "#78350f" },
  Refund: { bg: "#f3e8ff", border: "#a78bfa", text: "#5b21b6" },
};

export function OrderCard({ order }: OrderCardProps) {
  const address = order.address as OrderAddress;
  const items = Array.isArray(order.items) ? (order.items as OrderItem[]) : [];
  const displayStatus =
    order.orderStatus === "New Order" ? "Accepted" : order.orderStatus;
  const colors = statusColors[displayStatus];

  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-name">{order.name} {order.surname}</div>
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
                {item.variant.label}: {item.variant.value} {item.variant.unit}
              </div>
            </div>
            <div className="order-item-price">
              {item.quantity} × ${item.price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="order-status-row">
        <div className="order-shipping">
          <strong>Shipping:</strong> {address?.shippingName ?? "-"} ($
          {order.shippingPrice})
        </div>
        <div className="order-total">
          Total: ${order.total.toFixed(2)}
        </div>
      </div>

      <div className="order-summary">
        <div>
          <strong>GST/HST:</strong> ${order.taxPrice.toFixed(2)}
        </div>
        <div>
          <strong>Address:</strong> {address?.address}, {address?.city},{" "}
          {address?.province}, {address?.postalCode}
        </div>
        <div>
          <strong>Order Id:</strong> {order.id}
        </div>
      </div>

      <div className="order-navigation">
        <div className="order-navigation-status-wrapper">
          <div
            className="order-navigation-status"
            style={{
              backgroundColor: colors?.bg,
              border: `1px solid ${colors?.border}`,
              color: colors?.text,
            }}
          >
            {displayStatus}
          </div>
        </div>
        <div className="order-navigation-func-wrapper">
          <div className="cancel-order-button">Cancel Order</div>
        </div>
      </div>
    </div>
  );
}