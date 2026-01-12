import { useWindowWidth } from "@/hooks/useWidth";
import { setIsOpenFirstCartMenu } from "@/redux/main/slices/uiSlice";
import { RootState } from "@/redux/main/store";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";

export function Cart() {
  const width = useWindowWidth();
  const dispatch = useDispatch();
  const { isOpenFirstCartMenu } = useSelector(
    (store: RootState) => store.uiSlice
  );
  return (
    <div
      className="header-personal-data-column"
      onClick={() => dispatch(setIsOpenFirstCartMenu(!isOpenFirstCartMenu))}
    >
      <div className="header-personal-data-top-row">
        <PiShoppingCartSimpleBold />
        <h3>
          Cart{" "}
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
