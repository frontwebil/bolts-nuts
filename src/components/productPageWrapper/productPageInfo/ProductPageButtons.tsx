"use client";

import { RootState } from "@/redux/main/store";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export function ProductPageButtons() {
  const { mainVariant } = useSelector((store: RootState) => store.productSlice);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
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
  }, []);

  return (
    <div
      className={`ProductPageWrapper-buttons ${hidden ? "buttons-hidden" : ""}`}
    >
      <div className="ProductPageWrapper-buttons-price">
        ${mainVariant?.price}
      </div>

      <div className="ProductPageWrapper-buttons-addToCart">
        <PiShoppingCartSimpleBold />
        <p>Add to Cart</p>
      </div>
    </div>
  );
}
