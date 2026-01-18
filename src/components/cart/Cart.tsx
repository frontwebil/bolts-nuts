/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { PiCaretLeftBold } from "react-icons/pi";
import { CartPrice } from "./CartPrice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/main/store";
import { CartItem } from "./CartItem/CartItem";
import { buildCartItemsDetailed } from "@/hooks/buildCartItems";

export function Cart() {
  const { orderProducts } = useSelector(
    (store: RootState) => store.orderCartSlice,
  );
  const { products } = useSelector((store: RootState) => store.productSlice);

  const cartItemsDetailed = buildCartItemsDetailed(products, orderProducts);

  const subTotal = cartItemsDetailed.reduce(
    (sum, item: any) => sum + item.total,
    0,
  );

  if (orderProducts && orderProducts.length <= 0) {
    return (
      <div
        className="menu absolute top-1/2 left-1/2"
        style={{
          transform: `translate(-50% ,-50%) `,
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <div className="menu-content-empty">
          <h3>Your cart is empty</h3>
          <p>
            Shop now and discover deals, new arrivals, and customers favorites
            waiting for you
          </p>
          <Link
            href={"/catalog"}
            className="menu-content-empty-button text-center"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="CartPopUp-wrapper">
      <div className="CartPopUp-top">
        <h2>Shopping Cart</h2>
        <Link href={"/catalog"} className="CartPopUp-top-continue">
          <PiCaretLeftBold />
          <p>Continue shopping</p>
        </Link>
      </div>
      <div className="CartPopUp-wrapper-content">
        <div className="CartPopUp-wrapper-content-products">
          <div className="CartPopUp-wrapper-content-products-top">
            <div className="CartPopUp-wrapper-content-products-column-first">
              Product
            </div>
            <div className="CartPopUp-wrapper-content-products-column-second">
              quantity
            </div>
            <div className="CartPopUp-wrapper-content-products-column-third">
              total
            </div>
          </div>
          <div className="CartPopUp-wrapper-content-products-content">
            {cartItemsDetailed.map((el, i) => (
              <CartItem el={el} key={i} />
            ))}
          </div>
        </div>
        <CartPrice subTotal={subTotal} />
      </div>
    </div>
  );
}
