import { Order } from "@prisma/client";
import "./style.css";

export function AccountOrderWrapper({orders}:{orders:Order[]}) {
  console.log(orders)
  return (
    <div className="Account-section">
      <div className="Account-section-top flex justify-between items-center">
        <h2>orders history ({orders.length})</h2>
        {/* <div className="">Sort By: All</div> */}
      </div>
      <div className="order-history-card">
        <div className="order-history-card-top">
          
        </div>
      </div>
    </div>
  );
}
