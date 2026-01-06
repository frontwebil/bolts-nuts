"use client";

import { ProductCard } from "@/components/productCard/ProductCard";
import { RootState } from "@/redux/main/store";
import { useSelector } from "react-redux";

import "../CatalogCards/style.css";
import Loader from "@/components/loader/Loader";
import { PiCaretDownBold } from "react-icons/pi";
import { selectFilteredProducts } from "@/redux/main/selector/selectFilteredProducts";

export function CatalogCardsContainer() {
  const { selectedCategory, typeCatalog, productsLoaded } = useSelector(
    (store: RootState) => store.productSlice
  );

  const products = useSelector(selectFilteredProducts);

  const cardsToShow = selectedCategory
    ? products.filter((el) => el.category == selectedCategory)
    : products;

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
        <div className="CatalogCards-top-end-content">
          <div className="CatalogCards-sort-component">
            <div className="CatalogCards-sort-component-title">
              <p>Sort by:</p>
              <div className="CatalogCards-sort-component-title-sort-option">
                <p>Newest Arrivals</p>
                <PiCaretDownBold />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="CatalogCardsContainer">
        {cardsToShow.map((el) => (
          <ProductCard data={el} key={el.id} />
        ))}
      </div>
    </div>
  );
}
