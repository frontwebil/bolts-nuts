import { setMainVariant } from "@/redux/main/slices/productSlice";
import { RootState } from "@/redux/main/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function ProductOptions() {
  const { currentProduct, mainVariant } = useSelector(
    (store: RootState) => store.productSlice
  );

  const dispatch = useDispatch();

  if (!currentProduct) return;

  const options = currentProduct.options;

  const mainOption = currentProduct.options.find((el) => el.isMain) || null;

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
        {options.map((el, i) => {
          return (
            <div
              className={`ProductPageWrapper-main-content-variants-options-card ${
                el.id == mainVariant?.id && "active"
              }`}
              key={i}
              onClick={() => dispatch(setMainVariant(el))}
            >
              {el.value}
            </div>
          );
        })}
      </div>
    </div>
  );
}
