import { setAuthOption } from "@/redux/main/slices/uiSlice";
import { useDispatch } from "react-redux";

export default function RecoveryForm() {
  const dispatch = useDispatch();
  return (
    <div className="AuthFormContainer">
      <div className="AuthFormContainer-title">
        <h2>Password Recovery</h2>
        <h3>
          Enter the email address associated with your account, and we will send
          you a link to reset your password.
        </h3>
      </div>
      <form className="AuthFormLayout-login-form">
        <label className="AuthFormLayout-login-label">
          Email
          <input
            type="email"
            placeholder="example@gmail.com"
            className="AuthFormLayout-login-input"
            required
          />
        </label>

        <button type="submit" className="AuthFormLayout-login-button">
          Send Reset Link
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
