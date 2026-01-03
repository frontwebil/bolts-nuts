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

export function ProductPageWrapper() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { slug } = useParams();
  const { products, currentProduct } = useSelector(
    (store: RootState) => store.productSlice
  );

  useEffect(() => {
    dispatch(setCurrentProduct(products.find((el) => el.slug == slug)));
  }, [products, dispatch, slug]);

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
          { title: "Home", href: "/" },
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
    </div>
  );
}
