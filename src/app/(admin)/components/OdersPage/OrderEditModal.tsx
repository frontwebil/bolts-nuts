/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Order } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

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
  onClose: () => void;
};

export function OrderEditModal({ order, onClose }: Props) {
  const address = order.address as any;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({
    name: order.name,
    surname: order.surname,
    email: order.email,
    phoneNumber: order.phoneNumber,

    deliveryLink: order.deliveryLink || "",
    deliveryTrackNumber: order.deliveryTrackNumber || "",

    status: order.status,
    orderStatus: order.orderStatus,

    shippingPrice: order.shippingPrice,
    shippingName: address?.shippingName || "",

    address: address?.address || "",
    company: address?.company || "",
    city: address.city,
    postalCode: address.postalCode,
    province: address.province,
    
    notes: order.notes || "",
  });

  function update(key: string, value: any) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function handleSave() {
    if (loading) return;

    if (form.orderStatus === "Order Shipped") {
      if (!form.deliveryTrackNumber.trim()) {
        toast("Tracking number is required");
        return;
      }

      if (!form.deliveryLink.trim()) {
        toast("Delivery link is required");
        return;
      }
    }

    setLoading(true);

    try {
      await axios.patch("/api/admin/updateOrder", { ...form, id: order.id });

      toast.success("Order Updated");
    } catch (err) {
      toast.error("Error saving note");
    } finally {
      router.refresh();
      setLoading(false);
      onClose();
    }
  }

  const field = "flex flex-col gap-1";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-[760px] max-h-[90vh] overflow-y-auto rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold">Edit order #{order.id}</h2>

        {/* STATUSES */}
        <div className="grid grid-cols-2 gap-4">
          <div className={field}>
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

          <div className={field}>
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

        {/* DELIVERY */}
        {form.orderStatus === "Order Shipped" && (
          <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
            <h3 className="font-semibold text-sm">Delivery information</h3>

            <div className={field}>
              <label className="text-sm font-medium">Tracking number</label>
              <input
                className="border rounded px-3 py-2 w-full"
                value={form.deliveryTrackNumber}
                onChange={(e) => update("deliveryTrackNumber", e.target.value)}
              />
            </div>

            <div className={field}>
              <label className="text-sm font-medium">Tracking link</label>
              <input
                className="border rounded px-3 py-2 w-full"
                value={form.deliveryLink}
                onChange={(e) => update("deliveryLink", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* CUSTOMER */}
        <div className="grid grid-cols-2 gap-4">
          <div className={field}>
            <label>Name</label>
            <input
              className="border rounded px-3 py-2"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div className={field}>
            <label>Surname</label>
            <input
              className="border rounded px-3 py-2"
              value={form.surname}
              onChange={(e) => update("surname", e.target.value)}
            />
          </div>

          <div className={field}>
            <label>Email</label>
            <input
              className="border rounded px-3 py-2"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          <div className={field}>
            <label>Phone</label>
            <input
              className="border rounded px-3 py-2"
              value={form.phoneNumber}
              onChange={(e) => update("phoneNumber", e.target.value)}
            />
          </div>
        </div>

        {/* ADDRESS */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`${field} col-span-2`}>
            <label>Address</label>
            <input
              className="border rounded px-3 py-2"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </div>

          <div className={`${field} col-span-2`}>
            <label>Company</label>
            <input
              className="border rounded px-3 py-2"
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
            />
          </div>
        </div>

        {/* SHIPPING */}
        <div className="grid grid-cols-2 gap-4">
          <div className={field}>
            <label>Shipping service</label>
            <input
              className="border rounded px-3 py-2"
              value={form.shippingName}
              onChange={(e) => update("shippingName", e.target.value)}
            />
          </div>

          <div className={field}>
            <label>Shipping price</label>
            <input
              type="number"
              className="border rounded px-3 py-2"
              value={form.shippingPrice}
              onChange={(e) => update("shippingPrice", Number(e.target.value))}
            />
          </div>
        </div>

        {/* NOTES */}
        <div className={field}>
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
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded cursor-pointer"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSave}
            className="px-6 py-2 bg-black text-white rounded cursor-pointer"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
