import { getEasyshipRates } from "@/lib/easyships/getEasyshipRates";
import {
  setLocation,
  setShippingAdress,
  setUserData,
} from "@/redux/main/slices/orderCartSlice";
import { RootState } from "@/redux/main/store";
import axios from "axios";
import { useState } from "react";
import { PiCaretLeftBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";

export function OrderAddress() {
  const { userData, shippingAddress } = useSelector(
    (store: RootState) => store.orderCartSlice,
  );
  const [postalError, setPostalError] = useState("");
  const dispatch = useDispatch();

  const handleChangePostalCode = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const raw = e.target.value.toUpperCase();

    // Зберігаємо те, що вводить користувач
    dispatch(
      setShippingAdress({
        ...shippingAddress,
        postalCode: raw,
        city: "",
        province: "",
      }),
    );

    // Чистий код — тільки для логіки
    const clean = raw.replace(/\s/g, "");

    if (clean.length !== 6) return;

    if (!/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(clean)) {
      setPostalError("Invalid Canadian postal code");
      return;
    }

    try {
      const fsa = clean.slice(0, 3);
      const res = await axios.get(`https://api.zippopotam.us/CA/${fsa}`);

      const place = res.data?.places?.[0];
      console.log(place);
      if (!place) {
        setPostalError("Postal code not found");
        return;
      }

      setPostalError("");

      dispatch(
        setShippingAdress({
          ...shippingAddress,
          postalCode: raw,
          city: place["place name"] ?? "",
          province: place.state ?? "",
        }),
      );
      const shipping = await getEasyshipRates(raw);

      dispatch(
        setLocation({
          stateCode: place["state abbreviation"],
          stateName: place.state,
          shippingPrice: shipping[0].total_charge,
        }),
      );
    } catch {
      setPostalError("Postal service unavailable");
    }
  };

  return (
    <div className="OrderAddress">
      <div className="Order-layout-top">
        <h2>Contact information</h2>
        <div className="Order-layout-top-line"></div>
      </div>
      <div className="Account-section-content">
        <div className="input-wrapper">
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={userData?.email ?? ""}
              onChange={(e) =>
                dispatch(setUserData({ ...userData, email: e.target.value }))
              }
            />
          </div>
          <div className="input-wrapper-group">
            <div className="form-field">
              <label>First name</label>
              <input
                type="text"
                placeholder="John"
                value={userData?.name ?? ""}
                onChange={(e) =>
                  dispatch(setUserData({ ...userData, name: e.target.value }))
                }
              />
            </div>

            <div className="form-field">
              <label>Last name</label>
              <input
                type="text"
                placeholder="Johnson"
                value={userData?.surname ?? ""}
                onChange={(e) =>
                  dispatch(
                    setUserData({ ...userData, surname: e.target.value }),
                  )
                }
              />
            </div>
          </div>
          <div className="form-field">
            <label>Phone Number</label>
            <input
              type="text"
              placeholder="+1 (416) 555-1234"
              value={userData?.phoneNumber ?? ""}
              onChange={(e) =>
                dispatch(
                  setUserData({ ...userData, phoneNumber: e.target.value }),
                )
              }
            />
          </div>
        </div>
      </div>
      <div className="OrderLayout-margin-zatychka"></div>
      <div className="Order-layout-top">
        <h2>Shipping address</h2>
        <div className="Order-layout-top-line"></div>
      </div>
      <div className="OrderLayout-margin-zatychka"></div>
      <form>
        <div className="input-wrapper">
          <div className="form-field">
            <label>Country/region</label>
            <input type="text" placeholder="Canada" required readOnly />
          </div>

          <div className="input-wrapper-group">
            <div className="form-field">
              <label>Postal code</label>
              <input
                type="text"
                placeholder="M4B1B3"
                maxLength={6}
                value={shippingAddress.postalCode ?? ""}
                onChange={handleChangePostalCode}
                required
              />
              {postalError && <span className="error">{postalError}</span>}
            </div>
            <div className="form-field">
              <label>
                City <span className="auto-label">Filled automatically</span>
              </label>
              <input
                type="text"
                placeholder="Toronto"
                readOnly
                value={shippingAddress?.city}
              />
            </div>

            <div className="form-field">
              <label>
                Province{" "}
                <span className="auto-label">Filled automatically</span>
              </label>
              <input
                type="text"
                placeholder="Ontario"
                readOnly
                value={shippingAddress?.province}
              />
            </div>
          </div>

          <div className="form-field">
            <label>Address</label>
            <input
              type="text"
              placeholder="123 Maple Street"
              required
              value={shippingAddress?.address}
              onChange={(e) =>
                dispatch(
                  setShippingAdress({
                    ...shippingAddress,
                    address: e.target.value,
                  }),
                )
              }
            />
          </div>

          <div className="form-field">
            <label>
              <p>Company</p> <span>Optional</span>
            </label>
            <input type="text" placeholder="MapleTech Inc." />
          </div>

          <div className="form-field">
            <label>
              <p>Apartment, suite, etc.</p> <span>Optional</span>
            </label>
            <input type="text" placeholder="Apt. 5B" />
          </div>
        </div>
      </form>
      <div className="OrderLayout-buttons">
        <div className="OrderLayout-button-back-to-cart">
          <PiCaretLeftBold />
          <p>Back to Cart</p>
        </div>
        <div className="OrderLayout-button-next">Continue to shipping</div>
      </div>
    </div>
  );
}
