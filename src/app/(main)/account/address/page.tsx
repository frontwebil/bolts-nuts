import { ManageAddress } from "@/components/account/manage-address/ManageAddress";
import { AccountNavigation } from "@/components/account/navigation/AccountNavigation";
import { Breadcrums } from "@/components/breadcrums/Breadcrums";
import "../style.css";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export default async function page() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id: session?.user.id },
    select: {
      id: true,
      mainAddressId: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  if (!session?.user?.email) {
    redirect("/");
  }

  const userAdresses = await prisma.address.findMany({
    where: {
      userId: user?.id,
    },
  });

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
          <ManageAddress
            userAdresses={userAdresses}
            mainAddressId={user.mainAddressId}
          />
        </div>
      </div>
    </section>
  );
}
