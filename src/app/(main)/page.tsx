import { CategoryWrapper } from "@/components/hero/CategoryWrapper/CategoryWrapper";
import { HeroBanner } from "@/components/hero/HeroBanner/HeroBanner";
import { PopularSearch } from "@/components/hero/PopularSearch/PopularSearch";
import { SwiperCards } from "@/components/swiperCards/SwiperCards";

export default function Home() {
  const cards = [
    {
      title: "DuraDrive #8 x 3 in.",
      subTitle: "Square Drive Deck Screws",
      price: "34.95",
      img: "/images/swiper-example/1.png",
    },
    {
      title: "DuraDrive #8 x 3 in.",
      subTitle: "Square Drive Deck Screws",
      price: "34.95",
      img: "/images/swiper-example/2.png",
    },
    {
      title: "DuraDrive #8 x 3 in.",
      subTitle: "Square Drive Deck Screws",
      price: "34.95",
      img: "/images/swiper-example/3.png",
    },
    {
      title: "DuraDrive #8 x 3 in.",
      subTitle: "Square Drive Deck Screws",
      price: "34.95",
      img: "/images/swiper-example/4.png",
    },
    {
      title: "DuraDrive #8 x 3 in.",
      subTitle: "Square Drive Deck Screws",
      price: "34.95",
      img: "/images/swiper-example/4.png",
    },
    {
      title: "DuraDrive #8 x 3 in.",
      subTitle: "Square Drive Deck Screws",
      price: "34.95",
      img: "/images/swiper-example/4.png",
    },
    {
      title: "DuraDrive #8 x 3 in.",
      subTitle: "Square Drive Deck Screws",
      price: "34.95",
      img: "/images/swiper-example/4.png",
    },
    {
      title: "DuraDrive #8 x 3 in.",
      subTitle: "Square Drive Deck Screws",
      price: "34.95",
      img: "/images/swiper-example/4.png",
    },
    {
      title: "DuraDrive #8 x 3 in.",
      subTitle: "Square Drive Deck Screws",
      price: "34.95",
      img: "/images/swiper-example/4.png",
    },
  ];

  return (
    <div className="container">
      <PopularSearch />
      <HeroBanner />
      <CategoryWrapper />
      <SwiperCards cards={cards} title={"New Arrivals"} />
      <SwiperCards cards={cards} title={"Power Tools"} />
      <SwiperCards cards={cards} title={"Hand Tools"} />
      <SwiperCards cards={cards} title={"Site Cleaning"} />
    </div>
  );
}
