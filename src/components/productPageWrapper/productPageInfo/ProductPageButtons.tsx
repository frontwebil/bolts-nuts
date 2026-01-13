"use client";

import { RootState } from "@/redux/main/store";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useWindowWidth } from "@/hooks/useWidth";
import { addToCart } from "@/redux/main/slices/orderCartSlice";
import { toast } from "react-toastify";
import { setIsOpenFirstCartMenu } from "@/redux/main/slices/uiSlice";

export function ProductPageButtons() {
  const { mainVariant, currentProduct } = useSelector(
    (store: RootState) => store.productSlice
  );
  const width = useWindowWidth();
  const [hidden, setHidden] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!width) return;
    if (width > 830) return;
    const anchor = document.getElementById("hide-fixed-buttons-anchor");
    if (!anchor) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHidden(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      }
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, [width]);

  if (!mainVariant) return null;

  const hasDiscount = mainVariant.discount && mainVariant.discount > 0;
  const priceWithDiscount = hasDiscount
    ? Math.round(mainVariant.price * (1 - mainVariant.discount! / 100) * 100) /
      100
    : mainVariant.price;

  const HandleAddToCart = () => {
    if (!currentProduct?.id || !mainVariant?.id) return;

    dispatch(
      addToCart({
        productId: currentProduct.id,
        variantId: mainVariant.id,
      })
    );

    dispatch(setIsOpenFirstCartMenu(true));
  };

  return (
    <div
      className={`ProductPageWrapper-buttons ${hidden ? "buttons-hidden" : ""}`}
    >
      <div
        className={`ProductPageWrapper-buttons-price ${
          hasDiscount && "discount"
        }`}
      >
        <p>
          $
          {hasDiscount
            ? priceWithDiscount.toFixed(2)
            : mainVariant.price.toFixed(2)}
        </p>
        {hasDiscount && (
          <p className="ProductPageWrapper-old-price">${mainVariant.price}</p>
        )}
      </div>

      <div
        className="ProductPageWrapper-buttons-addToCart"
        onClick={() => HandleAddToCart()}
      >
        <PiShoppingCartSimpleBold />
        <p>Add to Cart</p>
      </div>
    </div>
  );
}
