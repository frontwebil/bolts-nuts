import { RootState } from "@/redux/main/store";
import "../productPageImages/style.css";

import Image from "next/image";
import { useSelector } from "react-redux";
import { useState } from "react";

export function ProductPageImages() {
  const { currentProduct } = useSelector(
    (store: RootState) => store.productSlice
  );

  const [currentImgId, setCurrentImgId] = useState(0);

  if (!currentProduct) return;

  return (
    <div className="ProductPageWrapper-main-content-images">
      <div className="ProductPageWrapper-main-content-images-sidebar">
        {currentProduct.images.map((el, i) => (
          <Image
            src={el}
            alt={`${currentProduct.category} ${i}`}
            key={i}
            className={`ProductPageWrapper-main-content-images-sidebar-img ${
              currentImgId == i ? "active" : ""
            }`}
            width={100}
            height={100}
            onClick={() => setCurrentImgId(i)}
          />
        ))}
      </div>
      <div className="ProductPageWrapper-main-content-images-main-image">
        <Image
          src={currentProduct?.images[currentImgId]}
          width={1000}
          height={1000}
          alt={currentProduct?.category}
        />
      </div>
    </div>
  );
}
