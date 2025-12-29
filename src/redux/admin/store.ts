import { configureStore } from "@reduxjs/toolkit";
import addProductSlice from "./slices/addProduct";

export const store = configureStore({
  reducer: { addProductSlice },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
