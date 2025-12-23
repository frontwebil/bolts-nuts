/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PiPencilSimpleLine } from "react-icons/pi";
import "../general-info/style.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

type accountData = {
  name: string;
  surname: string;
  phoneNumber: string | undefined | null;
  email: string;
};

export function GeneralInfo({ accountData }: { accountData: accountData }) {
  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (accountData) {
      setUserData({
        name: accountData.name || "",
        surname: accountData.surname || "",
        phoneNumber: accountData.phoneNumber || "",
      });
    }
  }, [accountData]);

  const updateInfo = async () => {
    try {
      const res = await axios.patch("/api/user/update-user", userData);

      setUserData({
        name: res.data.updatedUser.name || "",
        surname: res.data.updatedUser.surname || "",
        phoneNumber: res.data.updatedUser.phoneNumber || "",
      });

      toast.success("Your information has been successfully updated!");
      setIsEdit(false);
    } catch (error: any) {
      const msg =
        error?.response?.data?.error || "Failed to update user information";
      toast.error(msg);
    }
  };

  return (
    <div className="Account-section">
      <div className="Account-section-top">
        <h2>general information</h2>
        <div className="Account-section-top-line"></div>
        <div
          className="Account-section-top-manage"
          onClick={() => setIsEdit(!isEdit)}
        >
          <PiPencilSimpleLine />
          <p>{!isEdit ? "Manage" : "Cancel editing"}</p>
        </div>
      </div>
      <div className="Account-section-content">
        <div className="input-wrapper">
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              value={
                accountData.email ? accountData.email : "your-email@gmail.com"
              }
              disabled
            />
          </div>
          <div className="input-wrapper-group">
            <div className="form-field">
              <label>First name</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                placeholder="John"
                disabled={!isEdit}
              />
            </div>

            <div className="form-field">
              <label>Last name</label>
              <input
                type="text"
                value={userData.surname}
                placeholder="Johnson"
                disabled={!isEdit}
                onChange={(e) =>
                  setUserData({ ...userData, surname: e.target.value })
                }
              />
            </div>
          </div>
          <div className="form-field">
            <label>Phone Number</label>
            <input
              type="text"
              value={userData.phoneNumber}
              placeholder="+1 (416) 555-1234"
              disabled={!isEdit}
              onChange={(e) =>
                setUserData({ ...userData, phoneNumber: e.target.value })
              }
            />
          </div>
          {isEdit && (
            <div className="input-wrapper-save-buttons">
              <button className="save-btn" onClick={() => updateInfo()}>
                Save changes
              </button>
              <button className="cancel-btn" onClick={() => setIsEdit(false)}>
                Cancel Editing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
