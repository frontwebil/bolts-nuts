/* eslint-disable @typescript-eslint/no-explicit-any */
import { CATEGORY_TEMPLATES } from "@/generalConfigs/CATEGORY_TEMPLATE";
import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

type BooleanFields = "isActive" | "isBestSeller" | "inStock";

type TextFields = "title" | "description" | "anotherInfo";

export type ProductSpecDraft = {
  clientId: string;
  group: string;
  dbId?: string | null;
  key: string;
  value: string;
  type?: "text" | "select";
  options?: string[];
  placeholder?: string;
  required?: boolean;
};

export type ProductOptionDraft = {
  clientId: string;
  label: string;
  dbId?: string | null;
  value?: string;
  price: number;
  discount?: number;
  unit?: string;
  isMain: boolean;
  inStock: boolean;
};

type AddProductState = {
  productId?: string | null;
  selectedCategoryId: string;
  category: string;
  title: string;
  description: string;
  anotherInfo?: string;
  isActive: boolean;
  isBestSeller: boolean;
  inStock: boolean;
  images: string[];
  options: ProductOptionDraft[];
  specs: ProductSpecDraft[];
};

function buildSpecsFromCategory(categoryId: string): ProductSpecDraft[] {
  const tpl = CATEGORY_TEMPLATES.find((c) => c.id === categoryId);
  if (!tpl) return [];

  return tpl.specs.map((s) => ({
    clientId: nanoid(),
    group: s.group,
    key: s.key,
    type: s.type,
    options: s.options,
    placeholder: s.placeholder,
    required: s.required,
    value: "",
    dbId: null,
  }));
}

const defaultCategoryId = "bolts-screws";

const initialState: AddProductState = {
  selectedCategoryId: defaultCategoryId,
  productId: null,
  title: "",
  description: "",
  anotherInfo: "",
  category: "Bolts / Screws",
  isActive: true,
  isBestSeller: false,
  inStock: true,
  images: [],
  options: [],
  specs: buildSpecsFromCategory(defaultCategoryId),
};

const ProductSlice = createSlice({
  name: "UIslice",
  initialState,
  reducers: {
    setSelectedCategoryId(state, action) {
      state.selectedCategoryId = action.payload.category;
      state.category = action.payload.normalName;

      state.title = "";
      state.description = "";

      state.specs = buildSpecsFromCategory(action.payload.category);
    },
    resetAddProduct() {
      return { ...initialState, productId: null };
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
        dbId: null,
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

    updateSpecValue(
      state,
      action: PayloadAction<{ clientId: string; value: string }>
    ) {
      const { clientId, value } = action.payload;
      const spec = state.specs.find((s) => s.clientId === clientId);
      if (!spec) return;
      spec.value = value;
    },

    // якщо хочеш оновлювати по (group+key) замість clientId:
    updateSpecByKey(
      state,
      action: PayloadAction<{ group: string; key: string; value: string }>
    ) {
      const { group, key, value } = action.payload;
      const spec = state.specs.find((s) => s.group === group && s.key === key);
      if (!spec) return;
      spec.value = value;
    },

    // щоб одним махом залити specs (наприклад при edit product)
    setSpecs(state, action: PayloadAction<ProductSpecDraft[]>) {
      state.specs = action.payload;
    },

    hydrateForEdit(state, action) {
      state.productId = action.payload.productId; // ✅

      const categoryId = CATEGORY_TEMPLATES.find(
        (el) => el.title === action.payload.category
      )?.id;

      // state.selectedCategoryId = action.payload.categoryId;
      state.category = action.payload.category;
      state.selectedCategoryId = categoryId || "";

      state.title = action.payload.title;
      state.description = action.payload.description;
      state.anotherInfo = action.payload.anotherInfo ?? "";

      state.isActive = action.payload.isActive;
      state.isBestSeller = action.payload.isBestSeller;
      state.inStock = action.payload.inStock;

      state.images = action.payload.images;

      state.options = action.payload.options.map((o: any) => ({
        clientId: nanoid(),
        dbId: o.id ?? null, // ✅
        label: o.label,
        value: o.value ?? "",
        price: o.price,
        discount: o.discount ?? 0,
        unit: o.unit ?? "",
        isMain: o.isMain,
        inStock: o.inStock,
      }));

      state.specs = action.payload.specs.map((s: any) => ({
        clientId: nanoid(),
        dbId: s.id ?? null, // ✅
        group: s.group,
        key: s.key,
        value: s.value,
      }));
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

  updateSpecValue,
  updateSpecByKey,
  setSpecs,
  hydrateForEdit,
} = ProductSlice.actions;

export default ProductSlice.reducer;
