"use client";

import { useParams, useRouter } from "next/navigation";
import "../style.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function RecoveryPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [password, setPassword] = useState("");

  const handleCheckValidToken = async () => {
    const response = await axios.get(
      `/api/auth/reset/is-valid-token?token=${token}`
    );
    const { isValidToken } = response.data;
    return isValidToken;
  };

  useEffect(() => {
    if (!token) {
      console.log(
        "This password reset link is invalid or has expired. Please request a new one."
      );
      router.replace("/");
    }

    setLoading(true);

    const checkToken = async () => {
      try {
        setLoading(true);
        const response = await handleCheckValidToken();

        if (response === false) {
          toast(
            "This password reset link is invalid or has expired. Please request a new one."
          );
          router.replace("/");
        }
        console.log(response);
      } catch (error) {
        toast(
          "This password reset link is invalid or has expired. Please request a new one."
        );
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [token]);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    if (password.length < 8) {
      toast("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/auth/reset/confirm-reset-token", {
        password,
        token,
      });
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
    <div className="RecoveryPage">
      <div className="container">
        <div className="AuthFormContainer">
          <div className="AuthFormContainer-title">
            <h2>Set new password</h2>
            <h3>
              Please enter your new password below. Make sure it is strong and
              secure.
            </h3>
          </div>
          <form
            className="AuthFormLayout-login-form"
            onSubmit={handleResetPassword}
          >
            <label className="AuthFormLayout-login-label">
              Password
              <input
                type="text"
                placeholder="********"
                className="AuthFormLayout-login-input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button
              type="submit"
              className="AuthFormLayout-login-button"
              disabled={loading}
            >
              {loading ? "Wait..." : "Change password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
