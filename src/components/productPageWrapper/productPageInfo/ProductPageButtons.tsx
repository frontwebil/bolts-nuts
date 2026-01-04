import { RootState } from "@/redux/main/store";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { useSelector } from "react-redux";

export function ProductPageButtons() {
  const { mainVariant } = useSelector((store: RootState) => store.productSlice);
  return (
    <div className="ProductPageWrapper-buttons">
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
