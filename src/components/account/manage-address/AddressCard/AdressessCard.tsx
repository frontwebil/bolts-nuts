import { Address } from "@prisma/client";
import { PiPencilSimpleLine } from "react-icons/pi";
import { DeleteAdress } from "./DeleteAdress";
import { MakePrimaryAdress } from "./MakePrimaryAdress";
import { useState } from "react";
import { ManageAddressUpdate } from "./ManageAddressUpdate";
import { useWindowWidth } from "@/hooks/useWidth";

type Props = {
  address: Address;
  i: number;
  isMain: boolean;
};

export function AdressessCard({ address, i, isMain }: Props) {
  const [isOpenEditForm, setIsOpenEditForm] = useState(false);
  const screenWidth = useWindowWidth();

  return (
    <>
      {isOpenEditForm ? (
        <ManageAddressUpdate
          setIsOpenEditForm={setIsOpenEditForm}
          address={address}
        />
      ) : (
        <div className="Adressess-card">
          <div className="Adressess-card-top">
            <div className="Adressess-card-top-text">
              {isMain ? "Primary Address" : `Address ${i + 1}`}
              {screenWidth && screenWidth < 640 && !isMain && (
                <MakePrimaryAdress id={address.id} isMain={isMain} />
              )}
            </div>
            <div className="Adressess-card-top-adressline">{`${address.addressLine}, ${address.city} , ${address.province} , ${address.postalCode}`}</div>
          </div>
          <div className="Adressess-card-funcional">
            <div className="Adressess-card-funcional-left-func">
              <div
                className="Account-section-top-manage"
                onClick={() => setIsOpenEditForm(true)}
              >
                <PiPencilSimpleLine />
                <p>Manage</p>
              </div>
              {screenWidth && screenWidth > 640 && !isMain && (
                <MakePrimaryAdress id={address.id} isMain={isMain} />
              )}
            </div>
            <DeleteAdress id={address.id} />
          </div>
        </div>
      )}
    </>
  );
}
