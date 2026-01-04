import { RootState } from "@/redux/main/store";
import Link from "next/link";
import { useSelector } from "react-redux";

export function ProductVariants() {
  const { productsFromGroups, currentProduct } = useSelector(
    (store: RootState) => store.productSlice
  );

  if (!productsFromGroups || productsFromGroups.length <= 0) return null;

  const productLength = currentProduct?.specs.find((el) => el.key == "Length");

  return (
    <div className="ProductPageWrapper-main-content-variants-options">
      <p className="ProductPageWrapper-main-content-variants-options-title">
        Product Length :{" "}
        <span className="font-bold">{productLength?.value}</span>
      </p>
      <div className="ProductPageWrapper-main-content-variants-options-cards">
        {productsFromGroups.map((el, i) => {
          const productGroupLength = el?.specs.find(
            (el) => el.key == "Length"
          )?.value;
          return (
            <Link
              href={`/product/${el.slug}`}
              className={`ProductPageWrapper-main-content-variants-options-card ${
                el.id == currentProduct?.id && "active"
              }`}
              key={i}
            >
              {productGroupLength}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
