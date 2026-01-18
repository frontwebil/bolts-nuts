"use client";

import "./style.css";
import { buildCartItemsDetailed } from "@/hooks/buildCartItems";
import { RootState } from "@/redux/main/store";
import Image from "next/image";
import { useSelector } from "react-redux";

export function OrderTotal() {
  const { orderProducts } = useSelector(
    (store: RootState) => store.orderCartSlice,
  );
  const { products } = useSelector((store: RootState) => store.productSlice);

  const cartItemsDetailed = buildCartItemsDetailed(products, orderProducts);

  const subTotal = cartItemsDetailed.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sum, item: any) => sum + item.total,
    0,
  );

  const { gstHst, shippingPrice } = useSelector(
    (store: RootState) => store.orderCartSlice,
  );
  const tax = subTotal * gstHst;

  return (
    <div className="order-payment-total">
      <div className="order-payment-total-container">
        <div className="order-payment-total-products">
          {cartItemsDetailed.map((el, i) => (
            <div className="order-payment-total-product" key={i}>
              <div className="order-payment-total-product-img">
                <div className="order-payment-total-product-quantity">
                  {el.quantity}
                </div>
                <Image
                  src={el.product.images[0]}
                  alt={el.product.title}
                  width={100}
                  height={100}
                />
              </div>
              <h3 className="order-payment-total-product-title">
                {el.product.title}
              </h3>
              <h3 className="order-payment-total-product-price">
                ${el.quantity * el.price}
              </h3>
            </div>
          ))}
        </div>
        <div className="order-payment-total-sums">
          <div className="order-payment-total-sums-row">
            <p>Price</p>
            <p className="font-semibold">${subTotal.toFixed(2)}</p>
          </div>
          <div className="order-payment-total-sums-row">
            <p>GST/HST</p>
            <p className="font-semibold">${tax.toFixed(2)}</p>
          </div>
          <div className="order-payment-total-sums-row">
            <p>Shipping</p>
            <p className="font-semibold">${shippingPrice.toFixed(2)}</p>
          </div>
        </div>
        <div className="order-payment-total-price">
          <p>TOTAL</p>
          <p style={{ color: "#FF5A00" }}>${subTotal + tax + shippingPrice}</p>
        </div>
      </div>
      <div className="order-payment-total-bg-right"></div>
    </div>
  );
}
