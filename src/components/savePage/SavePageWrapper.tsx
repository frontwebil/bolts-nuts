"use client";

import Link from "next/link";
import "./style.css";
import { Breadcrums } from "../breadcrums/Breadcrums";
import { SwiperCards } from "../swiperCards/SwiperCards";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/main/store";
import { getRecentProducts } from "../productPageWrapper/productPageWrapper";
import { HeroBanner } from "../hero/HeroBanner/HeroBanner";

export function SavePageWrapper() {
  const { products } = useSelector((store: RootState) => store.productSlice);

  const recentProductsId = getRecentProducts();

  const recentViewed = products.filter((el) => {
    return recentProductsId.some((recent) => recent.id == el.id);
  });

  const alsoMayLike = products.filter((el) => {
    if (recentViewed.length <= 0) return false;

    return el.category === recentViewed[0].category;
  });

  return (
    <div className="container">
      <Breadcrums links={[{ title: "Home", href: "/" }, { title: "Saved" }]} />
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
    </div>
  );
}
