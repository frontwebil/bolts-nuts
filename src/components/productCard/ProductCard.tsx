import Image from "next/image";
import "../productCard/style.css";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { ProductWithRelations } from "@/types/ProductType";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/redux/main/store";
import { AddToFavorites } from "../buttons/AddToFavorites";
import { addToCart } from "@/redux/main/slices/orderCartSlice";
import { setIsOpenPopUpCart } from "@/redux/main/slices/uiSlice";

export function ProductCard({ data }: { data: ProductWithRelations }) {
  const [mainVariant, setMainVariant] = useState(
    data.options.find((el) => el.isMain) || data.options[0]
  );
  const dispatch = useDispatch();
  const { favoriteProducts } = useSelector((store: RootState) => store.uiSlice);

  const hasDiscount = mainVariant.discount && mainVariant.discount > 0;
  const priceWithDiscount = hasDiscount
    ? Math.round(mainVariant.price * (1 - mainVariant.discount! / 100) * 100) /
      100
    : mainVariant.price;

  const isSaved = favoriteProducts.includes(data.id);

  const HandleAddToCart = () => {
    if (!data?.id || !mainVariant?.id) return;

    dispatch(
      addToCart({
        productId: data.id,
        variantId: mainVariant.id,
      })
    );

    dispatch(setIsOpenPopUpCart(true));
  };

  if (!data) return null;

  const sortedOptions = [...data.options].sort(
    (a, b) => Number(a.value) - Number(b.value)
  );

  return (
    <>
      <Link href={`/product/${data.slug}`} className="ProductCard">
        {hasDiscount && (
          <div className="ProductCard-discount">-{mainVariant.discount}%</div>
        )}
        <AddToFavorites isSaved={isSaved} data={data} />
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
              {sortedOptions.map((el) => (
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
              <p className="ProductCard-button-old-price">
                ${mainVariant.price}
              </p>
            )}
            <p>
              $
              {hasDiscount
                ? priceWithDiscount.toFixed(2)
                : mainVariant.price.toFixed(2)}
            </p>
          </div>
          <div
            className="ProductCard-button-order"
            onClick={(e) => {
              e.preventDefault();
              HandleAddToCart();
            }}
          >
            <PiShoppingCartSimpleBold />
            <p>Add</p>
          </div>
        </div>
      </Link>
    </>
  );
}
