"use client";

import Link from "next/link";
import "../[token]/style.css";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function VerifyEmailPage() {
  const { token } = useParams();

  const [status, setStatus] = useState<"checking" | "success" | "failed">(
    "checking"
  );

  useEffect(() => {
    const isValidToken = async () => {
      try {
        const res = await axios.post("/api/auth/verify-email", { token });

        if (res.data?.isValidToken) {
          setStatus("success");
          toast.success("Email Confirmed");

          // redirect after 5s
          setTimeout(() => {
            window.location.href = "/account";
          }, 5000);
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    };

    isValidToken();
  }, [token]);

  return (
    <div className="VerifyEmailPage">
      <div className="container">
        <div className="AuthFormContainer">
          <div className="AuthFormContainer-title">
            {status === "checking" && (
              <>
                <h2>Confirming your email...</h2>
                <h3>Please wait while we verify your email address.</h3>
              </>
            )}

            {status === "success" && (
              <>
                <h2>Email Confirmed 🎉</h2>
                <h3>
                  Your email has been successfully confirmed. You will be
                  redirected to your account in 5 seconds.
                </h3>
              </>
            )}

            {status === "failed" && (
              <>
                <h2>Verification Failed ❌</h2>
                <h3>This verification link is invalid or expired.</h3>
              </>
            )}
          </div>

          {status === "success" && (
            <div className="AuthFormLayout-login-form">
              <Link
                href={"/account"}
                className="AuthFormLayout-login-button text-center"
              >
                Go to Account
              </Link>
            </div>
          )}

          {status === "failed" && (
            <div className="AuthFormLayout-login-form">
              <Link
                href={"/"}
                className="AuthFormLayout-login-button text-center"
              >
                Go Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
