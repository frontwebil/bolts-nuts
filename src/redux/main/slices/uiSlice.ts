import { CATEGORYES } from "@/generalConfigs/SITE_CONFIG";
import { createSlice } from "@reduxjs/toolkit";

type initialStateType = {
  isOpenCatalog: boolean;
  activeCategory: string;
};

const initialState: initialStateType = {
  isOpenCatalog: false,
  activeCategory: CATEGORYES[0].category,
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
    setAtiveCategory: (state, action) => {
      const category = action.payload;
      state.activeCategory = category;
    },
  },
});

export const { toggleBurger, closeBurger, setAtiveCategory } = uiSlice.actions;

export default uiSlice.reducer;
