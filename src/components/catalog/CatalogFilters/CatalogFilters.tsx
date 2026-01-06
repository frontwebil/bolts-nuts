"use client";

import "../CatalogFilters/style.css";
import { SelectedCategory } from "./SelectedCategory";
import { SelectedFilters } from "./SelectedFilters";

export function CatalogFilters() {
  return (
    <div className="CatalogFilters">
      <div className="CatalogFilters-top">
        <h3>Filter</h3>
      </div>
      <div className="CatalogFilters-content">
        <SelectedFilters />
        <SelectedCategory />
      </div>
    </div>
  );
}
