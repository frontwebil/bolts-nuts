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
  const {
    selectedCategory,
    typeCatalog,
    productsLoaded,
    sortBy,
    filterSearchTerm,
  } = useSelector((store: RootState) => store.productSlice);

  const filteredProducts = useSelector(selectFilteredProducts);

  const titleText =
    filterSearchTerm.length > 0
      ? `Search results for "${filterSearchTerm}"`
      : typeCatalog === ""
        ? selectedCategory || "Catalog"
        : typeCatalog.replaceAll("-", " ").toUpperCase();

  const getMainOption = (p: ProductWithRelations) =>
    p.options?.find((o) => o.isMain) || p.options?.[0];

  const getDiscountPercent = (p: ProductWithRelations) => {
    const main = getMainOption(p);
    return main?.discount && main.discount > 0 ? main.discount : 0;
  };

  const getDiscountedPrice = (price: number, discount?: number | null) => {
    if (!discount || discount <= 0) return price;

    // 2 знаки після коми, 1.125 -> 1.13
    return Math.round(price * (1 - discount / 100) * 100) / 100;
  };

  const getProductPrice = (p: ProductWithRelations) => {
    const main = p.options?.find((o) => o.isMain) || p.options?.[0];
    if (!main) return 0;

    return getDiscountedPrice(main.price, main.discount);
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
              {filterSearchTerm.length > 0 ? (
                <span>
                  Search results for{" "}
                  <span style={{ color: "#FF5A00" }}>{filterSearchTerm}</span>
                </span>
              ) : (
                titleText
              )}
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
            {filterSearchTerm.length > 0 ? (
              <span>
                Search results for <span style={{ color: "#FF5A00" }}>{filterSearchTerm}</span>
              </span>
            ) : (
              titleText
            )}
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

            if (sortBy === "On Sale") {
              const aOnSale = getDiscountPercent(a) > 0;
              const bOnSale = getDiscountPercent(b) > 0;
              return Number(bOnSale) - Number(aOnSale);
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
