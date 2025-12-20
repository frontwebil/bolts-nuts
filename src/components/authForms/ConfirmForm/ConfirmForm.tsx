import { setAuthOption } from "@/redux/main/slices/uiSlice";
import { RootState } from "@/redux/main/store";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function ConfirmForm() {
  const { confirmEmail } = useSelector((store: RootState) => store.uiSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    if (confirmEmail.length < 1) {
      dispatch(setAuthOption("login"));
    }
  }, [confirmEmail, dispatch]);

  return (
    <div className="AuthFormContainer">
      <div className="AuthFormContainer-title">
        <h2>Confirm your email</h2>
        <h3>
          We sent a confirmation link to
          <span style={{ color: "#ff5a00", fontWeight: 600 }}>
            {" "}
            {confirmEmail}
          </span>
          . Please check your inbox and click the button in the email to
          activate your account.
        </h3>
      </div>

      <form className="AuthFormLayout-login-form">
        <Link
          href="https://mail.google.com/"
          className="AuthFormLayout-login-button text-center"
        >
          Open email
        </Link>
      </form>
    </div>
  );
}
