import { Address } from "@prisma/client";
import { AdressessCard } from "./AddressCard/AdressessCard";
type Props = {
  userAdresses: Address[];
  mainAddressId: string | null; // важливо: може бути null
};

export function AdressessCards({ userAdresses, mainAddressId }: Props) {
  const addresses = [...userAdresses].sort((a, b) => {
    if (a.id === mainAddressId) return -1;
    if (b.id === mainAddressId) return 1;
    return 0;
  });

  return (
    <div className="Adressess-cards">
      {addresses.map((address, i) => (
        <AdressessCard
          address={address}
          i={i}
          isMain={address.id == mainAddressId}
          key={address.id}
        />
      ))}
    </div>
  );
}
