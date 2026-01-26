import { AccountNavigation } from "@/components/account/navigation/AccountNavigation";
import { AccountOrderWrapper } from "@/components/account/orders/AccountOrderWrapper";
import { Breadcrums } from "@/components/breadcrums/Breadcrums";
import "../style.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function page() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    where: {
      email: session.user.email,
      status: "paid",
    },
    orderBy: { createdAt: "desc" },
  });

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
          <AccountOrderWrapper orders={orders} />
        </div>
      </div>
    </section>
  );
}
