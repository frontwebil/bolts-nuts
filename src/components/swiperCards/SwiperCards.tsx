"use client";

import { PiArrowLineUpRightBold } from "react-icons/pi";
import "../swiperCards/style.css";
import { ProductCard } from "../productCard/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useState } from "react";
import { ProductWithRelations } from "@/types/ProductType";

type Props = {
  title: string;
  cards: ProductWithRelations[];
};

export function SwiperCards({ cards, title }: Props) {
  const [isReady, setIsReady] = useState(false);

  return (
    <section className="SwiperCards">
      <div className="SwiperCards-top">
        <h3>{title}</h3>
        <div className="SwiperCards-top-look-more">
          <p>
            Look for <span className="italic">more</span>
          </p>
          <PiArrowLineUpRightBold />
        </div>
      </div>

      <Swiper
        modules={[Pagination, FreeMode]}
        pagination={{ clickable: true }}
        spaceBetween={12}
        slidesPerView={2}
        freeMode={true}
        grabCursor={true}
        onInit={() => setIsReady(true)}
        breakpoints={{
          320: {
            slidesPerView: 1.7,
            spaceBetween: 10,
          },
          350: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          700: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
          1340: {
            slidesPerView: 5,
            spaceBetween: 15,
          },
        }}
        className={`SwiperCards-container ${isReady ? "visible" : "hidden"}`}
      >
        {cards.map((el, i) => (
          <SwiperSlide key={i}>
            <ProductCard data={el} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
