import { setIsOpenFirstCartMenu } from "@/redux/main/slices/uiSlice";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { PostalCodeCalculator } from "./PostalCode/PostalCodeCalculator";
import { RootState } from "@/redux/main/store";

export function CartPrice({ subTotal }: { subTotal: number }) {
  const dispatch = useDispatch();
  const { gstHst, shippingPrice } = useSelector(
    (store: RootState) => store.orderCartSlice,
  );
  const tax = subTotal * gstHst;
  return (
    <div className="">
      <PostalCodeCalculator />
      <div className="CartPopUp-wrapper-content-price">
        <h2>Your Order</h2>
        <div className="CartPopUp-wrapper-content-price-block">
          <div className="CartPopUp-wrapper-content-price-block-row">
            <p>Subtotal</p>
            <p>{subTotal.toFixed(2)}$</p>
          </div>
          <div className="CartPopUp-wrapper-content-price-block-row">
            <p>
              GST/HST{" "}
              {tax > 0 && (
                <span className="text-gray-500">({gstHst * 100}%)</span>
              )}
            </p>
            <p>{tax.toFixed(2)}$</p>
          </div>
          {/* <div className="CartPopUp-wrapper-content-price-block-row">
            <p>Shipping</p>
            <p>{shippingPrice.toFixed(2)}$</p>
          </div> */}
        </div>
        <div className="CartPopUp-wrapper-content-price-block-total">
          <div className="CartPopUp-wrapper-content-price-block-total-row">
            <p>Estimated total</p>
            <p style={{ color: "#FF5A00" }}>
              {(tax + subTotal).toFixed(2)}$
            </p>
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
    </div>
  );
}
