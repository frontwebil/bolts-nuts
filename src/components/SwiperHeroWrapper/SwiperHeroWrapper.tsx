"use client";

import { useSelector } from "react-redux";
import { SwiperCards } from "../swiperCards/SwiperCards";
import { RootState } from "@/redux/main/store";

export function SwiperHeroWrapper() {
  const { products } = useSelector((store: RootState) => store.productSlice);
  return (
    <>
      <SwiperCards cards={products} title={"New Arrivals"} />
      <SwiperCards cards={products} title={"Power Tools"} />
      <SwiperCards cards={products} title={"Hand Tools"} />
      <SwiperCards cards={products} title={"Site Cleaning"} />
    </>
  );
}
