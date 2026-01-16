import "../../../app/(main)/account/style.css";

export function OrderLayout() {
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
            <input type="email" placeholder="example@gmail.com" />
          </div>
          <div className="input-wrapper-group">
            <div className="form-field">
              <label>First name</label>
              <input type="text" placeholder="John" />
            </div>

            <div className="form-field">
              <label>Last name</label>
              <input type="text" placeholder="Johnson" />
            </div>
          </div>
          <div className="form-field">
            <label>Phone Number</label>
            <input type="text" placeholder="+1 (416) 555-1234" />
          </div>
        </div>
      </div>
    </div>
  );
}
