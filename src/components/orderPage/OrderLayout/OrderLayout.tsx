import "./style.css";

import "../../../app/(main)/account/style.css";
import { OrderAddress } from "./OrderAddress/OrderAddress";
import { useSearchParams } from "next/navigation";
import { OrderShipping } from "./OrderShipping/OrderShipping";

export function OrderLayout() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  return (
    <div className="OrderLayout">
      {type == "shipping" ? <OrderShipping /> : <OrderAddress />}
    </div>
  );
}
