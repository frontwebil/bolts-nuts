import { buildCartItemsDetailed } from "@/hooks/buildCartItems";
import { RootState } from "@/redux/main/store";
import { useSelector } from "react-redux";

export function OrderShippingCheckoutButton() {
  const { orderProducts, shippingPrice, gstHst  , shippingAddress , userData } = useSelector(
    (store: RootState) => store.orderCartSlice,
  );
  const { products } = useSelector((store: RootState) => store.productSlice);

  const cartItemsDetailed = buildCartItemsDetailed(products, orderProducts);
  console.log(cartItemsDetailed);
  const subTotal = cartItemsDetailed.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sum, item: any) => sum + item.total,
    0,
  );


  const handleCheckout = async () => {
    const tax = subTotal * gstHst;

    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cartItemsDetailed,
        shippingPrice: shippingPrice,
        gstHst: tax,
        shippingAddress: shippingAddress,
        userData:userData,
        subTotal: subTotal
      }),
    });

    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <button
      className="OrderLayout-button-next"
      onClick={() => handleCheckout()}
    >
      Pay Now
    </button>
  );
}
