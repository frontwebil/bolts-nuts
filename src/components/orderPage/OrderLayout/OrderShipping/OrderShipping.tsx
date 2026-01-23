/* eslint-disable @typescript-eslint/no-explicit-any */
import { PiCaretLeftBold, PiPencilSimpleLine } from "react-icons/pi";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/main/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getEasyshipRates } from "@/lib/easyships/getEasyshipRates";
import { FullScreenLoader } from "@/components/loader/FullScreenLoader";
import { FaCheck } from "react-icons/fa";
import { setLocation } from "@/redux/main/slices/orderCartSlice";
import { OrderShippingCheckoutButton } from "./OrderShippingCheckoutButton";

export function OrderShipping() {
  const {
    userData,
    shippingAddress,
    gstHst,
    shippingPrice,
    stateCode,
    stateName,
    shippingId,
  } = useSelector((store: RootState) => store.orderCartSlice);
  const router = useRouter();
  const [rates, setRates] = useState<any[]>([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!shippingAddress?.postalCode) return;

    const fetchRates = async () => {
      setLoadingRates(true);
      try {
        const res = await getEasyshipRates(shippingAddress.postalCode);
        setRates(res);
      } catch (e) {
        console.error("Easyship error", e);
      } finally {
        setLoadingRates(false);
      }
    };

    fetchRates();
  }, [shippingAddress?.postalCode]);

  useEffect(() => {
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

    if (validateForm()) {
      router.replace("/order");
    }
  }, [userData, shippingAddress, router]);

  return (
    <div className="OrderShipping">
      {loadingRates && <FullScreenLoader />}
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
          <h3>{`${shippingAddress.address}, ${shippingAddress.city} , ${shippingAddress.province} , ${shippingAddress.postalCode} ${shippingAddress.company}  ${shippingAddress.apartment ?? ""}`}</h3>
        </div>
      </div>
      <div className="OrderLayout-margin-zatychka"></div>

      <div className="Account-section-top">
        <h2>shipping method</h2>
        <div className="Account-section-top-line"></div>
      </div>
      <div className="OrderLayout-shipping-companies">
        {rates.map((el, i) => (
          <div
            className={`OrderLayout-shipping-companie-card ${shippingId == el.courier_service.id && "active"}`}
            key={i}
            onClick={() =>
              dispatch(
                setLocation({
          shippingName: el.courier_service.name,
                  shippingId: el.courier_service.id,
                  stateCode: stateCode,
                  stateName: stateName,
                  shippingPrice: el.total_charge,
                }),
              )
            }
          >
            <div className="OrderLayout-shipping-companie-card-top ">
              <h2>{el.courier_service.name}</h2>
              <div className="">
                <p>${el.total_charge}</p>
                <div
                  className={`OrderLayout-shipping-companie-custom-checkbox ${shippingId == el.courier_service.id && "active"}`}
                >
                  <FaCheck />
                </div>
              </div>
            </div>
            <div className="OrderLayout-shipping-companie-card-description">
              {el.full_description}
            </div>
          </div>
        ))}
      </div>
      <div className="OrderLayout-buttons">
        <Link href={"/order"} className="OrderLayout-button-back-to-cart">
          <PiCaretLeftBold />
          <p>Back to Information</p>
        </Link>
        <OrderShippingCheckoutButton />
      </div>
    </div>
  );
}
