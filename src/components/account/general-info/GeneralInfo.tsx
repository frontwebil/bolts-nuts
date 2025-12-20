import { PiPencilSimpleLine } from "react-icons/pi";
import "../general-info/style.css";

export function GeneralInfo() {
  return (
    <div className="GeneralInfo">
      <div className="GeneralInfo-top">
        <h2>general information</h2>
        <div className="GeneralInfo-top-line"></div>
        <div className="GeneralInfo-top-manage">
          <PiPencilSimpleLine />
          <p>Manage</p>
        </div>
      </div>
    </div>
  );
}
