"use client";

import { RootState } from "@/redux/main/store";
import { useSelector } from "react-redux";
import { ProductCard } from "../productCard/ProductCard";

export function CatalogCards() {
  const { products } = useSelector((store: RootState) => store.productSlice);
  return (
    <div className="catalog-cards">
      {products.map((el, i) => (
        <ProductCard data={el} key={i} />
      ))}
    </div>
  );
}
