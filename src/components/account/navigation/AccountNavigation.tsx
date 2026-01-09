"use client";

import { PiUserCircle } from "react-icons/pi";
import "../navigation/style.css";
import { BsHouseDoor } from "react-icons/bs";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { GoSignOut } from "react-icons/go";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function AccountNavigation() {
  const pathname = usePathname();
  return (
    <div className="AccountPage-content-navigation">
      <div className="AccountPage-content-navigation-top-info">
        <Link
          href={"/account"}
          className={`AccountPage-content-row ${
            pathname === "/account" && "active"
          }`}
        >
          <div className="AccountPage-content-img">
            <PiUserCircle />
          </div>
          <p>Personal Information</p>
        </Link>
        <Link
          href={"/account/address"}
          className={`AccountPage-content-row ${
            pathname === "/account/address" && "active"
          }`}
        >
          <div className="AccountPage-content-img">
            <BsHouseDoor />
          </div>
          <p>Manage Address</p>
        </Link>
      </div>
      <div className="AccountPage-content-navigation-order-history">
        <div
          className={`AccountPage-content-row ${
            pathname === "/order-history" && "active"
          }`}
        >
          <div className="AccountPage-content-img">
            <RxCounterClockwiseClock />
          </div>
          <p>Order History</p>
        </div>
      </div>
      <div className="AccountPage-content-navigation-logout">
        <div
          className="AccountPage-content-row"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <div className="AccountPage-content-img-logout">
            <GoSignOut />
          </div>
          <p>Logout</p>
        </div>
      </div>
    </div>
  );
}
