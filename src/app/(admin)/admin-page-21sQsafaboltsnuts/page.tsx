import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Catalog from "../components/Catalog/Catalog";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    redirect("/admin-page-21sQsafaboltsnuts/login");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      options: true,
      specs: true,
    },
  });

  if (!products) {
    return;
  }

  return <Catalog products={products} />;
}
