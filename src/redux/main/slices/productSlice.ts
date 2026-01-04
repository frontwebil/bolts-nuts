import { ProductWithRelations } from "@/types/ProductType";
import { createSlice } from "@reduxjs/toolkit";

type ProductOptions = ProductWithRelations["options"][number];

type initialStateType = {
  products: ProductWithRelations[];
  selectedCategory: string;
  typeCatalog: string;
  currentProduct: ProductWithRelations | null;
  mainVariant: ProductOptions | null;
  productsFromGroups: ProductWithRelations[];
  productsLoaded: boolean;
};

const initialState: initialStateType = {
  products: [],
  selectedCategory: "",
  typeCatalog: "",
  currentProduct: null,
  mainVariant: null,
  productsFromGroups: [],
  productsLoaded: false,
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

const productSlice = createSlice({
  name: "Product Slice",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.productsLoaded = true;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
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
  },
});

export const {
  setProducts,
  setSelectedCategory,
  setTypeCatalog,
  resetProductSlice,
  setCurrentProduct,
  setMainVariant,
} = productSlice.actions;

export default productSlice.reducer;
