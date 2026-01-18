import { toast } from "react-toastify";
import "./style.css";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/main/store";
import { setLocation } from "@/redux/main/slices/orderCartSlice";
import { getEasyshipRates } from "@/lib/easyships/getEasyshipRates";
import { FullScreenLoader } from "@/components/loader/FullScreenLoader";

export function PostalCodeCalculator({}) {
  const [postalCode, setPostalCode] = useState("");
  const { stateName } = useSelector((store: RootState) => store.orderCartSlice);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChangePostalCode = async () => {
    if (loading) return;

    setLoading(true);

    const value = postalCode;

    if (value.length < 6) {
      toast("Enter full postal code (6 characters)");
      return;
    }

    if (!/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(value)) {
      toast("Invalid Canadian postal code format");
      return;
    }

    const fsa = value.substring(0, 3);

    try {
      const res = await axios.get(`https://api.zippopotam.us/CA/${fsa}`);

      const place = res.data?.places?.[0];

      if (!place) {
        toast("Postal code not found");
        return;
      }
      const shipping = await getEasyshipRates(postalCode);
      dispatch(
        setLocation({
          stateCode: place["state abbreviation"],
          stateName: place.state,
          shippingPrice: shipping[0].total_charge,
        }),
      );
      setPostalCode("");
    } catch {
      toast("Service unavailable. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="PostalCodeCalculator-box">
      {loading && <FullScreenLoader />}

      <p className="PostalCodeCalculator-hint">
        Enter your postal code to calculate shipping cost and applicable taxes
        (HST).
      </p>
      <div className="PostalCodeCalculator-box-input-flex">
        <input
          type="text"
          className="PostalCodeCalculator-input"
          placeholder="L5L 5K8"
          autoComplete="postal-code"
          value={postalCode}
          maxLength={6}
          onChange={(e) => {
            const rawValue = e.target.value;

            const normalizedValue = rawValue
              .toUpperCase()
              .replace(/\s/g, "")
              .replace(/[^A-Z0-9]/g, "");

            setPostalCode(normalizedValue);

            if (normalizedValue.length < 2) {
              dispatch(setLocation(""));
            }
          }}
        />
        <button
          className="PostalCodeCalculator-button"
          onClick={() => {
            handleChangePostalCode();
          }}
        >
          Calculate
        </button>
      </div>
      {stateName.length > 0 && (
        <p className="choosed-state">
          Choosed State : <span className="font-semibold">{stateName}</span>
        </p>
      )}
    </div>
  );
}
