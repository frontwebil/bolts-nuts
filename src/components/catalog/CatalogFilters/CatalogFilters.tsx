"use client";

import { useSelector } from "react-redux";
import "../CatalogFilters/style.css";
import { SelectedCategory } from "./SelectedCategory";
import { SelectedFilters } from "./SelectedFilters";
import { RootState } from "@/redux/main/store";
import FiltersGroup from "./FiltersGroup";

export function CatalogFilters() {
  const { filtersSpecs } = useSelector(
    (store: RootState) => store.productSlice
  );

  return (
    <div className="CatalogFilters">
      <div className="CatalogFilters-top">
        <h3>Filter</h3>
      </div>
      <div className="CatalogFilters-content">
        <SelectedFilters />
        <SelectedCategory />
        {Object.entries(filtersSpecs).map((row, i) => {
          return <FiltersGroup key={i} values={row[1]} label={row[0]} />;
        })}
      </div>
    </div>
  );
}
