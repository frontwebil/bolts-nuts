import "../HeaderAdmin/style.css";

export function HeaderAdmin() {
  return (
    <header className="flex items-center justify-between mb-6 py-5">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Catalog
        </h1>
      </div>

      <button className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 active:scale-95">
        Add product
      </button>
    </header>
  );
}
