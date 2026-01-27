"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from "@prisma/client";
import { useMemo, useState } from "react";

type OrderAddress = {
  city: string;
  address: string;
  postalCode: string;
  province?: string;
  company?: string;
  shippingName?: string;
};

export function OdersPage({ orders }: { orders: Order[] }) {
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderTime = new Date(order.createdAt).getTime();
      const fromTime = dateFrom ? new Date(dateFrom).getTime() : null;
      const toTime = dateTo
        ? new Date(dateTo + "T23:59:59.999").getTime()
        : null;

      if (fromTime && orderTime < fromTime) return false;
      if (toTime && orderTime > toTime) return false;

      if (
        paymentStatusFilter.length > 0 &&
        !paymentStatusFilter.includes(order.status)
      ) {
        return false;
      }

      if (
        orderStatusFilter.length > 0 &&
        !orderStatusFilter.includes(order.orderStatus)
      ) {
        return false;
      }

      return true;
    });
  }, [orders, dateFrom, dateTo, paymentStatusFilter, orderStatusFilter]);

  const grouped = useMemo(() => {
    const map: Record<string, Order[]> = {};

    filteredOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      const key = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!map[key]) map[key] = [];
      map[key].push(order);
    });

    return (Object.entries(map) as [string, Order[]][]).sort((a, b) => {
      return (
        new Date(b[1][0].createdAt).getTime() -
        new Date(a[1][0].createdAt).getTime()
      );
    });
  }, [filteredOrders]);

  const statusColors: Record<
    string,
    { bg: string; border: string; text: string }
  > = {
    "Awaiting Payment": { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" },
    "New Order": { bg: "#e0f2fe", border: "#3b82f6", text: "#1e3a8a" },
    "Not Completed": { bg: "#fee2e2", border: "#ef4444", text: "#7f1d1d" },
    Cancelled: { bg: "#fee2e2", border: "#ef4444", text: "#7f1d1d" },
    "Order Shipped": { bg: "#e0f2fe", border: "#3b82f6", text: "#1e3a8a" },
    "Refund requested": { bg: "#fef9c3", border: "#facc15", text: "#78350f" },
    Refund: { bg: "#f3e8ff", border: "#a78bfa", text: "#5b21b6" },
  };

  return (
    <div className="p-6 mx-auto space-y-8">
      {/* Filters */}
      <div className="flex gap-6 items-end flex-wrap">
        <div>
          <label className="block text-sm font-semibold">From:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">To:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>

        {/* Payment status filter */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold">Payment status:</label>
          <div className="flex gap-2 flex-wrap items-center">
            {["paid", "pending", "failed", "expired"].map((status) => {
              const isActive = paymentStatusFilter.includes(status);

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    setPaymentStatusFilter((prev) =>
                      prev.includes(status)
                        ? prev.filter((s) => s !== status)
                        : [...prev, status],
                    );
                  }}
                  className={`px-3 py-1 rounded text-sm border transition ${
                    isActive
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {status}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setPaymentStatusFilter([])}
              className="px-3 py-1 rounded text-sm border bg-gray-100 hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Order status filter */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold">Order status:</label>
          <div className="flex gap-2 flex-wrap items-center">
            {[
              "Awaiting Payment",
              "New Order",
              "Not Completed",
              "Cancelled",
              "Order Shipped",
              "Refund requested",
              "Refund",
            ].map((status) => {
              const isActive = orderStatusFilter.includes(status);

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    setOrderStatusFilter((prev) =>
                      prev.includes(status)
                        ? prev.filter((s) => s !== status)
                        : [...prev, status],
                    );
                  }}
                  className={`px-3 py-1 rounded text-sm border transition ${
                    isActive
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {status}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setOrderStatusFilter([])}
              className="px-3 py-1 rounded text-sm border bg-gray-100 hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Orders grouped by date */}
      {grouped.map(([date, dayOrders]) => (
        <div key={date} className="space-y-4">
          <div className="py-2">
            <h2 className="text-lg font-semibold border-b pb-1">{date}</h2>
          </div>

          {dayOrders.map((order) => {
            const isOpen = openOrderId === order.id;

            return (
              <div
                key={order.id}
                className="border rounded-xl shadow-sm overflow-hidden"
              >
                {/* HEADER */}
                <button
                  type="button"
                  onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                  className="w-full flex justify-between items-center text-sm text-gray-600 p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex gap-4 items-center">
                    <span className="font-medium">OrderId: #{order.id}</span>

                    {order.paymentIntentId && (
                      <span className="font-medium">
                        Stripe: {order.paymentIntentId}
                      </span>
                    )}

                    <span className="font-bold">
                      Total: ${order.total.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Payment status */}
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        order.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>

                    {/* Order status */}
                    {(() => {
                      const style = statusColors[order.orderStatus] ?? {
                        bg: "#f3f4f6",
                        border: "#d1d5db",
                        text: "#374151",
                      };

                      return (
                        <span
                          className="px-2 py-1 rounded text-xs border"
                          style={{
                            backgroundColor: style.bg,
                            borderColor: style.border,
                            color: style.text,
                          }}
                        >
                          {order.orderStatus}
                        </span>
                      );
                    })()}

                    <span className="text-xs">
                      {new Date(order.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </span>

                    <span
                      className={`transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                </button>

                {/* BODY */}
                {isOpen && (
                  <div className="p-4 grid gap-4 border-t">
                    {/* Client info */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="space-y-1">
                        <div>
                          <span className="font-semibold">Name:</span>{" "}
                          {order.name}
                        </div>
                        <div>
                          <span className="font-semibold">Surname:</span>{" "}
                          {order.surname}
                        </div>
                        <div>
                          <span className="font-semibold">Email:</span>{" "}
                          {order.email}
                        </div>
                        <div>
                          <span className="font-semibold">Phone:</span>{" "}
                          {order.phoneNumber}
                        </div>
                        <span className="font-medium">
                          Stripe: {order.paymentIntentId}
                        </span>
                      </div>
                      {/* Address */}
                      <div className="space-y-1">
                        <div>
                          <span className="font-semibold">City:</span>{" "}
                          {(order.address as OrderAddress)?.city ?? ""}
                        </div>
                        <div>
                          <span className="font-semibold">Address:</span>{" "}
                          {(order.address as OrderAddress)?.address ?? ""}
                        </div>
                        <div>
                          <span className="font-semibold">Postal Code:</span>{" "}
                          {(order.address as OrderAddress)?.postalCode ?? ""}
                        </div>
                        <div>
                          <span className="font-semibold">Province:</span>{" "}
                          {(order.address as OrderAddress)?.province ?? ""}
                        </div>
                        <div>
                          <span className="font-semibold">Company:</span>{" "}
                          {(order.address as OrderAddress)?.company ?? ""}
                        </div>
                        <div>
                          <span className="font-semibold">
                            Shipping Service:
                          </span>{" "}
                          {(order.address as OrderAddress)?.shippingName ?? ""}
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="border-t pt-3 space-y-2">
                      <h2 className="text-l font-semibold pb-1">
                        Order Items:
                      </h2>

                      {Array.isArray(order.items) &&
                        order.items.map((item: any, idx: any) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <div className="text-gray-500">
                                {item.variant.label}: {item.variant.value}{" "}
                                {item.variant.unit}
                              </div>
                            </div>
                            <div>
                              {item.quantity} × ${item.price.toFixed(2)}
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t pt-3 flex justify-between text-sm">
                      <div className="space-y-1">
                        <div>Subtotal: ${order.subtotal.toFixed(2)}</div>
                        <div>Tax: ${order.taxPrice.toFixed(2)}</div>
                        <div>Shipping: ${order.shippingPrice.toFixed(2)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          Total: ${order.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
