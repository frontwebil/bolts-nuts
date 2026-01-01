import { CategoryWrapper } from "@/components/hero/CategoryWrapper/CategoryWrapper";
import { HeroBanner } from "@/components/hero/HeroBanner/HeroBanner";
import { PopularSearch } from "@/components/hero/PopularSearch/PopularSearch";
import { SwiperHeroWrapper } from "@/components/SwiperHeroWrapper/SwiperHeroWrapper";

export default function Home() {

  return (
    <div className="container">
      <PopularSearch />
      <HeroBanner />
      <CategoryWrapper />
      <SwiperHeroWrapper />
    </div>
  );
}
