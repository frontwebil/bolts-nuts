"use client";

import Image from "next/image";
import "../Header/Header.css";
import { Search } from "./Components/Search";
import { PersonalAccount } from "./Components/PersonalData/PersonalAccount";
import Saved from "./Components/PersonalData/Saved";
import { Cart } from "./Components/PersonalData/Cart";
import { CatalogMenu } from "./Components/CatalogMenu";

export function Header() {
  return (
    <header>
      <div className="container">
        <div className="header-left">
          <div className="header-logo">
            <Image src={"/logo.svg"} width={300} height={60} alt="Bolts-Nuts" />
          </div>
          <CatalogMenu />
        </div>
        <div className="container-search">
          <Search />
        </div>
        <div className="header-personal-data">
          <PersonalAccount />
          <Saved />
          <Cart />
        </div>
      </div>
      <div className="container-mobile-search">
        <Search />
      </div>
    </header>
  );
}
