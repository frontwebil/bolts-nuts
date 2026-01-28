/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Order } from "@prisma/client";
import { useState } from "react";

export const ORDER_STATUSES = [
  "Awaiting Payment",
  "New Order",
  "Not Completed",
  "Cancelled",
  "Order Shipped",
  "Refund requested",
  "Refund",
] as const;

export const PAYMENT_STATUSES = [
  "failed",
  "expired",
  "paid",
  "pending",
] as const;

type Props = {
  order: Order;
  onClose?: () => void;
  onSaved?: () => void;
};

export function OrderEditModal({ order, onClose, onSaved }: Props) {
  const address = order.address as any;

  const [form, setForm] = useState({
    name: order.name,
    surname: order.surname,
    email: order.email,
    phoneNumber: order.phoneNumber,

    status: order.status,
    orderStatus: order.orderStatus,

    shippingPrice: order.shippingPrice,
    shippingName: address?.shippingName || "",

    city: address?.city || "",
    address: address?.address || "",
    postalCode: address?.postalCode || "",
    province: address?.province || "",
    company: address?.company || "",

    notes: order.notes || "",
  });

  function update(key: string, value: any) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function handleSave() {
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-[760px] max-h-[90vh] overflow-y-auto rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold">Edit order #{order.id}</h2>

        {/* STATUSES */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Payment status</label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Order status</label>
            <select
              value={form.orderStatus}
              onChange={(e) => update("orderStatus", e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CUSTOMER */}
        <div className="grid grid-cols-2 gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Surname"
            value={form.surname}
            onChange={(e) => update("surname", e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Phone"
            value={form.phoneNumber}
            onChange={(e) => update("phoneNumber", e.target.value)}
          />
        </div>

        {/* ADDRESS */}
        <div className="grid grid-cols-2 gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="City"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 col-span-2"
            placeholder="Address"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Postal code"
            value={form.postalCode}
            onChange={(e) => update("postalCode", e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Province"
            value={form.province}
            onChange={(e) => update("province", e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 col-span-2"
            placeholder="Company"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </div>

        {/* SHIPPING */}
        <div className="grid grid-cols-2 gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Shipping service"
            value={form.shippingName}
            onChange={(e) => update("shippingName", e.target.value)}
          />
          <input
            type="number"
            className="border rounded px-3 py-2"
            placeholder="Shipping price"
            value={form.shippingPrice}
            onChange={(e) => update("shippingPrice", Number(e.target.value))}
          />
        </div>

        {/* NOTES */}
        <div>
          <label className="text-sm font-medium">Admin notes</label>
          <textarea
            rows={4}
            className="w-full border rounded px-3 py-2"
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2 bg-black text-white rounded"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
