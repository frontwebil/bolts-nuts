import { setIsOpenPopUpCart } from "@/redux/main/slices/uiSlice";
import { PiCaretLeftBold } from "react-icons/pi";
import { useDispatch } from "react-redux";

export function CartPopUp() {
  const dispatch = useDispatch();
  return (
    <div className="CartPopUp">
      <div className="CartPopUp-container">
        <div className="CartPopUp-wrapper">
          <div className="CartPopUp-top">
            <h2>Shopping Cart</h2>
            <div
              className="CartPopUp-top-continue"
              onClick={() => dispatch(setIsOpenPopUpCart(false))}
            >
              <PiCaretLeftBold />
              <p>Continue shopping</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
