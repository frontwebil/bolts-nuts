import { OrderPageWrapper } from "@/components/orderPage/OrderPageWraper";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function OrderPage() {
  const session = await getServerSession();

  let user = null;

  if (session?.user?.email) {
    user = await prisma.user.findUnique({
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
  }

  return (
    <div className="overflow-x-hidden">
      <OrderPageWrapper userData={user} />
    </div>
  );
}
