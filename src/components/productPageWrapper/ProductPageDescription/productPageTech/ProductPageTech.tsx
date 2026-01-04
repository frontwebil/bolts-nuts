import { useSelector } from "react-redux";
import "./style.css";
import { RootState } from "@/redux/main/store";

export function ProductPageTech() {
  const { currentProduct } = useSelector(
    (store: RootState) => store.productSlice
  );
  return (
    <div className="ProductPageTech-wrapper">
      <div className="ProductPageTech-container">
        <div className="ProductPageTech-top">
          <h2>Technical Specs</h2>
        </div>
        <div className="ProductPageTech-container-grid">
          {currentProduct?.specs.map((el, i) => (
            <div className="ProductPageTech-container-grid-specs" key={i}>
              <h3>{el.key}</h3>
              <p>{el.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
