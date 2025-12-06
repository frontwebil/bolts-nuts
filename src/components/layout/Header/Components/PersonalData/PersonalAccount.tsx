import { PiUserCircle } from "react-icons/pi";

export function PersonalAccount() {


  return (
    <div className="header-personalAccount-data-column">
      <div className="header-personal-data-top-row">
        <PiUserCircle />
        <h3>
          <span className="personal-acc-hidden-laptop">Personal</span> Account
        </h3>
      </div>
      <div className="header-personal-data-bottom-row">
        <p className="header-personal-data-bottom-row-text">Login</p>
        <p>/</p>
        <p className="header-personal-data-bottom-row-text">Sign-up</p>
      </div>
    </div>
  );
}
