import { ManageAddress } from "@/components/account/manage-address/ManageAddress";
import { AccountNavigation } from "@/components/account/navigation/AccountNavigation";
import { Breadcrums } from "@/components/breadcrums/Breadcrums";
import "../style.css";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function page() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  const accountData = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    },
    select: {
      addresses: true,
    },
  });

  if (!accountData) {
    redirect("/");
  }
  return (
    <section className="AccountPage">
      <div className="container">
        <Breadcrums
          links={[
            { title: "Home", href: "/" },
            { title: "Personal Account", href: "/account" },
            { title: "Manage Address" },
          ]}
        />
        <div className="AccountPage-content">
          <AccountNavigation />
          <ManageAddress accountData={accountData} />
        </div>
      </div>
    </section>
  );
}
