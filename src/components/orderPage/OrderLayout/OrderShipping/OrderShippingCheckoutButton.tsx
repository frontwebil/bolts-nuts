import { buildCartItemsDetailed } from "@/hooks/buildCartItems";
import { RootState } from "@/redux/main/store";
import { useState } from "react";
import { useSelector } from "react-redux";

export function OrderShippingCheckoutButton() {
  const {
    orderProducts,
    shippingPrice,
    gstHst,
    shippingAddress,
    shippingName,
    userData,
    stateCode,
  } = useSelector((store: RootState) => store.orderCartSlice);
  const { products } = useSelector((store: RootState) => store.productSlice);
  const [loading, setLoading] = useState(false);

  const cartItemsDetailed = buildCartItemsDetailed(products, orderProducts);
  console.log(cartItemsDetailed);
  const subTotal = cartItemsDetailed.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sum, item: any) => sum + item.total,
    0,
  );

  const handleCheckout = async () => {
    const validateForm = () => {
      if (!userData?.email) return true;
      if (!userData?.name) return true;
      if (!userData?.surname) return true;
      if (!userData?.phoneNumber) return true;

      if (!shippingAddress?.postalCode) return true;
      if (!shippingAddress?.city) return true;
      if (!shippingAddress?.province) return true;
      if (!shippingAddress?.address) return true;

      if (gstHst === 0) return true;
      if (shippingPrice === 0) return true;
      if (stateCode === "") return true;

      return false;
    };
    if (loading || validateForm()) return;

    setLoading(true);

    const tax = subTotal * gstHst;

    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cartItemsDetailed,
        shippingPrice: shippingPrice,
        shippingName: shippingName,
        gstHst: tax,
        shippingAddress: shippingAddress,
        userData: userData,
        subTotal: subTotal,
      }),
    });

    const { url } = await res.json();
    window.location.href = url;

    setLoading(false);
  };

  return (
    <button
      className="OrderLayout-button-next"
      disabled={loading}
      onClick={() => handleCheckout()}
    >
      Pay Now
    </button>
  );
}
