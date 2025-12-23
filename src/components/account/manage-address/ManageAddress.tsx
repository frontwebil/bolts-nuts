"use client";

import { IoCloseOutline } from "react-icons/io5";
import "../manage-address/style.css";
import { FaPlus } from "react-icons/fa";
import { Address } from "@prisma/client";
import { useState } from "react";

type accountData = {
  addresses: Address[];
};

export function ManageAddress({ accountData }: { accountData: accountData }) {
  const adressList = accountData.addresses;
  const [newAdress, setNewAdress] = useState({
    country: "",
    addressLine: "",
    city: "",
    province: "",
    postalCode: "",
    company: "",
    apartment: "",
  });

  return (
    <div className="Account-section">
      <div className="Account-section-top">
        <h2>Manage Address</h2>
        <div className="Account-section-top-line"></div>
        <div className="Account-section-top-manage">
          <FaPlus />
          <p>Add new</p>
        </div>
      </div>
      <div className="Add-address-form">
        <div className="Add-address-form-top">
          <h2>Add new address</h2>
          <IoCloseOutline style={{ cursor: "pointer" }} />
        </div>

        <div className="input-wrapper">
          <div className="form-field">
            <label>Country/region</label>
            <input
              type="text"
              value={newAdress.country}
              onChange={(e) =>
                setNewAdress({ ...newAdress, country: e.target.value })
              }
              placeholder="Canada"
              required
            />
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

          <div className="input-wrapper-group">
            <div className="form-field">
              <label>City</label>
              <input
                type="text"
                value={newAdress.city}
                onChange={(e) =>
                  setNewAdress({ ...newAdress, city: e.target.value })
                }
                placeholder="Toronto"
                required
              />
            </div>

            <div className="form-field">
              <label>Province</label>
              <input
                type="text"
                value={newAdress.province}
                onChange={(e) =>
                  setNewAdress({ ...newAdress, province: e.target.value })
                }
                placeholder="Ontario"
                required
              />
            </div>

            <div className="form-field">
              <label>Postal code</label>
              <input
                type="text"
                value={newAdress.postalCode}
                onChange={(e) =>
                  setNewAdress({ ...newAdress, postalCode: e.target.value })
                }
                placeholder="M4B 1B3"
                required
              />
            </div>
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
            <button className="save-btn" onClick={() => console.log(newAdress)}>
              Add Address
            </button>
            <button
              className="cancel-btn"
              onClick={() =>
                setNewAdress({
                  country: "",
                  addressLine: "",
                  city: "",
                  province: "",
                  postalCode: "",
                  company: "",
                  apartment: "",
                })
              }
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="Adressess-cards">
        <div className="Adressess-card">
          {adressList.map((el, i) => (
            <p key={i}>{el.city}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
