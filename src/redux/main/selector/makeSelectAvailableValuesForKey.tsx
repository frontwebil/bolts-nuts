/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const matchesSpecs = (
  p: any,
  selectedSpecs: Record<string, string[]>,
  ignoreKey?: string,
) => {
  const active = Object.entries(selectedSpecs).filter(
    ([k, arr]) => k !== ignoreKey && (arr?.length ?? 0) > 0,
  );

  return active.every(([k, arr]) =>
    p.specs?.some((s: any) => s.key === k && arr.includes(s.value)),
  );
};

const matchesSearch = (p: any, term: string) => {
  if (!term || term.length < 2) return true;

  const t = term.toLowerCase();

  const inTitle = p.title?.toLowerCase().includes(t);
  const inDesc = p.description?.toLowerCase().includes(t);
  const inCategory = p.category?.toLowerCase().includes(t);

  const inOptions =
    p.options?.some(
      (o: any) =>
        o.label?.toLowerCase().includes(t) ||
        o.value?.toLowerCase().includes(t),
    ) ?? false;

  const inSpecs =
    p.specs?.some(
      (s: any) =>
        s.key?.toLowerCase().includes(t) || s.value?.toLowerCase().includes(t),
    ) ?? false;

  return inTitle || inDesc || inCategory || inOptions || inSpecs;
};

// ✅ selector factory
export const makeSelectAvailableValuesForKey = (key: string) =>
  createSelector(
    (s: RootState) => s.productSlice.products,
    (s: RootState) => s.productSlice.selectedCategory,
    (s: RootState) => s.productSlice.selectedSpecs,
    (s: RootState) => s.productSlice.filterSearchTerm, // ⬅️ ДОДАЛИ
    (products, selectedCategory, selectedSpecs, filterSearchTerm) => {
      // 1) категорія
      let base = selectedCategory
        ? products.filter((p) => p.category === selectedCategory)
        : products;

      // 2) пошук
      const term = filterSearchTerm.trim().toLowerCase();
      if (term.length >= 2) {
        base = base.filter((p) => matchesSearch(p, term));
      }

      // 3) фільтр по інших specs (крім key)
      const filteredByOtherKeys = base.filter((p) =>
        matchesSpecs(p, selectedSpecs, key),
      );

      // 4) збираємо доступні values для цього key
      const set = new Set<string>();
      filteredByOtherKeys.forEach((p) => {
        p.specs?.forEach((s: any) => {
          if (s.key === key) set.add(s.value);
        });
      });

      return set; // Set<string>
    },
  );
