import { useWindowWidth } from "@/hooks/useWidth";
import {
  closeAuthModal,
  closeBurger,
  setIsOpenFirstCartMenu,
  setIsOpenPopUpCart,
} from "@/redux/main/slices/uiSlice";
import { RootState } from "@/redux/main/store";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";

export function Cart() {
  const width = useWindowWidth();
  const dispatch = useDispatch();
  const { isOpenFirstCartMenu } = useSelector(
    (store: RootState) => store.uiSlice
  );

  const { orderProducts } = useSelector(
    (store: RootState) => store.orderCartSlice
  );

  const handleOpenCart = () => {
    dispatch(closeBurger());
    dispatch(closeAuthModal());

    if (isOpenFirstCartMenu) {
      dispatch(setIsOpenFirstCartMenu(false));
    } else {
      dispatch(setIsOpenFirstCartMenu(true));
    }

    dispatch(setIsOpenPopUpCart(false));
  };

  return (
    <div
      className="header-personal-data-column"
      onClick={() => handleOpenCart()}
    >
      <div className="header-personal-data-top-row">
        <PiShoppingCartSimpleBold />
        <h3>
          Cart{" "}
          {width !== 0 && width && width < 1100 && (
            <span className="header-personal-data-top-row-count">
              {" "}
              {orderProducts.length > 0 ? (
                <span className="font-bold text-orange-500">
                  {`(${orderProducts.length})`}
                </span>
              ) : (
                "(0)"
              )}
            </span>
          )}
        </h3>
      </div>
      <div className="header-personal-data-bottom-row">
        <p className="header-personal-data-bottom-row-text">
          {orderProducts.length > 0 ? (
            <span className="font-bold text-orange-500">
              {`(${orderProducts.length})`}
            </span>
          ) : (
            "(0)"
          )}{" "}
          added
        </p>
      </div>
    </div>
  );
}
