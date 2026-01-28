/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDispatch, useSelector } from "react-redux";
import { useProducts } from "./fetchProducts";
import { useEffect } from "react";
import { setProducts } from "@/redux/main/slices/productSlice";
import { RootState } from "@/redux/main/store";
import axios from "axios";
import { setFavoriteProducts } from "@/redux/main/slices/uiSlice";
import { useSession } from "next-auth/react";
import { removeFromCart } from "@/redux/main/slices/orderCartSlice";

export function SetProductsToRedux() {
  const dispatch = useDispatch();
  const { data, isLoading } = useProducts();
  const session = useSession();
  const { orderProducts } = useSelector(
    (state: RootState) => state.orderCartSlice,
  );

  const getFavorites = async () => {
    const res = await axios.get("/api/user/favorites/get");
    const { favoriteProducts } = res.data;

    if (!favoriteProducts || favoriteProducts.length <= 0) return;

    dispatch(setFavoriteProducts(favoriteProducts));
  };

  const reduxProducts = useSelector(
    (state: RootState) => state.productSlice.products,
  );
  const { productsLoaded } = useSelector((s: RootState) => s.productSlice);

  useEffect(() => {
    if (!data || isLoading) return;

    orderProducts.forEach((item) => {
      const product = data.find((p: any) => p.id === item.productId);

      console.log(product); // для дебага

      // Если продукта нет или он неактивен — удаляем
      if (!product || !product.isActive) {
        dispatch(
          removeFromCart({
            productId: item.productId,
            variantId: item.variantId,
          }),
        );
        return;
      }

      // Проверяем вариант по variantId и inStock
      const variantExists = product.options.some(
        (v: any) => v.id === item.variantId && v.inStock,
      );

      if (!variantExists) {
        dispatch(
          removeFromCart({
            productId: item.productId,
            variantId: item.variantId,
          }),
        );
      }
    });
  }, [data, isLoading, dispatch, orderProducts]);

  useEffect(() => {
    if (session.status === "loading") return;
    if (session.status === "unauthenticated") return;
    getFavorites();
  }, [session.status]);

  useEffect(() => {
    if (!data || isLoading) return;
    if (productsLoaded) return;

    // не диспатчимо якщо нічого не змінилось
    if (reduxProducts.length === data.length) return;

    dispatch(setProducts(data));
  }, [data, isLoading, dispatch, reduxProducts.length, productsLoaded]);

  return null;
}
