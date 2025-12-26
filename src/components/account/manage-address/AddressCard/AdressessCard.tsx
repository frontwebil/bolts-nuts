import { Address } from "@prisma/client";
import { PiPencilSimpleLine, PiStar } from "react-icons/pi";
import { DeleteAdress } from "./DeleteAdress";
import { useState } from "react";

type Props = {
  address: Address;
  i: number;
  isMain: boolean;
};

export function AdressessCard({ address, i, isMain }: Props) {

  return (
    <div className="Adressess-card">
      <div className="Adressess-card-top">
        <div className="Adressess-card-top-text">
          {isMain ? "Primary Address" : `Adress ${i + 1}`}
        </div>
        <div className="Adressess-card-top-adressline">{`${address.addressLine}, ${address.city} , ${address.province} , ${address.postalCode}`}</div>
      </div>
      <div className="Adressess-card-funcional">
        <div className="Adressess-card-funcional-left-func">
          <div className="Account-section-top-manage">
            <PiPencilSimpleLine />
            <p>Manage</p>
          </div>
          {!isMain && (
            <div className="Account-section-top-make-primary">
              <PiStar />
              <p>Make primary</p>
            </div>
          )}
        </div>
        <DeleteAdress id={address.id} />
      </div>
    </div>
  );
}
