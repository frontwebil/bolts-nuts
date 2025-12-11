"use client";

import Image from "next/image";
import "../Header/Header.css";
import { Search } from "./Components/Search";
import { PersonalAccount } from "./Components/PersonalData/PersonalAccount";
import Saved from "./Components/PersonalData/Saved";
import { Cart } from "./Components/PersonalData/Cart";
import { CatalogMenu } from "./Components/CatalogMenu";
import { useEffect, useRef, useState } from "react";
import { RootState } from "@/redux/main/store";
import { useSelector } from "react-redux";
import { CATEGORYES } from "@/generalConfigs/SITE_CONFIG";

export function Header() {
  const HeaderRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(110);
  const { isOpenCatalog } = useSelector((store: RootState) => store.uiSlice);

  useEffect(() => {
    const updateHeight = () => {
      if (HeaderRef.current) {
        setHeaderHeight(HeaderRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <>
      <header ref={HeaderRef}>
        <div className="header-wrapper">
          <div className="container">
            <div className="header-left">
              <div className="header-logo">
                <Image
                  src={"/logo.svg"}
                  width={300}
                  height={60}
                  alt="Bolts-Nuts"
                />
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
        </div>
        <div className={`catalog-burger-menu ${isOpenCatalog ? "active" : ""}`}>
          <div className="container">
            <div className="catalog-burger-menu-content">
              <h3>All Categories</h3>
              <div className="catalog-burger-menu-content-categoryes">
                {CATEGORYES.map((el, i) => (
                  <button key={i}>{el.category}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
      <div style={{ height: headerHeight }} />
    </>
  );
}
