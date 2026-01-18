import { OrderPageWrapper } from "@/components/orderPage/OrderPageWraper";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { userDataType } from "@/redux/main/slices/orderCartSlice";

export default async function OrderPage() {
  const session = await getServerSession();

  let user: userDataType | null = null;

  if (session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        name: true,
        surname: true,
        phoneNumber: true,
        email: true,
      },
    });

    if (dbUser) {
      user = {
        name: dbUser.name ?? "",
        surname: dbUser.surname ?? "",
        phoneNumber: dbUser.phoneNumber ?? "",
        email: dbUser.email,
      };
    }
  }

  if (!user) {
    user = {
      name: "",
      surname: "",
      phoneNumber: "",
      email: "",
    };
  }

  return (
    <div className="overflow-x-hidden">
      <OrderPageWrapper userData={user} />
    </div>
  );
}
