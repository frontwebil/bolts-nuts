import { CartLayout } from "@/components/cart/CartLayout";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function page() {
  const session = await getServerSession();
  let postalCode = "";
  let addressLine = "";

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { mainAddressId: true },
    });

    if (user?.mainAddressId) {
      const userAddress = await prisma.address.findUnique({
        where: { id: user.mainAddressId },
        select: { postalCode: true, addressLine: true },
      });

      postalCode = userAddress?.postalCode ?? "";
      addressLine = userAddress?.addressLine ?? "";
    }
  }

  return (
    <div>
      <CartLayout postalCode={postalCode} addressLine={addressLine}/>
    </div>
  );
}
