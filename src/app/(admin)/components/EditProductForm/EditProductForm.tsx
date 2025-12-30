"use client";

import { hydrateForEdit } from "@/redux/admin/slices/Product";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ProductSwitchers } from "../ProductSwitchers/ProductSwitchers";
import { ProductGeneralInfo } from "../ProductGeneralInfo/ProductGeneralInfo";
import UploadImage from "../UploadImage/UploadImage";
import { ProductOptionsManager } from "../ProductOptionsManager/ProductOptionsManager";
import { ProductSpecsForm } from "../ProductSpecsForm/ProductSpecsForm";

export function EditProductForm() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const getData = async () => {
    const res = await axios.get(`/api/admin/getProduct/${id}`);

    const p = res.data.product;

    dispatch(
      hydrateForEdit({
        productId: p.id,
        categoryId: p.categoryId ?? "",
        category: p.category ?? "",
        title: p.title ?? "",
        description: p.description ?? "",
        anotherInfo: p.anotherInfo ?? "",
        isActive: !!p.isActive,
        isBestSeller: !!p.isBestSeller,
        inStock: !!p.inStock,
        images: Array.isArray(p.images) ? p.images : [],
        options: Array.isArray(p.options) ? p.options : [],
        specs: Array.isArray(p.specs) ? p.specs : [],
      })
    );
  };

  useEffect(() => {
    getData();
  }, [id]);

  return (
    <div>
      <ProductSwitchers />
      <ProductGeneralInfo />
      <UploadImage />
      <ProductOptionsManager />
      <ProductSpecsForm />
    </div>
  );
}
