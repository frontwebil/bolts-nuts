import { setMainVariant } from "@/redux/main/slices/productSlice";
import { RootState } from "@/redux/main/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function ProductOptions() {
  const { currentProduct, mainVariant } = useSelector(
    (store: RootState) => store.productSlice,
  );

  const dispatch = useDispatch();

  if (!currentProduct) return;

  const mainOption =
    currentProduct.options.find((el) => el.isMain && el.inStock) ||
    currentProduct.options.find((el) => el.inStock) ||
    currentProduct.options[0];

  const sortedOptions = [...currentProduct.options].sort(
    (a, b) => Number(a.value) - Number(b.value),
  );
  useEffect(() => {
    if (!mainOption) return;
    dispatch(setMainVariant(mainOption));
  }, [dispatch, mainOption]);

  return (
    <div className="ProductPageWrapper-main-content-variants-options">
      <p className="ProductPageWrapper-main-content-variants-options-title">
        {mainVariant?.label} :{" "}
        <span className="font-bold">
          {mainVariant?.value} {mainVariant?.unit}
        </span>
      </p>
      <div className="ProductPageWrapper-main-content-variants-options-cards">
        {sortedOptions.map((el, i) => {
          const isOutOfStock = !el.inStock; // недоступний варіант
          return (
            <div
              key={i}
              onClick={() => {
                if (!isOutOfStock) dispatch(setMainVariant(el)); // клікабельний тільки доступний
              }}
              className={`ProductPageWrapper-main-content-variants-options-card ${
                el.id === mainVariant?.id ? "active" : ""
              } ${isOutOfStock ? "notInStock" : ""}`}
            >
              {el.value}
            </div>
          );
        })}
      </div>
    </div>
  );
}
