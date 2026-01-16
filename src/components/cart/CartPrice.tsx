import { setIsOpenFirstCartMenu } from "@/redux/main/slices/uiSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";

export function CartPrice({ total }: { total: number }) {
  const dispatch = useDispatch();
  return (
    <div className="CartPopUp-wrapper-content-price">
      <h2>Your Order</h2>
      {/* <div className="CartPopUp-wrapper-content-price-block">
        <div className="CartPopUp-wrapper-content-price-block-row">
          <p>Price</p>
          <p>{total.toFixed(2)}$</p>
        </div>
      </div> */}
      <div className="CartPopUp-wrapper-content-price-block-total">
        <div className="CartPopUp-wrapper-content-price-block-total-row">
          <p>SUBTOTAL</p>
          <p style={{ color: "#FF5A00" }}>{total.toFixed(2)}$</p>
        </div>
        <Link
          href={"/order"}
          onClick={() => {
            dispatch(setIsOpenFirstCartMenu(false));
          }}
          className="CartPopUp-wrapper-content-price-block-total-checkout"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
