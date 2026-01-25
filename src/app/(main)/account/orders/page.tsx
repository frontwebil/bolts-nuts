import { AccountNavigation } from "@/components/account/navigation/AccountNavigation";
import { AccountOrderWrapper } from "@/components/account/orders/AccountOrderWrapper";
import { Breadcrums } from "@/components/breadcrums/Breadcrums";

export default function page() {
  return (
    <section className="AccountPage">
      <div className="container">
        <Breadcrums
          links={[
            { title: "Home", href: "/" },
            { title: "Personal Account", href: "/account" },
            { title: "Order History" },
          ]}
        />
        <div className="AccountPage-content">
          <AccountNavigation />
          <AccountOrderWrapper/>
        </div>
      </div>
    </section>
  );
}
