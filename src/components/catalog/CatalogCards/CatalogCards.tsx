"use client";

import { ProductCard } from "@/components/productCard/ProductCard";
import { RootState } from "@/redux/main/store";
import { useSelector } from "react-redux";

import "../CatalogCards/style.css";
import Loader from "@/components/loader/Loader";
import { selectFilteredProducts } from "@/redux/main/selector/selectFilteredProducts";
import { SortButton } from "./SortButton";
import { ProductWithRelations } from "@/types/ProductType";

export function CatalogCardsContainer() {
  const { selectedCategory, typeCatalog, productsLoaded, sortBy } = useSelector(
    (store: RootState) => store.productSlice
  );

  const filteredProducts = useSelector(selectFilteredProducts);

  const getProductPrice = (p: ProductWithRelations) => {
    const main = p.options?.find((o) => o.isMain);
    if (main) return main.price;

    return Math.min(...p.options.map((o) => o.price));
  };

  const cardsToShow = selectedCategory
    ? filteredProducts.filter((el) => el.category == selectedCategory)
    : filteredProducts;

  if (!productsLoaded) {
    return <Loader />;
  }

  if (cardsToShow.length < 1) {
    return (
      <div className="CatalogCards-wrapper h-screen">
        <div className="CatalogCards-top">
          <div className="CatalogCards-top-start-content">
            <h2>
              {typeCatalog == ""
                ? selectedCategory
                  ? selectedCategory
                  : "Catalog"
                : typeCatalog.replaceAll("-", " ").toUpperCase()}
            </h2>
            <p>{cardsToShow.length} products</p>
          </div>
        </div>
        <p className="flex justify-center items-center text-center w-full mt-12">
          Products not found
        </p>
      </div>
    );
  }

  return (
    <div className="CatalogCards-wrapper">
      <div className="CatalogCards-top">
        <div className="CatalogCards-top-start-content">
          <h2>
            {typeCatalog == ""
              ? selectedCategory
                ? selectedCategory
                : "Catalog"
              : typeCatalog.replaceAll("-", " ").toUpperCase()}
          </h2>
          <p>{cardsToShow.length} products</p>
        </div>
        <SortButton />
      </div>
      <div className="CatalogCardsContainer">
        {[...cardsToShow]
          .sort((a: ProductWithRelations, b: ProductWithRelations) => {
            if (sortBy === "Newest Arrivals") {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            }

            if (sortBy === "Price: Low to High") {
              return getProductPrice(a) - getProductPrice(b);
            }

            if (sortBy === "Price: High to Low") {
              return getProductPrice(b) - getProductPrice(a);
            }

            if (sortBy === "Best Selling") {
              return Number(b.isBestSeller) - Number(a.isBestSeller);
            }

            return 0;
          })
          .map((el) => (
            <ProductCard data={el} key={el.id} />
          ))}
      </div>
    </div>
  );
}
