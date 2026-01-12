import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderProducts: [],
};

const orderCartSlice = createSlice({
  name: "Order Cart Slice",
  initialState,
  reducers: {},
});

export const {} = orderCartSlice.actions;

export default orderCartSlice.reducer;
