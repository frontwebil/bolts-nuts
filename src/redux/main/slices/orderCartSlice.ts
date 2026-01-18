import { CANADA_TAX_RATES } from "@/generalConfigs/CANADA_TAX_RATES";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type userDataType = {
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
};

export type AddressState = {
  postalCode: string;
  city: string;
  province: string;
  address: string;
  company?: string;
  apartment?: string;
};

type CartState = {
  orderProducts: CartItem[];
  stateName: string;
  stateCode: string;
  gstHst: number;
  shippingPrice: number;
  userData: userDataType;
  shippingAddress: AddressState;
};

const STORAGE_KEY = "cart";

const initialState: CartState = {
  orderProducts: [], // всегда пусто на старте (без window checks тут)
  stateName: "",
  stateCode: "",
  gstHst: 0,
  shippingPrice: 0,
  userData: {
    name: "",
    surname: "",
    phoneNumber: "",
    email: "",
  },
  shippingAddress: {
    postalCode: "",
    city: "",
    province: "",
    address: "",
    company: "",
    apartment: "",
  },
};

const saveToLS = (state: CartState) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.orderProducts));
};

export const orderCartSlice = createSlice({
  name: "orderCart",
  initialState,
  reducers: {
    // ВАЖНО: вызывать один раз на клиенте после старта приложения
    initCart(state) {
      if (typeof window === "undefined") return;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        state.orderProducts = Array.isArray(parsed) ? parsed : [];
      } catch {
        state.orderProducts = [];
      }
    },

    addToCart(
      state,
      action: PayloadAction<{
        productId?: string;
        variantId?: string;
        quantity?: number;
      }>,
    ) {
      const { productId, variantId, quantity } = action.payload;

      if (!productId || !variantId) return;

      const qtyToAdd = quantity && quantity > 0 ? quantity : 1;

      const existing = state.orderProducts.find(
        (i) => i.productId === productId && i.variantId === variantId,
      );

      if (existing) existing.quantity += qtyToAdd;
      else
        state.orderProducts.push({ productId, variantId, quantity: qtyToAdd });

      saveToLS(state);
    },

    increaseQty(
      state,
      action: PayloadAction<{ productId: string; variantId: string }>,
    ) {
      const item = state.orderProducts.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.variantId === action.payload.variantId,
      );
      if (!item) return;

      item.quantity += 1;
      saveToLS(state);
    },

    decreaseQty(
      state,
      action: PayloadAction<{ productId: string; variantId: string }>,
    ) {
      const item = state.orderProducts.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.variantId === action.payload.variantId,
      );
      if (!item) return;

      item.quantity -= 1;

      if (item.quantity <= 0) {
        state.orderProducts = state.orderProducts.filter(
          (i) =>
            !(i.productId === item.productId && i.variantId === item.variantId),
        );
      }

      saveToLS(state);
    },

    removeFromCart(
      state,
      action: PayloadAction<{ productId: string; variantId: string }>,
    ) {
      state.orderProducts = state.orderProducts.filter(
        (i) =>
          !(
            i.productId === action.payload.productId &&
            i.variantId === action.payload.variantId
          ),
      );
      saveToLS(state);
    },

    clearCart(state) {
      state.orderProducts = [];
      if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
    },

    setLocation(state, action) {
      const { stateCode, stateName, shippingPrice } = action.payload;
      state.stateCode = stateCode;
      state.stateName = stateName;
      state.shippingPrice = shippingPrice;
      if (!state.stateCode || !state.stateName) {
        state.stateCode = "";
        state.stateName = "";
        state.shippingPrice = 0;
        state.gstHst = 0;
      } else {
        state.gstHst = CANADA_TAX_RATES[state.stateCode];
      }
    },

    setUserData(state, action: PayloadAction<userDataType>) {
      state.userData = action.payload;
    },
    setShippingAdress(state, action: PayloadAction<AddressState>) {
      state.shippingAddress = action.payload;
    },
  },
});

export const {
  initCart,
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
  setLocation,
  setUserData,
  setShippingAdress,
} = orderCartSlice.actions;

export default orderCartSlice.reducer;
