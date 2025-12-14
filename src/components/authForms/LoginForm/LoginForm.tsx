"use client";

import { closeAuthModal, setAuthOption } from "@/redux/main/slices/uiSlice";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleCloseModal = () => {
    dispatch(closeAuthModal());
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    if (!data.email || !data.password) {
      toast("All fields are required");
      setLoading(false);
      return;
    }

    const res = await signIn("user-login", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      toast("Invalid email or password");
      setLoading(false);
      return;
    } else {
      toast.success("Login successful");
      setLoading(false);
      handleCloseModal();
      return;
    }
  };

  return (
    <div className="AuthFormContainer">
      <div className="AuthFormContainer-title">
        <h2>welcome back</h2>
        <h3>We are happy to see you around again!</h3>
      </div>
      <form className="AuthFormLayout-login-form" onSubmit={handleLogin}>
        <label className="AuthFormLayout-login-label">
          Email
          <input
            type="email"
            placeholder="example@gmail.com"
            className="AuthFormLayout-login-input"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            required
          />
        </label>

        <label className="AuthFormLayout-login-label">
          Password
          <div className="AuthFormLayout-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="AuthFormLayout-login-input"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
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
          {loading ? "Signin up" : "Sign up"}
        </span>
      </div>
    </div>
  );
}
