import { ProductWithRelations } from "@/types/ProductType";
import { createSlice } from "@reduxjs/toolkit";

type initialStateType = {
  products: ProductWithRelations[];
  selectedCategory: string;
  typeCatalog: string;
  currentProduct: ProductWithRelations | null;
};

const initialState: initialStateType = {
  products: [],
  selectedCategory: "",
  typeCatalog: "",
  currentProduct: null,
};

const productSlice = createSlice({
  name: "Product Slice",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
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
    },
  },
});

export const {
  setProducts,
  setSelectedCategory,
  setTypeCatalog,
  resetProductSlice,
  setCurrentProduct,
} = productSlice.actions;

export default productSlice.reducer;
