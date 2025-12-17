import { CATEGORYES } from "@/generalConfigs/SITE_CONFIG";
import { createSlice } from "@reduxjs/toolkit";

type AuthOption = "login" | "register" | "recovery";

type initialStateType = {
  isOpenCatalog: boolean;
  activeCategory: string;
  authFormOption: AuthOption;
  isOpenAuthModal: boolean;
};

const initialState: initialStateType = {
  isOpenCatalog: false,
  activeCategory: CATEGORYES[0].category,
  authFormOption: "recovery",
  isOpenAuthModal: true,
};

const uiSlice = createSlice({
  name: "UIslice",
  initialState,
  reducers: {
    toggleBurger: (state) => {
      state.isOpenCatalog = !state.isOpenCatalog;
      state.isOpenAuthModal = false;
    },
    closeBurger: (state) => {
      state.isOpenCatalog = false;
    },
    setAtiveCategory: (state, action) => {
      const category = action.payload;
      state.activeCategory = category;
    },
    setAuthOption(state, action) {
      state.authFormOption = action.payload;
    },
    closeAuthModal(state) {
      state.isOpenAuthModal = false;
    },
    openAuthModal(state) {
      state.isOpenAuthModal = true;
    },
  },
});

export const {
  toggleBurger,
  closeBurger,
  setAtiveCategory,
  setAuthOption,
  openAuthModal,
  closeAuthModal,
} = uiSlice.actions;

export default uiSlice.reducer;
