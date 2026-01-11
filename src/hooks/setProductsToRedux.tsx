"use client";

import { useDispatch, useSelector } from "react-redux";
import { useProducts } from "./fetchProducts";
import { useEffect } from "react";
import { setProducts } from "@/redux/main/slices/productSlice";
import { RootState } from "@/redux/main/store";
import axios from "axios";
import { setFavoriteProducts } from "@/redux/main/slices/uiSlice";
import { useSession } from "next-auth/react";

export function SetProductsToRedux() {
  const dispatch = useDispatch();
  const { data, isLoading } = useProducts();
  const session = useSession();

  const getFavorites = async () => {
    const res = await axios.get("/api/user/favorites/get");
    const { favoriteProducts } = res.data;

    if (!favoriteProducts || favoriteProducts.length <= 0) return;

    dispatch(setFavoriteProducts(favoriteProducts));
  };

  const reduxProducts = useSelector(
    (state: RootState) => state.productSlice.products
  );
  const { productsLoaded } = useSelector((s: RootState) => s.productSlice);

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
