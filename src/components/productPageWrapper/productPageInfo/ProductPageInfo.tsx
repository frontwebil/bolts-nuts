import { useSelector } from "react-redux";
import "../productPageInfo/style.css";
import { RootState } from "@/redux/main/store";
import { ProductOptions } from "./ProductOptions";
import { ProductVariants } from "./ProductVariants";
import { ProductPageButtons } from "./ProductPageButtons";

export function ProductPageInfo() {
  const { currentProduct } = useSelector(
    (store: RootState) => store.productSlice
  );

  if (!currentProduct) return;

  return (
    <div className="ProductPageWrapper-main-content-info">
      <div className="ProductPageWrapper-main-content-info-top">
        <h3>{currentProduct.title}</h3>
        <p>{currentProduct.brandName}</p>
      </div>
      <div className="ProductPageWrapper-option-variants-wrapper">
        <ProductOptions />
        <ProductVariants />
      </div>
      <ProductPageButtons />
    </div>
  );
}
