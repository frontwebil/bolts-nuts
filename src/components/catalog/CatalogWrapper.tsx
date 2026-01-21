"use client";

import { CatalogFilters } from "./CatalogFilters/CatalogFilters";
import "../catalog/style.css";
import { Breadcrums } from "../breadcrums/Breadcrums";
import { CatalogCardsContainer } from "./CatalogCards/CatalogCards";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  setFilterSearchTerm,
  setTypeCatalog,
} from "@/redux/main/slices/productSlice";
import { RootState } from "@/redux/main/store";
import { useWindowWidth } from "@/hooks/useWidth";
import { CatalogFiltersMobile } from "./CatalogFilters/CatalogFiltersMobile";

export function CatalogWrapper() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "";
  const searchTerm = searchParams.get("searchParams")?.trim() || "";

  console.log(searchTerm);
  // const category = searchParams.get("category") || "";
  const dispatch = useDispatch();
  const { typeCatalog } = useSelector((store: RootState) => store.productSlice);
  useEffect(() => {
    dispatch(setFilterSearchTerm(searchTerm));
  }, [dispatch, searchTerm]);
  useEffect(() => {
    dispatch(setTypeCatalog(type));
  }, [dispatch, type]);
  const width = useWindowWidth();

  const crumbs = [
    { title: "Home", href: "/" },
    {
      title: typeCatalog ? typeCatalog.replaceAll("-", " ") : "Catalog",
      href: "/catalog",
    },
    ...(searchTerm.length > 0
      ? [
          {
            title: `Search results for "${searchTerm}"`,
          },
        ]
      : []),
  ];

  return (
    <div className="CatalogWrapper">
      <Breadcrums links={crumbs} />
      <div className="CatalogWrapper-flex">
        {width && width > 768 ? <CatalogFilters /> : <CatalogFiltersMobile />}
        <CatalogCardsContainer />
      </div>
    </div>
  );
}
