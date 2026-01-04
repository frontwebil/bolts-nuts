"use client";

import { useDispatch, useSelector } from "react-redux";
import { useProducts } from "./fetchProducts";
import { useEffect } from "react";
import { setProducts } from "@/redux/main/slices/productSlice";
import { RootState } from "@/redux/main/store";

export function SetProductsToRedux() {
  const dispatch = useDispatch();
  const { data, isLoading } = useProducts();

  const reduxProducts = useSelector(
    (state: RootState) => state.productSlice.products
  );
  const { productsLoaded } = useSelector((s: RootState) => s.productSlice);

  useEffect(() => {
    if (!data || isLoading) return;
    if (productsLoaded) return;

    // не диспатчимо якщо нічого не змінилось
    if (reduxProducts.length === data.length) return;

    dispatch(setProducts(data));
  }, [data, isLoading, dispatch, reduxProducts.length, productsLoaded]);

  return null;
}
