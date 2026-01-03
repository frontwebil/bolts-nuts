"use client";

import "../CatalogFilters/style.css";
import { SelectedCategory } from "./SelectedCategory";

export function CatalogFilters() {
  return (
    <div className="CatalogFilters">
      <div className="CatalogFilters-top">
        <h3>Filter</h3>
      </div>
      <div className="CatalogFilters-content">
        <SelectedCategory />
      </div>
    </div>
  );
}
