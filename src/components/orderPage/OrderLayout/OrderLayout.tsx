import "./style.css";

import "../../../app/(main)/account/style.css";
import { OrderAddress } from "./OrderAddress/OrderAddress";

export function OrderLayout() {
  return (
    <div className="OrderLayout">
      <OrderAddress />
    </div>
  );
}
