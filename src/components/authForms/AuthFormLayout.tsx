"use client";

import { closeAuthModal, closeBurger } from "@/redux/main/slices/uiSlice";
import { RootState } from "@/redux/main/store";
import { useDispatch, useSelector } from "react-redux";
import "../authForms/AuthFormLayout.css";
import { IoMdClose } from "react-icons/io";
import { LoginForm } from "./LoginForm/LoginForm";
import { RegisterForm } from "./RegisterForm/RegisterForm";
import { useEffect } from "react";
import RecoveryForm from "./RecoveryForm/RecoveryForm";

export function AuthFormLayout() {
  const dispatch = useDispatch();
  const { isOpenAuthModal, authFormOption } = useSelector(
    (store: RootState) => store.uiSlice
  );

  useEffect(() => {}, []);

  return (
    <>
      {isOpenAuthModal && (
        <>
          <div className="AuthFormLayout">
            <div className="AuthFormWrapper">
              {authFormOption == "login" && <LoginForm />}
              {authFormOption == "register" && <RegisterForm />}
              {authFormOption == "recovery" && <RecoveryForm />}
              <div
                className="AuthFormWrapper-close"
                onClick={() => {
                  dispatch(closeAuthModal());
                }}
              >
                <IoMdClose />
              </div>
            </div>
          </div>
          <div
            className="opacity-background"
            onClick={() => {
              dispatch(closeAuthModal());
              dispatch(closeBurger());
            }}
          ></div>
        </>
      )}
    </>
  );
}
