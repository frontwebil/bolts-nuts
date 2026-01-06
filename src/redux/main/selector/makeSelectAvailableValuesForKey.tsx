/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const matchesSpecs = (
  p: any,
  selectedSpecs: Record<string, string[]>,
  ignoreKey?: string
) => {
  const active = Object.entries(selectedSpecs).filter(
    ([k, arr]) => k !== ignoreKey && (arr?.length ?? 0) > 0
  );

  return active.every(([k, arr]) =>
    p.specs?.some((s: any) => s.key === k && arr.includes(s.value))
  );
};

// ✅ selector factory: дає список values, які НЕ вб'ють результати
export const makeSelectAvailableValuesForKey = (key: string) =>
  createSelector(
    (s: RootState) => s.productSlice.products,
    (s: RootState) => s.productSlice.selectedCategory,
    (s: RootState) => s.productSlice.selectedSpecs,
    (products, selectedCategory, selectedSpecs) => {
      // 1) беремо продукти категорії (якщо треба)
      const base = selectedCategory
        ? products.filter((p) => p.category === selectedCategory)
        : products;

      // 2) залишаємо ті, що проходять інші ключі (крім key)
      const filteredByOtherKeys = base.filter((p) =>
        matchesSpecs(p, selectedSpecs, key)
      );

      // 3) з цих продуктів збираємо які values реально існують для цього key
      const set = new Set<string>();
      filteredByOtherKeys.forEach((p) => {
        p.specs?.forEach((s: any) => {
          if (s.key === key) set.add(s.value);
        });
      });

      return set; // Set<string>
    }
  );
