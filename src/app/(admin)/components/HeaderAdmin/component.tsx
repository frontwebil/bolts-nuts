import Link from "next/link";
import "../HeaderAdmin/style.css";

export function HeaderAdmin() {
  return (
    <header className="flex items-center justify-between mb-6 py-5">
      <Link href={"/admin-page-21sQsafaboltsnuts"} className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Catalog
        </h1>
      </Link>

      <div className="flex gap-2">
        <Link
          href={"/admin-page-21sQsafaboltsnuts/addProduct"}
          className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 active:scale-95"
        >
          Add product
        </Link>
        <Link
          href={"/admin-page-21sQsafaboltsnuts/orders"}
          className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 active:scale-95"
        >
          Orders
        </Link>
      </div>
    </header>
  );
}
