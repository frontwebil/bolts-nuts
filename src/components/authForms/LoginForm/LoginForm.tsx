"use client";

import { setAuthOption } from "@/redux/main/slices/uiSlice";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch } from "react-redux";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className="AuthFormContainer">
      <div className="AuthFormContainer-title">
        <h2>welcome back</h2>
        <h3>We are happy to see you around again!</h3>
      </div>
      <form className="AuthFormLayout-login-form">
        <label className="AuthFormLayout-login-label">
          Email
          <input
            type="email"
            placeholder="example@gmail.com"
            className="AuthFormLayout-login-input"
          />
        </label>

        <label className="AuthFormLayout-login-label">
          Password
          <div className="AuthFormLayout-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="AuthFormLayout-login-input"
            />
            <button
              type="button"
              className="AuthFormLayout-password-toggle"
              onClick={() => setShowPassword((p) => !p)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </label>

        <div className="AuthFormLayout-login-options">
          <label className="AuthFormLayout-remember-me">
            <input type="checkbox" />
            Remember me
          </label>

          <button type="button" className="AuthFormLayout-forgot-password">
            Forgot password?
          </button>
        </div>

        <button type="submit" className="AuthFormLayout-login-button">
          Sign In
        </button>
      </form>
      <div className="underpopup">
        Don`t have an account?{" "}
        <span
          onClick={() => {
            dispatch(setAuthOption("register"));
          }}
        >
          Sign up
        </span>
      </div>
    </div>
  );
}
