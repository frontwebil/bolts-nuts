import { CATEGORY_TEMPLATES } from "@/generalConfigs/CATEGORY_TEMPLATE";
import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

type BooleanFields = "isActive" | "isBestSeller" | "inStock";

type TextFields = "title" | "description";

export type ProductOptionDraft = {
  clientId: string; // фронтовий id
  label: string;
  value?: string;
  price: number;
  discount?: number;
  unit?: string;
  isMain: boolean;
  inStock: boolean;
};

type AddProductState = {
  selectedCategoryId: string;
  category: string;
  title: string;
  description: string;
  isActive: boolean;
  isBestSeller: boolean;
  inStock: boolean;
  images: string[];
  options: ProductOptionDraft[];
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
  options: [],
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
    addOption(state) {
      // якщо це перша опція — робимо main
      const makeMain = state.options.length === 0;
      const OPTION_LABEL_FROM_TEMPLATE = CATEGORY_TEMPLATES.filter(
        (el) => el.id == state.selectedCategoryId
      )[0].labelOptions;

      state.options.push({
        clientId: nanoid(),
        label: OPTION_LABEL_FROM_TEMPLATE,
        value: "",
        price: 0,
        discount: 0,
        unit: "",
        isMain: makeMain,
        inStock: true,
      });
    },
    removeOption(state, action: PayloadAction<string>) {
      const id = action.payload;
      const wasMain = state.options.find((o) => o.clientId === id)?.isMain;

      state.options = state.options.filter((o) => o.clientId !== id);

      if (wasMain && state.options.length > 0) {
        state.options[0].isMain = true;
      }
    },
    updateOptionField(
      state,
      action: PayloadAction<{
        clientId: string;
        field: keyof Omit<ProductOptionDraft, "clientId">;
        value: any;
      }>
    ) {
      const { clientId, field, value } = action.payload;
      const opt = state.options.find((o) => o.clientId === clientId);
      if (!opt) return;
      // @ts-expect-error - controlled fields
      opt[field] = value;
    },
    setMainOption(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.options.forEach((o) => (o.isMain = o.clientId === id));
    },
    moveOption(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      if (from === to) return;
      if (from < 0 || to < 0) return;
      if (from >= state.options.length || to >= state.options.length) return;

      const [item] = state.options.splice(from, 1);
      state.options.splice(to, 0, item);
    },
  },
});

export const {
  setSelectedCategoryId,
  resetAddProduct,
  setBooleanField,
  setTextField,
  setImages,
  addOption,
  removeOption,
  updateOptionField,
  setMainOption,
  moveOption,
} = addProductSlice.actions;

export default addProductSlice.reducer;
