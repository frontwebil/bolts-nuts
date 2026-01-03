import { RootState } from "@/redux/main/store";
import { useSelector } from "react-redux";

export function ProductOptions() {
  const { currentProduct } = useSelector(
    (store: RootState) => store.productSlice
  );

  if (!currentProduct) return;

  const options = currentProduct.options;
  const mainOption = currentProduct.options.find((el) => el.isMain);

  console.log(mainOption);

  return (
    <div className="ProductPageWrapper-main-content-options">
      <p className="ProductPageWrapper-main-content-options-title">
        {mainOption?.label} :{" "}
        <span className="font-bold">{mainOption?.value}</span>
      </p>
      <div className="ProductPageWrapper-main-content-options-cards">
        {options.map((el, i) => (
          <div className="ProductPageWrapper-main-content-options-card" key={i}>
            {el.value} {el.unit}
          </div>
        ))}
      </div>
    </div>
  );
}
