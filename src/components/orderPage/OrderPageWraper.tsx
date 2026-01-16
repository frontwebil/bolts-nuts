import "./style.css";
import Image from "next/image";
import { Breadcrums } from "../breadcrums/Breadcrums";
import { OrderLayout } from "./OrderLayout/OrderLayout";

export function OrderPageWrapper() {
  return (
    <div className="container">
      <div className="logo-order-page">
        <Image src={"/logo.PNG"} alt="logo-order" width={270} height={70} />
      </div>
      <Breadcrums
        links={[
          { title: "Home", href: "/catalog" },
          {
            title: "Cart",
            href: "/cart",
          },
          { title: "Order" },
        ]}
      />
      <div className="OrderPage-container">
        <OrderLayout />
        <div className="order-payment-total">
          <div className="order-payment-total-container"></div>
          <div className="order-payment-total-bg-right"></div>
        </div>
      </div>
    </div>
  );
}
