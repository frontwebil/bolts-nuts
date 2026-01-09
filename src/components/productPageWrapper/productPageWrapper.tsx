"use client";

import Cookies from "js-cookie";
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
import { ProductPageTech } from "./ProductPageDescription/productPageTech/ProductPageTech";
import { ProductPageDescription } from "./ProductPageDescription/productPageDescription/ProductPageDescription";
import { SwiperCards } from "../swiperCards/SwiperCards";

function saveRecentProduct(product: { id: string; slug: string }) {
  const LIMIT = 10;

  const raw = Cookies.get("recentProducts");
  let arr: { id: string; slug: string }[] = [];

  if (raw) {
    try {
      arr = JSON.parse(raw);
    } catch {
      arr = [];
    }
  }

  arr = arr.filter((p) => p.id !== product.id);

  // ➕ добавляем в начало
  arr.unshift({ id: product.id, slug: product.slug });

  // ✂ ограничиваем длину
  arr = arr.slice(0, LIMIT);

  Cookies.set("recentProducts", JSON.stringify(arr), {
    expires: 7,
    sameSite: "lax",
  });
}

export function getRecentProducts(): { id: string; slug: string }[] {
  const raw = Cookies.get("recentProducts");
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

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

    saveRecentProduct({ id: product.id, slug: product.slug });
  }, [productsLoaded, products, slug, dispatch, router]);

  if (!currentProduct || !products) {
    return (
      <div className="h-[80vh] flex justify-center">
        <Loader />
      </div>
    );
  }

  const alsoMayLike = products.filter((el) => {
    if (!currentProduct) return false;

    if (el.id === currentProduct.id) return false;

    if (!currentProduct.productGroup?.trim()) {
      return el.category === currentProduct.category;
    }

    return (
      el.category === currentProduct.category &&
      el.productGroup !== currentProduct.productGroup
    );
  });

  const recentProductsId = getRecentProducts();

  const recentViewed = products.filter((el) => {
    return recentProductsId.some(
      (recent) => recent.id == el.id && recent.id !== currentProduct.id
    );
  });

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
        <div className="ProductPageWrapper-tech-description">
          <ProductPageTech />
          <ProductPageDescription />
        </div>
      </div>
      <SwiperCards cards={alsoMayLike} title="you may also like" />
      {recentViewed.length > 0 && (
        <SwiperCards cards={recentViewed} title="Recently viewed" />
      )}
    </div>
  );
}
