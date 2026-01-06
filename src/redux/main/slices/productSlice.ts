import { ProductWithRelations } from "@/types/ProductType";
import { createSlice } from "@reduxjs/toolkit";

type ProductOptions = ProductWithRelations["options"][number];
type Spec = { key: string; value: string };
type SpecOptions = Record<string, string[]>;
type SelectedSpecs = Record<string, string[]>;

type initialStateType = {
  products: ProductWithRelations[];
  selectedCategory: string;
  typeCatalog: string;
  currentProduct: ProductWithRelations | null;
  mainVariant: ProductOptions | null;
  productsFromGroups: ProductWithRelations[];
  productsLoaded: boolean;
  filtersSpecs: SpecOptions;
  selectedSpecs: SelectedSpecs;
};

const initialState: initialStateType = {
  products: [],
  selectedCategory: "",
  typeCatalog: "",
  currentProduct: null,
  mainVariant: null,
  productsFromGroups: [],
  productsLoaded: false,
  filtersSpecs: {},
  selectedSpecs: {},
};

const parseInchValue = (value?: string | null): number => {
  if (!value) return 0;

  // прибираємо все крім цифр, / і -
  const clean = value.replace(/[^0-9\/\-\.]/g, "");

  // 2-1/2
  if (clean.includes("-")) {
    const [whole, frac] = clean.split("-");
    const [n, d] = frac.split("/");
    return Number(whole) + Number(n) / Number(d);
  }

  // 1/2
  if (clean.includes("/")) {
    const [n, d] = clean.split("/");
    return Number(n) / Number(d);
  }

  // 2
  return Number(clean);
};

export function buildSpecOptions(specs: Spec[]) {
  const map: Record<string, Set<string>> = {};

  for (const { key, value } of specs) {
    if (!key || !value) continue;
    (map[key] ??= new Set()).add(value);
  }

  return Object.fromEntries(
    Object.entries(map).map(([k, set]) => [k, Array.from(set)])
  ) as Record<string, string[]>;
}

const productSlice = createSlice({
  name: "Product Slice",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.productsLoaded = true;

      if (!state.selectedCategory) {
        state.filtersSpecs = {};
        state.selectedSpecs = {};
      } else {
        const categoryProducts = state.products.filter(
          (p) => p.category === state.selectedCategory
        );

        const allSpecs = categoryProducts.flatMap((p) => p.specs ?? []);
        state.filtersSpecs = buildSpecOptions(allSpecs);

        state.selectedSpecs = Object.fromEntries(
          Object.keys(state.filtersSpecs).map((k) => [k, []])
        );
      }
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      if (!state.selectedCategory) {
        state.filtersSpecs = {};
        state.selectedSpecs = {};
      } else {
        const categoryProducts = state.products.filter(
          (p) => p.category === state.selectedCategory
        );

        const allSpecs = categoryProducts.flatMap((p) => p.specs ?? []);
        state.filtersSpecs = buildSpecOptions(allSpecs);

        state.selectedSpecs = Object.fromEntries(
          Object.keys(state.filtersSpecs).map((k) => [k, []])
        );
      }
    },
    resetFilters: (state) => {
      state.filtersSpecs = {};
      state.selectedSpecs = {};
      state.selectedCategory = "";
    },
    setTypeCatalog: (state, action) => {
      const validValues = [
        "bestseller",
        "new-arrivals",
        "on-sale",
        "recommended",
      ];

      const isValidType = validValues.includes(action.payload);

      if (isValidType) {
        state.typeCatalog = action.payload;
        state.selectedCategory = "";
      } else {
        state.typeCatalog = "";
      }
    },
    resetProductSlice() {
      return initialState;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;

      const productGroup = action.payload?.productGroup;

      state.productsFromGroups = productGroup
        ? state.products
            .filter((el) => el.productGroup === productGroup)
            .slice()
            .sort((a, b) => {
              const aLen = parseInchValue(
                a.specs.find((s) => s.key === "Length")?.value
              );
              const bLen = parseInchValue(
                b.specs.find((s) => s.key === "Length")?.value
              );
              return aLen - bLen;
            })
        : [];
    },

    setMainVariant: (state, action) => {
      console.log(action.payload);
      state.mainVariant = action.payload;
    },
    toggleSpecValue: (state, action) => {
      const { key, value } = action.payload;

      const arr = state.selectedSpecs[key];

      if (arr.includes(value)) {
        state.selectedSpecs[key] = arr.filter((v) => v !== value);
      } else {
        state.selectedSpecs[key].push(value);
      }
    },
  },
});

export const {
  setProducts,
  setSelectedCategory,
  setTypeCatalog,
  resetProductSlice,
  setCurrentProduct,
  setMainVariant,
  toggleSpecValue,
  resetFilters,
} = productSlice.actions;

export default productSlice.reducer;
