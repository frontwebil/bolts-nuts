import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PiTrash } from "react-icons/pi";
import { toast } from "react-toastify";

export function DeleteAdress({ id }: { id: string }) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDeleteClick = async () => {
    if (isDeleting) return;

    if (!confirmDelete) {
      setConfirmDelete(true);

      // авто-скидання через 4 секунди
      setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }

    try {
      setIsDeleting(true);
      await handleDelete();
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleDelete = async () => {
    await toast.promise(
      axios.delete("/api/user/address/delete", {
        data: { addressId: id },
      }),
      {
        success: "Address deleted",
        error: "Failed to delete address",
      }
    );

    router.refresh();
  };
  return (
    <div
      className={`Account-section-top-delete ${
        confirmDelete ? "confirm" : ""
      } ${isDeleting ? "loading" : ""}`}
      onClick={onDeleteClick}
    >
      <PiTrash />
      <p>
        {isDeleting
          ? "Deleting..."
          : confirmDelete
          ? "Click again to confirm"
          : "Delete"}
      </p>
    </div>
  );
}
