import "./style.css";
import { FullScreenLoader } from "@/components/loader/FullScreenLoader";
import { getEasyshipRates } from "@/lib/easyships/getEasyshipRates";
import {
  setLocation,
  setShippingAdress,
  setUserData,
} from "@/redux/main/slices/orderCartSlice";
import { RootState } from "@/redux/main/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { PiCaretLeftBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { OrderAddressCards } from "./OrderAddressCards";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export function OrderAddress() {
  const { userData, shippingAddress } = useSelector(
    (store: RootState) => store.orderCartSlice,
  );
  const [loading, setLoading] = useState(false);
  const [postalError, setPostalError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const validateForm = () => {
    if (!userData?.email) return "Email is required";
    if (!userData?.name) return "First name is required";
    if (!userData?.surname) return "Last name is required";
    if (!userData?.phoneNumber) return "Phone number is required";

    if (!shippingAddress?.postalCode) return "Postal code is required";
    if (!shippingAddress?.city) return "City is not filled";
    if (!shippingAddress?.province) return "Province is not filled";
    if (!shippingAddress?.address) return "Address is required";

    if (postalError) return postalError;

    return null;
  };

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

    dispatch(
      setLocation({
        stateCode: "",
        stateName: "",
        shippingPrice: 0,
      }),
    );

    // Чистий код — тільки для логіки
    const clean = raw.replace(/\s/g, "");

    if (clean.length !== 6) return;

    if (!/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(clean)) {
      setPostalError("Invalid Canadian postal code");
      return;
    }

    setLoading(true);
    try {
      const fsa = clean.slice(0, 3);
      const res = await axios.get(`https://api.zippopotam.us/CA/${fsa}`);

      const place = res.data?.places?.[0];
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const code = shippingAddress?.postalCode;
    if (!code || code.length < 6) return;

    const fetchPostalData = async () => {
      const clean = code.toUpperCase().replace(/\s/g, "");

      if (!/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(clean)) {
        setPostalError("Invalid Canadian postal code");
        return;
      }

      setLoading(true);
      try {
        const fsa = clean.slice(0, 3);
        const res = await axios.get(`https://api.zippopotam.us/CA/${fsa}`);
        const place = res.data?.places?.[0];
        if (!place) {
          setPostalError("Postal code not found");
          return;
        }

        setPostalError("");

        const newShipping = {
          ...shippingAddress,
          postalCode: code,
          city: place["place name"] ?? "",
          province: place.state ?? "",
        };

        // ✅ Диспатчимо лише якщо змінились дані
        if (JSON.stringify(shippingAddress) !== JSON.stringify(newShipping)) {
          dispatch(setShippingAdress(newShipping));
        }

        const shipping = await getEasyshipRates(code);

        dispatch(
          setLocation({
            stateCode: place["state abbreviation"],
            stateName: place.state,
            shippingPrice: shipping[0].total_charge,
          }),
        );
      } catch {
        setPostalError("Postal service unavailable");
      } finally {
        setLoading(false);
      }
    };

    fetchPostalData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingAddress?.postalCode]);

  return (
    <div className="OrderAddress">
      {loading && <FullScreenLoader />}
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

      <OrderAddressCards />

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
                disabled={loading}
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
        <Link href={"/cart"} className="OrderLayout-button-back-to-cart">
          <PiCaretLeftBold />
          <p>Back to Cart</p>
        </Link>
        <div
          className="OrderLayout-button-next"
          onClick={() => {
            const error = validateForm();

            if (error) {
              toast.error(error);
              return;
            }

            router.push("/order?type=shipping");
          }}
        >
          Continue To shipping
        </div>
      </div>
    </div>
  );
}
