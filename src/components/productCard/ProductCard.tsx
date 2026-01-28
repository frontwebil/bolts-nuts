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
import { LuPackageX } from "react-icons/lu";

export function ProductCard({ data }: { data: ProductWithRelations }) {
  const [mainVariant, setMainVariant] = useState(
    data.options.find((el) => el.isMain && el.inStock) ||
      data.options.find((el) => el.inStock) ||
      data.options[0],
  );
  const dispatch = useDispatch();
  const { favoriteProducts } = useSelector((store: RootState) => store.uiSlice);
  const inStock = data.inStock && mainVariant.inStock;
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
      }),
    );

    dispatch(setIsOpenPopUpCart(true));
  };

  if (!data) return null;

  const sortedOptions = [...data.options].sort(
    (a, b) => Number(a.value) - Number(b.value),
  );

  return (
    <>
      <Link href={`/product/${data.slug}`} className={`ProductCard ${!inStock && "out-of-stock"}`}>
        {inStock && hasDiscount && (
          <div className="ProductCard-discount">-{mainVariant.discount}%</div>
        )}
        {!inStock && (
          <div className="ProductCard-discount notInStock">
            <LuPackageX />
          </div>
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
              {sortedOptions.map((el) => {
                // визначаємо, чи продукт повністю недоступний
                const isProductOutOfStock =
                  !data.inStock || !data.options.some((opt) => opt.inStock);
                // варіант недоступний сам по собі
                const isOutOfStock = !el.inStock || isProductOutOfStock;

                return (
                  <button
                    key={el.id}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isOutOfStock) setMainVariant(el); // клікабельний тільки якщо доступний
                    }}
                    className={`count-item ${mainVariant.id === el.id ? "active" : ""} ${isOutOfStock ? "notInStock" : ""}`}
                    disabled={isOutOfStock}
                  >
                    {el.value}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="ProductCard-buttons">
          {inStock ? (
            <>
              <div
                className={`ProductCard-button-price ${hasDiscount ? "discount" : ""}`}
              >
                {hasDiscount && (
                  <p className="ProductCard-button-old-price">
                    ${mainVariant.price.toFixed(2)}
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
            </>
          ) : (
            <div className="ProductCard-outOfStock">Out of Stock</div>
          )}
        </div>
      </Link>
    </>
  );
}
