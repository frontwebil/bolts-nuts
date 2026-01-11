import Image from "next/image";
import "../productCard/style.css";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { ProductWithRelations } from "@/types/ProductType";
import Link from "next/link";
import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  openAuthModal,
  setFavoriteProducts,
} from "@/redux/main/slices/uiSlice";
import { RootState } from "@/redux/main/store";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

export function ProductCard({ data }: { data: ProductWithRelations }) {
  const session = useSession();
  const [mainVariant, setMainVariant] = useState(
    data.options.find((el) => el.isMain) || data.options[0]
  );
  const dispatch = useDispatch();
  const [saveLoading, setSaveLoading] = useState(false);
  const { favoriteProducts } = useSelector((store: RootState) => store.uiSlice);

  const hasDiscount = mainVariant.discount && mainVariant.discount > 0;
  const priceWithDiscount = hasDiscount
    ? Math.round(mainVariant.price * (1 - mainVariant.discount! / 100) * 100) /
      100
    : mainVariant.price;

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
    <Link href={`/product/${data.slug}`} className="ProductCard">
      {hasDiscount && (
        <div className="ProductCard-discount">-{mainVariant.discount}%</div>
      )}
      <button
        onClick={(e) => {
          e.preventDefault();
          addToFavorites();
        }}
        className={`ProductCard-save ${
          favoriteProducts.includes(data.id) && "favorites"
        }`}
      >
        {favoriteProducts.includes(data.id) ? (
          <FaBookmark />
        ) : (
          <FaRegBookmark />
        )}
      </button>
      <div className="ProductCard-top">
        <div className={`ProductCard-img ${hasDiscount && "discount"}`}>
          <Image
            src={data.images[0]}
            width={256}
            height={256}
            alt={data.title}
          />
        </div>
        <div className="ProductCard-text">
          <h3>{data.title}</h3>
          <div className="ProductCard-counts">
            {data.options.map((el) => (
              <button
                key={el.id}
                onClick={(e) => {
                  e.preventDefault();
                  setMainVariant(el);
                }}
                className={`count-item ${
                  mainVariant.id === el.id ? "active" : ""
                }`}
              >
                {el.value}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="ProductCard-buttons">
        <div
          className={`ProductCard-button-price ${hasDiscount && "discount"}`}
        >
          {hasDiscount && (
            <p className="ProductCard-button-old-price">${mainVariant.price}</p>
          )}
          <p>
            $
            {hasDiscount
              ? priceWithDiscount.toFixed(2)
              : mainVariant.price.toFixed(2)}
          </p>
        </div>
        <div className="ProductCard-button-order">
          <PiShoppingCartSimpleBold />
          <p>Add</p>
        </div>
      </div>
    </Link>
  );
}
