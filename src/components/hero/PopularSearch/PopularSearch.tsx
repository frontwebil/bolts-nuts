"use client";

import { CATEGORYES } from "@/generalConfigs/SITE_CONFIG";
import "../PopularSearch/style.css";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setSelectedCategory } from "@/redux/main/slices/productSlice";

export function PopularSearch() {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className="PopularSearch">
      <h3>Popular searches:</h3>
      <div className="PopularSearch-row-blocks">
        {CATEGORYES.map((el, i) => (
          <div
            className="PopularSearch-block"
            key={i}
            onClick={() => {
              dispatch(setSelectedCategory(el.category));
              router.replace("/catalog");
            }}
          >
            {el.category}
          </div>
        ))}
      </div>
    </div>
  );
}
