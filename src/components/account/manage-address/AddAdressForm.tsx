import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";

export function AddAdressForm({
  AdressListLength,
}: {
  AdressListLength: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const caRegex = /^[A-Z]\d[A-Z][ -]?\d[A-Z]\d$/i;
  const [postalError, setPostalError] = useState(
    "Enter full postal code (6 characters)"
  );
  const router = useRouter();
  const [newAdress, setNewAdress] = useState({
    country: "Canada",
    addressLine: "",
    city: "",
    province: "",
    postalCode: "",
    company: "",
    apartment: "",
  });

  const [loading, setLoading] = useState(false);

  const [isOpenAddForm, setIsOpenAddForm] = useState(true);

  const handleAddAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (postalError) {
      toast.error(postalError);
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/user/address/add", {
        ...newAdress,
      });

      toast.success("Address added successfully!");

      setNewAdress({
        country: "Canada",
        addressLine: "",
        city: "",
        province: "",
        postalCode: "",
        company: "",
        apartment: "",
      });

      console.log("Address response:", res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      toast.error(message);
      console.error("Add address error:", error);
    } finally {
      setLoading(false);
      setIsOpenAddForm(false);
      router.refresh();
    }
  };

  const handleChangePostalCode = async (e: { target: { value: string } }) => {
    const value = e.target.value.toUpperCase().replace(/\s/g, "");

    setNewAdress({ ...newAdress, postalCode: value });

    if (value.length < 6) {
      setPostalError("Enter full postal code (6 characters)");
      setNewAdress((prev) => ({ ...prev, city: "", province: "" }));
      return;
    }

    if (!/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(value)) {
      setPostalError("Invalid Canadian postal code format");
      setNewAdress((prev) => ({ ...prev, city: "", province: "" }));
      return;
    }

    const fsa = value.substring(0, 3);

    try {
      const res = await axios.get(`https://api.zippopotam.us/CA/${fsa}`);

      const place = res.data?.places?.[0];

      if (!place) {
        setPostalError("Postal code not found");
        return;
      }

      setPostalError("");

      setNewAdress((prev) => ({
        ...prev,
        postalCode: value,
        province: place.state ?? "",
        city: place["place name"] ?? "",
      }));
    } catch {
      setPostalError("Service unavailable. Try again later.");
    }
  };
  return (
    <>
      <div className="Account-section-top">
        <h2>Manage Address</h2>
        <div className="Account-section-top-line"></div>
        <div
          className="Account-section-top-manage"
          onClick={() => {
            if (AdressListLength >= 3) {
              toast("You already have 3 addresses");
              return;
            }
            setIsOpenAddForm(true);
          }}
        >
          <FaPlus />
          <p>Add new</p>
        </div>
      </div>
      {isOpenAddForm && (
        <form className="Add-address-form" onSubmit={handleAddAddress}>
          <div className="Add-address-form-top">
            <h2>Add new address</h2>
            <IoCloseOutline
              style={{ cursor: "pointer" }}
              onClick={() => setIsOpenAddForm(false)}
            />
          </div>

          <div className="input-wrapper">
            <div className="form-field">
              <label>Country/region</label>
              <input
                type="text"
                value={newAdress.country}
                placeholder="Canada"
                required
                readOnly
              />
            </div>

            <div className="input-wrapper-group">
              <div className="form-field">
                <label>Postal code</label>
                <input
                  type="text"
                  value={newAdress.postalCode}
                  onChange={(e) => handleChangePostalCode(e)}
                  placeholder="M4B1B3"
                  maxLength={6}
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
                  value={newAdress.city}
                  placeholder="Toronto"
                  readOnly
                />
              </div>

              <div className="form-field">
                <label>
                  Province{" "}
                  <span className="auto-label">Filled automatically</span>
                </label>
                <input
                  type="text"
                  value={newAdress.province}
                  placeholder="Ontario"
                  readOnly
                />
              </div>
            </div>

            <div className="form-field">
              <label>Address</label>
              <input
                type="text"
                value={newAdress.addressLine}
                onChange={(e) =>
                  setNewAdress({ ...newAdress, addressLine: e.target.value })
                }
                placeholder="123 Maple Street"
                required
              />
            </div>

            <div className="form-field">
              <label>
                <p>Company</p> <span>Optional</span>
              </label>
              <input
                type="text"
                value={newAdress.company}
                onChange={(e) =>
                  setNewAdress({ ...newAdress, company: e.target.value })
                }
                placeholder="MapleTech Inc."
              />
            </div>

            <div className="form-field">
              <label>
                <p>Apartment, suite, etc.</p> <span>Optional</span>
              </label>
              <input
                type="text"
                value={newAdress.apartment}
                onChange={(e) =>
                  setNewAdress({ ...newAdress, apartment: e.target.value })
                }
                placeholder="Apt. 5B"
              />
            </div>

            <div className="input-wrapper-save-buttons">
              <button className="save-btn" disabled={loading}>
                {loading ? "Adding Address" : "Add Address"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setIsOpenAddForm(false);
                  setNewAdress({
                    country: "Canada",
                    addressLine: "",
                    city: "",
                    province: "",
                    postalCode: "",
                    company: "",
                    apartment: "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
