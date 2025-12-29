import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Breadcrums } from "@/components/breadcrums/Breadcrums";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import "../account/style.css";
import { AccountNavigation } from "@/components/account/navigation/AccountNavigation";
import { redirect } from "next/navigation";
import { GeneralInfo } from "@/components/account/general-info/GeneralInfo";
import { AdminAlert } from "@/components/account/general-info/AdminAlert";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  const isAdmin = session?.user.role == "admin";

  if (!session?.user?.email) {
    redirect("/");
  }

  if (isAdmin) {
    return <AdminAlert />;
  }

  const accountData = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    },
    select: {
      name: true,
      surname: true,
      phoneNumber: true,
      email: true,
    },
  });

  if (!accountData) {
    redirect("/");
  }

  return (
    <section className="AccountPage">
      <div className="container">
        <>
          <Breadcrums
            links={[
              { title: "Home", href: "/" },
              { title: "Personal Account" },
            ]}
          />
          <div className="AccountPage-content">
            <AccountNavigation />
            <GeneralInfo accountData={accountData} />
          </div>
        </>
      </div>
    </section>
  );
}
