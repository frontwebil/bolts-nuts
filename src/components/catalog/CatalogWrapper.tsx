"use client";

import { CatalogFilters } from "./CatalogFilters/CatalogFilters";
import "../catalog/style.css";
import { Breadcrums } from "../breadcrums/Breadcrums";
import { CatalogCardsContainer } from "./CatalogCards/CatalogCards";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setTypeCatalog } from "@/redux/main/slices/productSlice";
import { RootState } from "@/redux/main/store";
import { useWindowWidth } from "@/hooks/useWidth";
import { CatalogFiltersMobile } from "./CatalogFilters/CatalogFiltersMobile";

export function CatalogWrapper() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "";
  // const category = searchParams.get("category") || "";
  const dispatch = useDispatch();
  const { typeCatalog } = useSelector((store: RootState) => store.productSlice);
  useEffect(() => {
    dispatch(setTypeCatalog(type));
  }, [dispatch, type]);
  const width = useWindowWidth();

  return (
    <div className="CatalogWrapper">
      <Breadcrums
        links={[
          { title: "Home", href: "/" },
          { title: typeCatalog ? typeCatalog.replaceAll("-", " ") : "Catalog" },
        ]}
      />
      <div className="CatalogWrapper-flex">
        {width && width > 768 ? <CatalogFilters /> : <CatalogFiltersMobile />}
        <CatalogCardsContainer />
      </div>
    </div>
  );
}
