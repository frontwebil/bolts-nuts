"use client";

import { closeAuthModal, setAuthOption } from "@/redux/main/slices/uiSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function RecoveryForm() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/reset/create-recovery-link", {
        email,
      });

      toast(res.data.message || "Reset link sent");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast(error.response?.data.error || "Something went wrong");
      } else {
        toast("Connection issue, please try again!");
      }
    } finally {
      setLoading(false);
      dispatch(closeAuthModal());
    }
  };
  return (
    <div className="AuthFormContainer">
      <div className="AuthFormContainer-title">
        <h2>Password Recovery</h2>
        <h3>
          Enter the email address associated with your account, and we will send
          you a link to reset your password.
        </h3>
      </div>
      <form
        className="AuthFormLayout-login-form"
        onSubmit={handleResetPassword}
      >
        <label className="AuthFormLayout-login-label">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="example@gmail.com"
            className="AuthFormLayout-login-input"
            required
          />
        </label>

        <button
          type="submit"
          className="AuthFormLayout-login-button"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      <div className="underpopup">
        Remember the password?{" "}
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
