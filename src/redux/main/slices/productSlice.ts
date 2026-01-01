import { ProductWithRelations } from "@/types/ProductType";
import { createSlice } from "@reduxjs/toolkit";

type initialStateType = {
  products: ProductWithRelations[];
};

const initialState: initialStateType = {
  products: [],
};

const productSlice = createSlice({
  name: "Product Slice",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const {setProducts} = productSlice.actions;

export default productSlice.reducer;
