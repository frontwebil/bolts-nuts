"use client";

import "../manage-address/style.css";
import { Address } from "@prisma/client";
import { AddAdressForm } from "./AddAdressForm";
import { AdressessCards } from "./AdressessCards";

type Props = {
  userAdresses: Address[];
  mainAddressId: string | null; // важливо: може бути null
};

export function ManageAddress({ userAdresses, mainAddressId }: Props) {
  return (
    <div className="Account-section">
      <AddAdressForm AdressListLength={userAdresses.length} />
      <AdressessCards
        userAdresses={userAdresses}
        mainAddressId={mainAddressId}
      />
    </div>
  );
}
