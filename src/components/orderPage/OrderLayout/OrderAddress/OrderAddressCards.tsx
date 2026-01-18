import { setShippingAdress } from "@/redux/main/slices/orderCartSlice";
import { RootState } from "@/redux/main/store";
import { useDispatch, useSelector } from "react-redux";

export function OrderAddressCards() {
  const { avaliableAddresses, shippingAddress } = useSelector(
    (store: RootState) => store.orderCartSlice,
  );
  const dispatch = useDispatch();
  return (
    <div className="OrderAddress-adresses-cards">
      {avaliableAddresses.map((address, i) => {
        const isActive =
          address.address == shippingAddress.address &&
          address.postalCode == shippingAddress.postalCode;

        return (
          <div
            className={`Adressess-card ${isActive && "active"}`}
            key={i}
            onClick={() => {
              dispatch(
                setShippingAdress({
                  postalCode: address.postalCode ?? "",
                  city: address.city ?? "",
                  province: address.province ?? "",
                  address: address.address ?? "",
                  company: address.company ?? "",
                  apartment: address.apartment ?? "",
                }),
              );
            }}
          >
            <div className="Adressess-card-top">
              <div className="Adressess-card-top-text">{`Adress ${i + 1}`}</div>
              <div className="Adressess-card-top-adressline">{`${address.address}, ${address.city} , ${address.province} , ${address.postalCode}`}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
