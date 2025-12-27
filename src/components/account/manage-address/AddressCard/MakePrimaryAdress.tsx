import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PiStar, PiStarFill } from "react-icons/pi";
import { toast } from "react-toastify";

export function MakePrimaryAdress({
  id,
  isMain,
}: {
  id: string;
  isMain?: boolean;
}) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const doMakePrimary = async () => {
    await toast.promise(
      axios.patch("/api/user/address/make-primary", {
        addressId: id,
      }),
      {
        success: "Primary address updated",
        error: "Failed to set primary address",
      }
    );

    router.refresh();
  };

  const onClick = async () => {
    if (isMain) return; // вже головний — нічого не робимо
    if (isLoading) return;

    // (опційно) підтвердження 2 кліком
    if (!confirm) {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 3500);
      return;
    }

    try {
      setIsLoading(true);
      await doMakePrimary();
    } finally {
      setIsLoading(false);
      setConfirm(false);
    }
  };

  return (
    <div
      className={`Account-section-top-make-primary ${
        confirm ? "confirm" : ""
      } ${isLoading ? "loading" : ""} ${isMain ? "active" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {isMain ? <PiStarFill /> : <PiStar />}
      <p>
        {isMain
          ? "Primary address"
          : isLoading
          ? "Saving..."
          : confirm
          ? "Click again to confirm"
          : "Make primary"}
      </p>
    </div>
  );
}
