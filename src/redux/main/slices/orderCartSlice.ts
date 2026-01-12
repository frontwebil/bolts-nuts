import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

type CartState = {
  orderProducts: CartItem[];
};

const STORAGE_KEY = "cart";

const initialState: CartState = {
  orderProducts: [], // всегда пусто на старте (без window checks тут)
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
      }>
    ) {
      const { productId, variantId, quantity } = action.payload;

      if (!productId || !variantId) return;

      const qtyToAdd = quantity && quantity > 0 ? quantity : 1;

      const existing = state.orderProducts.find(
        (i) => i.productId === productId && i.variantId === variantId
      );

      if (existing) existing.quantity += qtyToAdd;
      else
        state.orderProducts.push({ productId, variantId, quantity: qtyToAdd });

      saveToLS(state);
    },

    increaseQty(
      state,
      action: PayloadAction<{ productId: string; variantId: string }>
    ) {
      const item = state.orderProducts.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.variantId === action.payload.variantId
      );
      if (!item) return;

      item.quantity += 1;
      saveToLS(state);
    },

    decreaseQty(
      state,
      action: PayloadAction<{ productId: string; variantId: string }>
    ) {
      const item = state.orderProducts.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.variantId === action.payload.variantId
      );
      if (!item) return;

      item.quantity -= 1;

      if (item.quantity <= 0) {
        state.orderProducts = state.orderProducts.filter(
          (i) =>
            !(i.productId === item.productId && i.variantId === item.variantId)
        );
      }

      saveToLS(state);
    },

    removeFromCart(
      state,
      action: PayloadAction<{ productId: string; variantId: string }>
    ) {
      state.orderProducts = state.orderProducts.filter(
        (i) =>
          !(
            i.productId === action.payload.productId &&
            i.variantId === action.payload.variantId
          )
      );
      saveToLS(state);
    },

    clearCart(state) {
      state.orderProducts = [];
      if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
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
} = orderCartSlice.actions;

export default orderCartSlice.reducer;
