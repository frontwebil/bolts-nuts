import { useDispatch, useSelector } from "react-redux";
import "../../../app/(main)/account/style.css";
import { RootState } from "@/redux/main/store";
import { setUserData } from "@/redux/main/slices/orderCartSlice";

export function OrderLayout() {
  const { userData } = useSelector((store: RootState) => store.orderCartSlice);
  const dispatch = useDispatch();

  return (
    <div className="OrderLayout">
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
      <div className="Order-layout-top">
        <h2>Shipping address</h2>
        <div className="Order-layout-top-line"></div>
      </div>
    </div>
  );
}
