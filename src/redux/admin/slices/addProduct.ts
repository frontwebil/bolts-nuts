import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type BooleanFields = "isActive" | "isBestSeller" | "inStock";

type TextFields = "title" | "description";

type AddProductState = {
  selectedCategoryId: string;
  category: string;
  title: string;
  description: string;
  isActive: boolean;
  isBestSeller: boolean;
  inStock: boolean;
  images: string[];
};

const initialState: AddProductState = {
  selectedCategoryId: "bolts-screws",
  title: "",
  description: "",
  category: "Bolts / Screws",
  isActive: true,
  isBestSeller: false,
  inStock: true,
  images: [],
};

const addProductSlice = createSlice({
  name: "UIslice",
  initialState,
  reducers: {
    setSelectedCategoryId(state, action) {
      state.selectedCategoryId = action.payload.category;
      state.category = action.payload.normalName;

      state.title = "";
      state.description = "";
    },
    resetAddProduct() {
      return initialState;
    },
    setBooleanField(
      state,
      action: PayloadAction<{ field: BooleanFields; value: boolean }>
    ) {
      state[action.payload.field] = action.payload.value;
    },
    setTextField(
      state,
      action: PayloadAction<{ field: TextFields; value: string }>
    ) {
      state[action.payload.field] = action.payload.value;
    },
    setImages(state, action: PayloadAction<string[]>) {
      state.images = action.payload;
    },
  },
});

export const {
  setSelectedCategoryId,
  resetAddProduct,
  setBooleanField,
  setTextField,
  setImages,
} = addProductSlice.actions;

export default addProductSlice.reducer;
