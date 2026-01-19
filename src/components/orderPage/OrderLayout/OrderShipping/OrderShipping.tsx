import { PiPencilSimpleLine } from "react-icons/pi";
import "./style.css";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/main/store";
import Link from "next/link";

export function OrderShipping() {
  const { userData, shippingAddress, gstHst, shippingPrice, stateCode } =
    useSelector((store: RootState) => store.orderCartSlice);

  return (
    <div className="OrderShipping">
      <div className="Account-section-top">
        <h2>general information</h2>
        <div className="Account-section-top-line"></div>
        <Link href={"/order"} className="Account-section-top-manage">
          <PiPencilSimpleLine />
          <p>Manage</p>
        </Link>
      </div>
      <div className="Account-section-general-info">
        <div className="Account-section-general-info-row">
          <p>Email</p>
          <h3>{userData.email}</h3>
        </div>
        <div className="Account-section-general-info-row">
          <p>Phone</p>
          <h3>{userData.phoneNumber}</h3>
        </div>
        <div className="Account-section-general-info-row">
          <p>Shipping Address</p>
          <h3>{`${shippingAddress.address}, ${shippingAddress.city} , ${shippingAddress.province} , ${shippingAddress.postalCode}`}</h3>
        </div>
      </div>
      <div className="OrderLayout-margin-zatychka"></div>

      <div className="Account-section-top">
        <h2>shipping method</h2>
        <div className="Account-section-top-line"></div>
      </div>
    </div>
  );
}
