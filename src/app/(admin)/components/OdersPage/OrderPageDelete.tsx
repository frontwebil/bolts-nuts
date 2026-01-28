"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function DeleteOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this order?",
    );

    if (!confirmDelete) return;

    const res = await fetch(`/api/admin/deleteOrder/${orderId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Order deleted");
      router.refresh(); // оновлює список
    } else {
      toast.error("Failed to delete order");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-2 py-1 border rounded flex w-max bg-red-500 text-white hover:bg-red-600 transition"
    >
      Delete
    </button>
  );
}
