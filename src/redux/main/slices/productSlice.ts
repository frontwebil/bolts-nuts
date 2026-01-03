import { ProductWithRelations } from "@/types/ProductType";
import { createSlice } from "@reduxjs/toolkit";

type initialStateType = {
  products: ProductWithRelations[];
  selectedCategory: string;
};

const initialState: initialStateType = {
  products: [],
  selectedCategory: "",
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
  },
});

export const { setProducts, setSelectedCategory } = productSlice.actions;

export default productSlice.reducer;
