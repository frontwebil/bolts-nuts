import { Order } from "@prisma/client";
import "./style.css";
import { UserOrdersList } from "./OrderList/OrderList";



export function AccountOrderWrapper({ orders }: { orders: Order[] }) {
  return (
    <div className="Account-section">
      <div className="Account-section-top flex justify-between items-center">
        <h2>orders history ({orders.length})</h2>
        {/* <div className="">Sort By: All</div> */}
      </div>
      <UserOrdersList orders={orders}/>
    </div>
  );
}
