import { useWindowWidth } from "@/hooks/useWidth";
import { openAuthModal } from "@/redux/main/slices/uiSlice";
import { RootState } from "@/redux/main/store";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaRegBookmark } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Saved() {
  const width = useWindowWidth();
  const dispatch = useDispatch();
  const session = useSession();
  const { favoriteProducts } = useSelector((store: RootState) => store.uiSlice);

  if (session.status == "unauthenticated" || !session.data) {
    return (
      <div
        className="header-personal-data-column"
        onClick={() => {
          dispatch(openAuthModal());
          toast("Login to view your saved items");
        }}
      >
        <div className="header-personal-data-top-row">
          <FaRegBookmark />
          <h3>
            Saved{" "}
            {width !== 0 && width && width < 1100 && (
              <span className="header-personal-data-top-row-count">(0)</span>
            )}
          </h3>
        </div>
        <div className="header-personal-data-bottom-row">
          <p className="header-personal-data-bottom-row-text">(0) added</p>
        </div>
      </div>
    );
  }

  return (
    <Link href={"/saved"} className="header-personal-data-column">
      <div className="header-personal-data-top-row">
        <FaRegBookmark />
        <h3>
          Saved{" "}
          {width !== 0 && width && width < 1100 && (
            <span className="header-personal-data-top-row-count">
              {favoriteProducts.length > 0 ? (
                <span className="font-bold text-orange-500">
                  ({favoriteProducts.length})
                </span>
              ) : (
                <span>{"(0)"}</span>
              )}
            </span>
          )}
        </h3>
      </div>
      <div className="header-personal-data-bottom-row">
        <p className="header-personal-data-bottom-row-text">
          {favoriteProducts.length > 0 ? (
            <span className="font-bold text-orange-500">
              ({favoriteProducts.length})
            </span>
          ) : (
            <span>{"(0)"}</span>
          )}{" "}
          added
        </p>
      </div>
    </Link>
  );
}
