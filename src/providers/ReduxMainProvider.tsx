"use client"; // обов'язково

import { Provider, useDispatch } from "react-redux";
import { ReactNode, useEffect } from "react";
import { store } from "@/redux/main/store";
import { initCart } from "@/redux/main/slices/orderCartSlice";

type Props = { children: ReactNode };

function HandleInitCart() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initCart());
  }, [dispatch]);
  return null;
}

export const ReduxProviderWrapper = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <HandleInitCart />
      {children}
    </Provider>
  );
};
