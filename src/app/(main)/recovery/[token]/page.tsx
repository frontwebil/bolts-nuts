"use client";

import { useParams } from "next/navigation";
import "../style.css";
import { useState } from "react";

export default function RecoveryPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);

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
          <form className="AuthFormLayout-login-form">
            <label className="AuthFormLayout-login-label">
              Password
              <input
                type="password"
                placeholder="********"
                className="AuthFormLayout-login-input"
                required
              />
            </label>

            <button
              type="submit"
              className="AuthFormLayout-login-button"
              disabled={loading}
            >
              Change password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
