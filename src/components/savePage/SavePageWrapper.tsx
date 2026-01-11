"use client";

import Link from "next/link";
import "../catalog/CatalogCards/style.css";
import "./style.css";
import { Breadcrums } from "../breadcrums/Breadcrums";
import { SwiperCards } from "../swiperCards/SwiperCards";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/main/store";
import { getRecentProducts } from "../productPageWrapper/productPageWrapper";
import { HeroBanner } from "../hero/HeroBanner/HeroBanner";
import { ProductCard } from "../productCard/ProductCard";
import { SortButtonSaved } from "./SortButtons";
import { ProductWithRelations } from "@/types/ProductType";

export function SavePageWrapper() {
  const { products, sortBySaved } = useSelector(
    (store: RootState) => store.productSlice
  );
  const { favoriteProducts } = useSelector((store: RootState) => store.uiSlice);

  const favorites = products.filter((el) => favoriteProducts.includes(el.id));

  const recentProductsId = getRecentProducts();

  const recentViewed = products.filter((el) => {
    return recentProductsId.some((recent) => recent.id == el.id);
  });

  const alsoMayLike = products.filter((el) => {
    if (recentViewed.length <= 0) return false;

    return el.category === recentViewed[0].category;
  });

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

  return (
    <div className="container">
      <Breadcrums links={[{ title: "Home", href: "/" }, { title: "Saved" }]} />
      {favoriteProducts && favoriteProducts.length > 0 ? (
        <>
          <div className="SavePageWrapper-cards">
            <div className="CatalogCards-top">
              <div className="CatalogCards-top-start-content">
                <h2>SAVED</h2>
                <p>{favorites.length} products</p>
              </div>
              <SortButtonSaved />
            </div>
            <div className="SavePageWrapper-cards-grid">
              {(() => {
                const list =
                  sortBySaved === "Newest"
                    ? [...favorites].reverse()
                    : [...favorites].sort((a, b) => {
                        if (sortBySaved === "Price: Low to High") {
                          return getProductPrice(a) - getProductPrice(b);
                        }

                        if (sortBySaved === "Price: High to Low") {
                          return getProductPrice(b) - getProductPrice(a);
                        }

                        if (sortBySaved === "Best Selling") {
                          return (
                            Number(b.isBestSeller) - Number(a.isBestSeller)
                          );
                        }

                        if (sortBySaved === "On Sale") {
                          const aOnSale = getDiscountPercent(a) > 0;
                          const bOnSale = getDiscountPercent(b) > 0;
                          return Number(bOnSale) - Number(aOnSale);
                        }

                        return 0;
                      });

                return list.map((el) => <ProductCard data={el} key={el.id} />);
              })()}
            </div>
          </div>
          <HeroBanner />
        </>
      ) : (
        <>
          <div className="SavePageWrapper">
            <h3>wait...</h3>
            <h2>Nothing Saved Yet</h2>
            <p>
              See something you love? Save it now, buy it later—your wishlist
              remembers for you!
            </p>
            <Link className="SavePageWrapper-button" href={"/"}>
              Start Exploring
            </Link>
          </div>
          <SwiperCards cards={alsoMayLike} title="Recomended" />
          <HeroBanner />
          <div className="margin-top"></div>
          <SwiperCards cards={recentViewed} title="Recently viewed" />
        </>
      )}
    </div>
  );
}
