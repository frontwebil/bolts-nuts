import { getServerSession } from "next-auth";
import { OdersPage } from "../../components/OdersPage/OdersPage";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function OrderPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    redirect("/admin-page-21sQsafaboltsnuts/login");
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <OdersPage orders={orders}/>;
}
