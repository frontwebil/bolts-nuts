import { createSlice } from "@reduxjs/toolkit";

type initialStateType = {
  isOpenCatalog: boolean;
};

const initialState: initialStateType = {
  isOpenCatalog: false,
};

const uiSlice = createSlice({
  name: "UIslice",
  initialState,
  reducers: {
    toggleBurger: (state) => {
      state.isOpenCatalog = !state.isOpenCatalog;
    },
    closeBurger: (state) => {
      state.isOpenCatalog = false;
    },
  },
});

export const { toggleBurger, closeBurger } = uiSlice.actions;

export default uiSlice.reducer;
