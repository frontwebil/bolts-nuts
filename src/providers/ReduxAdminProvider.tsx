"use client"; // обов'язково

import { Provider } from "react-redux";
import { ReactNode } from "react";
import { store } from "@/redux/admin/store";

type Props = { children: ReactNode };

export const ReduxProviderWrapper = ({ children }: Props) => {
  return <Provider store={store}>{children}</Provider>;
};
