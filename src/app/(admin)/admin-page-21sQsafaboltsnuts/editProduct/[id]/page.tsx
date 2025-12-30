/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditProductForm } from "@/app/(admin)/components/EditProductForm/EditProductForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function editProduct() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    redirect("/admin-page-21sQsafaboltsnuts/login");
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <EditProductForm />
    </div>
  );
}
