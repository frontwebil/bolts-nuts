import {
  closeBurger,
  openAuthModal,
  setAuthOption,
} from "@/redux/main/slices/uiSlice";
import { PiUserCircle } from "react-icons/pi";
import { useDispatch } from "react-redux";

export function PersonalAccount() {
  const dispatch = useDispatch();

  return (
    <div className="header-personalAccount-data-column">
      <div
        className="header-personal-data-top-row"
        onClick={() => {
          dispatch(setAuthOption("login"));
          dispatch(openAuthModal());
          dispatch(closeBurger());
        }}
      >
        <PiUserCircle />
        <h3>
          <span className="personal-acc-hidden-laptop">Personal</span> Account
        </h3>
      </div>
      <div className="header-personal-data-bottom-row">
        <p
          className="header-personal-data-bottom-row-text"
          onClick={() => {
            dispatch(setAuthOption("login"));
            dispatch(openAuthModal());
            dispatch(closeBurger());
          }}
        >
          Login
        </p>
        <p>/</p>
        <p
          className="header-personal-data-bottom-row-text"
          onClick={() => {
            dispatch(setAuthOption("register"));
            dispatch(openAuthModal());
            dispatch(closeBurger());
          }}
        >
          Sign-up
        </p>
      </div>
    </div>
  );
}
