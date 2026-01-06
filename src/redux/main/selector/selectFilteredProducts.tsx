import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectFilteredProducts = createSelector(
  (s: RootState) => s.productSlice.products,
  (s: RootState) => s.productSlice.selectedCategory,
  (s: RootState) => s.productSlice.selectedSpecs,
  (products, selectedCategory, selectedSpecs) => {
    // 1) категорія
    const res = selectedCategory
      ? products.filter((p) => p.category === selectedCategory)
      : products;

    // 2) specs: ігноруємо пусті масиви
    const active = Object.entries(selectedSpecs).filter(
      ([, values]) => values.length > 0
    );
    if (active.length === 0) return res;

    return res.filter((p) =>
      active.every(([key, values]) =>
        p.specs?.some((s) => s.key === key && values.includes(s.value))
      )
    );
  }
);
