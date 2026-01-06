"use client";

import { useDispatch, useSelector } from "react-redux";
import "../CatalogFilters/style.css";
import { SelectedCategory } from "./SelectedCategory";
import { SelectedFilters } from "./SelectedFilters";
import { RootState } from "@/redux/main/store";
import FiltersGroup from "./FiltersGroup";
import { resetFilters } from "@/redux/main/slices/productSlice";

export function CatalogFilters() {
  const { filtersSpecs, selectedCategory } = useSelector(
    (store: RootState) => store.productSlice
  );
  const dispatch = useDispatch();

  return (
    <div className="CatalogFilters">
      <div className="CatalogFilters-top">
        <h3>Filter</h3>
        {selectedCategory && (
          <p onClick={() => dispatch(resetFilters())}>Clear All</p>
        )}
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
