"use client";

import { signOut } from "next-auth/react";

export function AdminAlert() {
  return (
    <div className="mt-40 flex justify-center">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg text-center">
        <h1 className="mb-10 text-2xl font-bold text-gray-900">
          You logged as Admin
        </h1>

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            className="w-full rounded-xl border border-gray-300 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
