/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/admin/store";

import { ProductSwitchers } from "../ProductSwitchers/ProductSwitchers";
import { ProductGeneralInfo } from "../ProductGeneralInfo/ProductGeneralInfo";
import UploadImage from "../UploadImage/UploadImage";
import { ProductOptionsManager } from "../ProductOptionsManager/ProductOptionsManager";
import { ProductSpecsForm } from "../ProductSpecsForm/ProductSpecsForm";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
import { resetAddProduct } from "@/redux/admin/slices/Product";
import { UploadTechImg } from "../UploadTechImg/UploadTechImg";

type FormErrors = {
  title?: string;
  description?: string;
  images?: string;
  options?: string;
  specs?: string;
};

export function AddProductForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();
  const dispatch = useDispatch();
  const addProduct = useSelector((store: RootState) => store.ProductSlice);

  const canSubmit = useMemo(() => !loading, [loading]);

  useEffect(() => {
    dispatch(resetAddProduct());
  }, []);

  const validate = (): FormErrors => {
    const e: FormErrors = {};

    // title
    if (!addProduct.title.trim()) e.title = "Title is required";

    // description
    if (!addProduct.description.trim())
      e.description = "Description is required";

    // images
    if (!addProduct.images?.length) e.images = "Add at least 1 image";

    // options
    if (!addProduct.options?.length) {
      e.options = "Add at least 1 option";
    } else {
      const badPrice = addProduct.options.some(
        (o) => Number(o.price) <= 0 || Number.isNaN(Number(o.price))
      );

      const badValue = addProduct.options.some(
        (o) => !o.value || !o.value.trim()
      );

      const mainCount = addProduct.options.filter((o) => o.isMain).length;

      if (badPrice) {
        e.options = "Each option must have price greater than 0";
      } else if (badValue) {
        e.options = "Each option must have value";
      } else if (mainCount !== 1) {
        e.options = "Set exactly one main option";
      }
    }

    // specs required
    const requiredSpecs = addProduct.specs?.filter((s) => s.required) ?? [];
    const missingRequired = requiredSpecs.some((s) => !s.value?.trim());
    if (missingRequired) e.specs = "Fill all required specifications";

    return e;
  };

  const AddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    const eMap = validate();
    setErrors(eMap);

    if (Object.keys(eMap).length) {
      toast.warn("Check all field errors");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        categoryId: addProduct.selectedCategoryId,
        category: addProduct.category,
        productGroup: addProduct.productGroup.trim(),
        title: addProduct.title.trim(),
        description: addProduct.description.trim(),
        anotherInfo: (addProduct.anotherInfo ?? "").trim(),
        brandName: (addProduct.brandName ?? "").trim(),
        technicalImg: (addProduct.technicalImg ?? "").trim(),
        isActive: addProduct.isActive,
        isBestSeller: addProduct.isBestSeller,
        inStock: addProduct.inStock,
        images: addProduct.images,
        options: addProduct.options.map((o) => ({
          label: o.label,
          value: o.value?.trim() || null,
          price: Number(o.price),
          discount: o.discount ? Number(o.discount) : null,
          unit: o.unit?.trim() || null,
          isMain: o.isMain,
          inStock: o.inStock,
        })),
        specs: (addProduct.specs ?? [])
          .filter((s) => s.value?.trim())
          .map((s) => ({
            group: s.group,
            key: s.key,
            value: s.value.trim(),
          })),
      };

      await axios.post("/api/admin/addProduct", payload);

      dispatch(resetAddProduct());
      toast.success("Product added");
      router.replace("/admin-page-21sQsafaboltsnuts");
    } finally {
      setLoading(false);
    }
  };

  if (!addProduct.category && !addProduct.selectedCategoryId) return null;

  return (
    <form onSubmit={AddProduct} className="space-y-6">
      <ProductSwitchers />

      <ProductGeneralInfo />
      {errors.title || errors.description ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-700">
          {errors.title ? <div>• {errors.title}</div> : null}
          {errors.description ? <div>• {errors.description}</div> : null}
        </div>
      ) : null}

      <UploadImage />
      {errors.images ? (
        <div className="text-sm text-red-700">{errors.images}</div>
      ) : null}

      <ProductOptionsManager />
      {errors.options ? (
        <div className="text-sm text-red-700">{errors.options}</div>
      ) : null}

      <UploadTechImg />

      <ProductSpecsForm />
      {errors.specs ? (
        <div className="text-sm text-red-700">{errors.specs}</div>
      ) : null}

      <div className="mt-8 flex gap-3 max-sm:flex-col-reverse">
        <button
          type="submit"
          disabled={loading}
          className="
            inline-flex items-center justify-center
            rounded-xl px-6 py-3 text-sm font-semibold text-white
            bg-linear-to-r from-neutral-900 to-neutral-800
            shadow-lg shadow-black/20
            transition-all duration-200
            hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30
            active:translate-y-0 active:shadow-none
            focus:outline-none focus:ring-2 focus:ring-neutral-900/30
            disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
          "
        >
          {loading ? "Saving..." : "Add Product"}
        </button>

        <Link
          href={"/admin-page-21sQsafaboltsnuts"}
          className="
            inline-flex items-center justify-center
            rounded-xl px-6 py-3 text-sm font-semibold
            border border-black/15 text-neutral-900 bg-transparent
            transition-all duration-200
            hover:bg-black/5 active:bg-black/10
            focus:outline-none focus:ring-2 focus:ring-neutral-900/20
          "
          onClick={() => dispatch(resetAddProduct())}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
