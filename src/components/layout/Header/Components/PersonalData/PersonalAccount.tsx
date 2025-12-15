import {
  closeBurger,
  openAuthModal,
  setAuthOption,
} from "@/redux/main/slices/uiSlice";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PiUserCircle } from "react-icons/pi";
import { useDispatch } from "react-redux";

export function PersonalAccount() {
  const dispatch = useDispatch();
  const { data, status } = useSession();
  const router = useRouter();

  return (
    <div className="header-personalAccount-data-column">
      <div
        className="header-personal-data-top-row"
        onClick={() => {
          if (status === "authenticated") {
            router.replace("/account");
            return;
          }
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
      {status && status == "unauthenticated" ? (
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
      ) : (
        <p className="header-personal-data-bottom-row-text loginned header-personal-data-bottom-row-text-mobile-hidden">
          {data?.user?.name} {data?.user?.surname}
        </p>
      )}
    </div>
  );
}
