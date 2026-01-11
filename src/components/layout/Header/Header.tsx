"use client";

import Image from "next/image";
import "../Header/Header.css";
import { Search } from "./Components/Search";
import { PersonalAccount } from "./Components/PersonalData/PersonalAccount";
import Saved from "./Components/PersonalData/Saved";
import { Cart } from "./Components/PersonalData/Cart";
import { CatalogMenu } from "./Components/CatalogMenu";
import { useEffect, useRef, useState } from "react";
import { CatalogBurgerMenu } from "./Components/CatalogBurgerMenu/CatalogBurgerMenu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/main/store";
import { closeBurger } from "@/redux/main/slices/uiSlice";
import Link from "next/link";
import { CartFirstMenu } from "./Components/Cart/CartFirstMenu";

export function Header() {
  const HeaderRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
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
              <Link href={"/"} className="header-logo">
                <Image
                  src={"/logo.PNG"}
                  unoptimized
                  width={300}
                  height={60}
                  alt="Bolts-Nuts"
                />
              </Link>
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
        <CatalogBurgerMenu />
        <CartFirstMenu/>
      </header>
      <div style={{ height: headerHeight }} />
      {isOpenCatalog && (
        <div
          className="opacity-background"
          onClick={() => {
            dispatch(closeBurger());
          }}
        ></div>
      )}
    </>
  );
}
