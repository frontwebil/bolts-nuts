"use client";

import { signOut } from "next-auth/react";

export default function AccountPage() {
  return (
    <section className="AccountPage">
      <div className="container">
        <div
          className="my-10 p-5 bg-amber-100 w-max"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          logout
        </div>
      </div>
    </section>
  );
}
