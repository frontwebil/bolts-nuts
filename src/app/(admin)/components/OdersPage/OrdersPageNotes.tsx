import { Order } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export function OrdersPageNotes({ order }: { order: Order }) {
  const [notes, setNotes] = useState(order.notes ?? "");
  const oldNote = order.notes ?? "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSaveNote = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await axios.patch("/api/admin/saveNote", { id: order.id, notes: notes });

      toast.success("Note saved");
    } catch (err) {
      toast.error("Error saving note");
    } finally {
      router.refresh();
      setLoading(false);
    }
  };

  return (
    <div className="border-t pt-3 space-y-2">
      <h3 className="font-semibold text-sm">Order notes</h3>

      <textarea
        className="w-full border rounded-md p-2 text-sm resize-none"
        rows={3}
        placeholder="Write a note for this order..."
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
        }}
      />
      {oldNote !== notes && (
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSaveNote()}
          className={`px-4 py-1.5 text-sm rounded-md ${loading ? "bg-gray-800" : "bg-black"}  text-white hover:bg-gray-800 transition`}
        >
          {loading ? "Saving..." : "Save note"}
        </button>
      )}
    </div>
  );
}
