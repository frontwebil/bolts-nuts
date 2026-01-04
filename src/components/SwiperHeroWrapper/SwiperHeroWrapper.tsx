"use client";

import { useSelector } from "react-redux";
import { SwiperCards } from "../swiperCards/SwiperCards";
import { RootState } from "@/redux/main/store";

export function SwiperHeroWrapper() {
  const { products } = useSelector((store: RootState) => store.productSlice);

  const boltsScrews = products.filter(
    (store) => store.category == "Bolts / Screws"
  );

  const anchors = products.filter((store) => store.category == "Anchors");
  return (
    <>
      <SwiperCards cards={products} title={"New Arrivals"} />
      <SwiperCards cards={boltsScrews} title={"Bolts / Screws"} />
      <SwiperCards cards={anchors} title={"Anchors"} />
      <SwiperCards cards={products} title={"Recommended"} />
    </>
  );
}
