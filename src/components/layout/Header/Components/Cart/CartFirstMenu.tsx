import { IoClose } from "react-icons/io5";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/main/store";
import { setIsOpenFirstCartMenu } from "@/redux/main/slices/uiSlice";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function CartFirstMenu() {
  const dispatch = useDispatch();
  const { isOpenFirstCartMenu } = useSelector(
    (store: RootState) => store.uiSlice
  );
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        dispatch(setIsOpenFirstCartMenu(false));
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const router = useRouter();
  return (
    <div className="CartFirstMenu" ref={ref}>
      <div className="menu">
        <div className="menu-top">
          <h2>Cart</h2>
          <div
            className="menu-top-close"
            onClick={() => {
              dispatch(setIsOpenFirstCartMenu(false));
            }}
          >
            <IoClose />
            <p>Close</p>
          </div>
        </div>
        <div className="menu-content-empty">
          <h3>Your cart is empty</h3>
          <p>
            Shop now and discover deals, new arrivals, and customers favorites
            waiting for you
          </p>
          <button
            className="menu-content-empty-button"
            onClick={() => {
              dispatch(setIsOpenFirstCartMenu(false));
              router.replace("/catalog");
            }}
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}
