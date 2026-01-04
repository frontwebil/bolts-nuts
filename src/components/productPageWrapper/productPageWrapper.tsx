"use client";

import { useDispatch, useSelector } from "react-redux";
import { ProductBreadcrums } from "../breadcrums/ProductBreadcrums";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "@/redux/main/store";
import { useEffect } from "react";
import {
  setCurrentProduct,
  setSelectedCategory,
} from "@/redux/main/slices/productSlice";
import Loader from "../loader/Loader";
import { ProductPageInfo } from "./productPageInfo/ProductPageInfo";
import { ProductPageImages } from "./productPageImages/ProductPageImages";
import "./style.css";

export function ProductPageWrapper() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { slug } = useParams();
  const { products, currentProduct, productsLoaded } = useSelector(
    (store: RootState) => store.productSlice
  );

  useEffect(() => {
    if (!productsLoaded) return;

    const product = products.find((el) => el.slug === slug);

    if (!product) {
      router.replace("/catalog");
      return;
    }

    dispatch(setCurrentProduct(product));
  }, [productsLoaded, products, slug, dispatch, router]);

  if (!currentProduct || !products) {
    return (
      <div className="h-[80vh] flex justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <ProductBreadcrums
        links={[
          { title: "Catalog", href: "/catalog" },
          {
            title: currentProduct?.category,
            onClick: () => {
              router.replace("/catalog");
              dispatch(setSelectedCategory(currentProduct.category));
            },
          },
          { title: currentProduct.title },
        ]}
      />
      <div className="ProductPageWrapper-container">
        <div className="ProductPageWrapper-main-content">
          <ProductPageImages />
          <ProductPageInfo />
        </div>
      </div>
    </div>
  );
}
