import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectFilteredProducts = createSelector(
  (s: RootState) => s.productSlice.products,
  (s: RootState) => s.productSlice.selectedCategory,
  (s: RootState) => s.productSlice.selectedSpecs,
  (s: RootState) => s.productSlice.filterSearchTerm, // ⬅️ додали
  (products, selectedCategory, selectedSpecs, filterSearchTerm) => {
    let res = selectedCategory
      ? products.filter((p) => p.category === selectedCategory)
      : products;

    // 2) specs
    const active = Object.entries(selectedSpecs).filter(
      ([, values]) => values.length > 0,
    );

    if (active.length > 0) {
      res = res.filter((p) =>
        active.every(([key, values]) =>
          p.specs?.some((s) => s.key === key && values.includes(s.value)),
        ),
      );
    }

    // 3) ПРОСТИЙ пошук
    const term = filterSearchTerm.trim().toLowerCase();

    if (term.length >= 2) {
      res = res.filter((p) => {
        const inTitle = p.title.toLowerCase().includes(term);
        const inDesc = p.description.toLowerCase().includes(term);
        const inCategory = p.category.toLowerCase().includes(term);

        const inOptions =
          p.options?.some(
            (o) =>
              o.label.toLowerCase().includes(term) ||
              o.value?.toLowerCase().includes(term),
          ) ?? false;

        const inSpecs =
          p.specs?.some(
            (s) =>
              s.key.toLowerCase().includes(term) ||
              s.value.toLowerCase().includes(term),
          ) ?? false;

        return inTitle || inDesc || inCategory || inOptions || inSpecs;
      });
    }

    return res;
  },
);
