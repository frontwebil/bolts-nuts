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
  const [dateFrom, setDateFrom] = useState<string>(""); // начало диапазона
  const [dateTo, setDateTo] = useState<string>(""); // конец диапазона
  const [statusFilter, setStatusFilter] = useState<string>(""); // фильтр по типу

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderTime = new Date(order.createdAt).getTime();
      const fromTime = dateFrom ? new Date(dateFrom).getTime() : null;
      // додаємо 23:59:59.999 до кінця дня
      const toTime = dateTo
        ? new Date(dateTo + "T23:59:59.999").getTime()
        : null;

      if (fromTime && orderTime < fromTime) return false;
      if (toTime && orderTime > toTime) return false;

      if (statusFilter && order.status !== statusFilter) return false;

      return true;
    });
  }, [orders, dateFrom, dateTo, statusFilter]);

  const grouped = useMemo(() => {
    const map: Record<string, Order[]> = {};

    filteredOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      const key = date.toLocaleDateString("uk-UA", {
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

  return (
    <div className="p-6 mx-auto space-y-8">
      <div className="flex gap-4 items-center">
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

        <div>
          <label className="block text-sm font-semibold">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Expired</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
      {grouped.map(([date, dayOrders]) => (
        <div key={date} className="space-y-4">
          <div className="py-2">
            <h2 className="text-lg font-semibold border-b pb-1">{date}</h2>
          </div>

          {dayOrders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-4 shadow-sm grid gap-3"
            >
              <div className="flex justify-between text-sm text-gray-600">
                <div className="flex gap-5 items-center">
                  <span>OrderId : #{order.id}</span>
                  {order.paymentIntentId && (
                    <span>Stripe Payment Id : {order.paymentIntentId}</span>
                  )}
                </div>
                <span>
                  {new Date(order.createdAt).toLocaleTimeString("uk-UA")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                {/* Дані клієнта */}
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold">Name:</span> {order.name}
                  </div>
                  <div>
                    <span className="font-semibold">Surname:</span>{" "}
                    {order.surname}
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span> {order.email}
                  </div>
                  <div>
                    <span className="font-semibold">Phone:</span>{" "}
                    {order.phoneNumber}
                  </div>
                </div>

                {/* Адреса доставки */}
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
                    <div>
                      <span className="font-semibold">Province:</span>{" "}
                      {(order.address as OrderAddress)?.province ?? ""}
                    </div>
                    <span className="font-semibold">Company:</span>{" "}
                    {(order.address as OrderAddress)?.company ?? ""}
                  </div>
                  <div>
                    <span className="font-semibold">Shipping Service:</span>{" "}
                    {(order.address as OrderAddress)?.shippingName ?? ""}
                  </div>
                </div>
              </div>

              <div className="border-t pt-3 space-y-2">
                <h2 className="text-l font-semibold pb-1">Order Items:</h2>

                {Array.isArray(order.items) &&
                  order.items.map((item: any, idx: any) => (
                    <div key={idx} className="flex justify-between text-sm">
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
                  <div
                    className={`inline-block mt-1 px-2 py-1 rounded text-xs ${
                      order.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
