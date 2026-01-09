import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SavePageWrapper } from "@/components/savePage/SavePageWrapper";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SavedPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="mb-10">
      <SavePageWrapper />
    </div>
  );
}
