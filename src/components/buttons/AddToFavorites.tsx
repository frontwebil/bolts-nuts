import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import "./style.css";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  openAuthModal,
  setFavoriteProducts,
} from "@/redux/main/slices/uiSlice";
import axios from "axios";
import { FullScreenLoader } from "../loader/FullScreenLoader";
import { ProductWithRelations } from "@/types/ProductType";

export function AddToFavorites({
  isSaved,
  data,
}: {
  isSaved: boolean;
  data: ProductWithRelations;
}) {

  const session = useSession();
  const dispatch = useDispatch();
  const [saveLoading, setSaveLoading] = useState(false);

  const addToFavorites = async () => {
    if (session.status === "unauthenticated" || session.status === "loading") {
      toast.info("Login to save items");
      dispatch(openAuthModal());
      return;
    }

    if (saveLoading) return;

    try {
      setSaveLoading(true);

      const res = await axios.post("/api/user/favorites/add", {
        productId: data.id,
      });

      const favorites: string[] = res.data.favoriteProducts;
      dispatch(setFavoriteProducts(favorites));

      const isSavedNow = favorites.includes(data.id);

      toast.success(
        isSavedNow ? "Added to favorites" : "Removed from favorites"
      );
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <>
      {saveLoading && <FullScreenLoader />}

      <button
        onClick={(e) => {
          e.preventDefault();
          addToFavorites();
        }}
        className={`ProductCard-save ${isSaved && "favorites"}`}
      >
        {isSaved ? <FaBookmark /> : <FaRegBookmark />}
      </button>
    </>
  );
}
