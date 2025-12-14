"use client";

import { closeAuthModal, setAuthOption } from "@/redux/main/slices/uiSlice";
import axios from "axios";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

type RegisterData = {
  name: string;
  surname: string;
  email: string;
  password: string;
};

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RegisterData>({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/register", data);

      toast.success("Account created successfully!");

      console.log(response);

      setData({
        name: "",
        surname: "",
        email: "",
        password: "",
      });

      dispatch(closeAuthModal());
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast(error.response?.data.error || "Something went wrong");
      } else {
        toast("Connection issue, please try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AuthFormContainer">
      <div className="AuthFormContainer-title">
        <h2>new here?</h2>
        <h3>Create your account and shop freely!</h3>
      </div>
      <form className="AuthFormLayout-login-form" onSubmit={handleRegister}>
        <div className="AuthFormLayout-login-form-name-wrapper">
          <label className="AuthFormLayout-login-label">
            First name
            <input
              type="text"
              placeholder="John"
              className="AuthFormLayout-login-input"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
            />
          </label>
          <label className="AuthFormLayout-login-label">
            Last name
            <input
              type="text"
              placeholder="Doe"
              className="AuthFormLayout-login-input"
              value={data.surname}
              onChange={(e) => setData({ ...data, surname: e.target.value })}
              required
            />
          </label>
        </div>

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
        </div>

        <button
          type="submit"
          className="AuthFormLayout-login-button"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <div className="underpopup">
        Already have an account?{" "}
        <span
          onClick={() => {
            dispatch(setAuthOption("login"));
          }}
        >
          Login
        </span>
      </div>
    </div>
  );
}
