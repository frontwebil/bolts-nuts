"use client";

import { useSelector } from "react-redux";
import { ProductSwitchers } from "../ProductSwitchers/ProductSwitchers";
import { RootState } from "@/redux/admin/store";
import { ProductGeneralInfo } from "../ProductGeneralInfo/ProductGeneralInfo";
import UploadImage from "../UploadImage/UploadImage";

export function AddProductForm() {
  const { category, selectedCategoryId } = useSelector(
    (store: RootState) => store.addProductSlice
  );

  if (!category && !selectedCategoryId) {
    return;
  }

  return (
    <form>
      <ProductSwitchers />
      <ProductGeneralInfo />
      <UploadImage />
    </form>
  );
}
