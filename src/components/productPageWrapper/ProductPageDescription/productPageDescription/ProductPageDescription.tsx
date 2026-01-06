import { useSelector } from "react-redux";
import { DeliveryAccordeon } from "./DeliveryAccordeon";
import "./style.css";
import { TextAccordeon } from "./TextAccordeon";
import { RootState } from "@/redux/main/store";

export function ProductPageDescription() {
  const { currentProduct } = useSelector(
    (store: RootState) => store.productSlice
  );
  return (
    <div className="ProductPageDescription-container">
      {/* <DeliveryAccordeon /> */}
      <TextAccordeon
        title={"Description"}
        text={currentProduct?.description || ""}
        isOpenByDefault={true}
      />
      <TextAccordeon
        title={"Another Info"}
        text={currentProduct?.anotherInfo || ""}
        isOpenByDefault={false}
      />
    </div>
  );
}
