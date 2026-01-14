export function CartPrice({ total }: { total: number }) {
  return (
    <div className="CartPopUp-wrapper-content-price">
      <h2>Your Order</h2>
      {/* <div className="CartPopUp-wrapper-content-price-block">
        <div className="CartPopUp-wrapper-content-price-block-row">
          <p>Price</p>
          <p>{total.toFixed(2)}$</p>
        </div>
      </div> */}
      <div className="CartPopUp-wrapper-content-price-block-total">
        <div className="CartPopUp-wrapper-content-price-block-total-row">
          <p>SUBTOTAL</p>
          <p style={{ color: "#FF5A00" }}>{total.toFixed(2)}$</p>
        </div>
        <div className="CartPopUp-wrapper-content-price-block-total-checkout">
          Checkout
        </div>
      </div>
    </div>
  );
}
