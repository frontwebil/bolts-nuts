import Link from "next/link";
import "./style.css";

export default function PaymentSuccess() {
  return (
    <div className="PaymentSuccess-container">
      <div className="PaymentSuccess-wrapper">
        <h2>
          Your order has been placed <span style={{color:"#FF5A00"}}>successfully!</span>{" "}
        </h2>
        <h3>We’ve received your order and have started processing it.</h3>
        <Link href={'/catalog'}>Back to Shopping</Link>
        <p>
          You’ll receive a confirmation email shortly with your order details
          and tracking information.
        </p>
      </div>
    </div>
  );
}
