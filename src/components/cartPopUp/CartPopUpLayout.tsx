"use client";

import "./style.css";
import { CartPopUp } from "./CartPopUp";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/main/store";
import { setIsOpenPopUpCart } from "@/redux/main/slices/uiSlice";

export function CartPopUpLayout() {
  const dispatch = useDispatch();
  const { isOpenPopUpCart } = useSelector((store: RootState) => store.uiSlice);
  return (
    <>
      {isOpenPopUpCart && (
        <>
          <CartPopUp />
          <div
            className="opacity-background"
            onClick={() => dispatch(setIsOpenPopUpCart(false))}
          ></div>
        </>
      )}
    </>
  );
}
