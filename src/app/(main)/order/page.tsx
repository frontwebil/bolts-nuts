import { OrderPageWrapper } from "@/components/orderPage/OrderPageWraper";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { userDataType } from "@/redux/main/slices/orderCartSlice";

interface userWithAddressId extends userDataType {
  mainAddressId?: string | null;
}

export default async function OrderPage() {
  const session = await getServerSession();

  let user: userWithAddressId | null = null;
  let addresses = null;
  let mainAdress = null;

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
        id: true,
        mainAddressId: true,
      },
    });

    if (dbUser) {
      user = {
        name: dbUser.name ?? "",
        surname: dbUser.surname ?? "",
        phoneNumber: dbUser.phoneNumber ?? "",
        email: dbUser.email,
        mainAddressId: dbUser.mainAddressId ?? "",
      };

      addresses = await prisma.address.findMany({
        where: { userId: dbUser.id },
        select: {
          postalCode: true,
          city: true,
          province: true,
          addressLine: true,
          company: true,
          id: true,
          apartment: true,
          userId: true,
        },
      });

      mainAdress = addresses.find((el) => el.id == dbUser.mainAddressId);

      addresses = addresses.map((a) => ({
        ...a,
        company: a.company ?? "",
        apartment: a.apartment ?? "",
      }));
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

  const normalizedMainAddress = mainAdress
    ? {
        ...mainAdress,
        address: mainAdress.addressLine ?? "",
        company: mainAdress.company ?? "",
        apartment: mainAdress.apartment ?? "",
      }
    : null;

  return (
    <div className="overflow-x-hidden">
      <OrderPageWrapper
        userData={user}
        addresses={
          addresses?.map((a) => ({
            ...a,
            address: a.addressLine ?? "",
            company: a.company ?? "",
            apartment: a.apartment ?? "",
          })) ?? null
        }
        mainAddress={normalizedMainAddress} // збігається з пропсами
      />
    </div>
  );
}
