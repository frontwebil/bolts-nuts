import { useSelector } from "react-redux";
import "../productPageInfo/style.css";
import { RootState } from "@/redux/main/store";
import { ProductOptions } from "./ProductOptions";

export function ProductPageInfo() {
  const { currentProduct } = useSelector(
    (store: RootState) => store.productSlice
  );

  if (!currentProduct) return;

  return (
    <div className="ProductPageWrapper-main-content-info">
      <div className="ProductPageWrapper-main-content-info-top">
        <h3>{currentProduct.title}</h3>
        <p>{currentProduct.anotherInfo}</p>
      </div>
      <ProductOptions />
    </div>
  );
}
