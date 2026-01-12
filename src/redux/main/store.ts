import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "./slices/uiSlice";
import productSlice from "./slices/productSlice";
import orderCartSlice from "./slices/orderCartSlice";

export const store = configureStore({
  reducer: {
    uiSlice,
    productSlice,
    orderCartSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
