"use client";

import CatalogCard from "./CatalogCard";
import { useEffect, useMemo, useState } from "react";
import { ProductWithRelations } from "@/types/ProductType";

const getProductPrice = (p: ProductWithRelations) => {
  if (!p.options || p.options.length === 0) return 0;

  const main = p.options.find((o) => o.isMain);
  if (main) return main.price;

  return Math.min(...p.options.map((o) => o.price));
};

export default function Catalog({
  products,
}: {
  products: ProductWithRelations[];
}) {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<
    "All" | "true" | "false"
  >("All");
  const [selectedStock, setSelectedStock] = useState<"All" | "true" | "false">(
    "All"
  );
  const [sortType, setSortType] = useState("Newest");

  useEffect(() => {
    if (!products) {
      return;
    }
  }, [products]);

  useEffect(() => setMounted(true), []);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const result = products.filter((p) => {
      const matchSearch =
        !term ||
        p.title.toLowerCase().includes(term) ||
        p.slug.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term);

      const matchCategory =
        selectedCategory === "All" || p.category === selectedCategory;

      const matchStatus =
        selectedStatus === "All" || p.isActive === (selectedStatus === "true");

      const matchStock =
        selectedStock === "All" || p.inStock === (selectedStock === "true");

      return matchSearch && matchCategory && matchStatus && matchStock;
    });

    if (sortType === "Newest") {
      return [...result].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    if (sortType === "Oldest") {
      return [...result].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    if (sortType === "Title") {
      return [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortType === "Price asc") {
      return [...result].sort(
        (a, b) => getProductPrice(a) - getProductPrice(b)
      );
    }

    if (sortType === "Price desc") {
      return [...result].sort(
        (a, b) => getProductPrice(b) - getProductPrice(a)
      );
    }

    return result;
  }, [
    products,
    searchTerm,
    selectedCategory,
    sortType,
    selectedStatus,
    selectedStock,
  ]);

  if (!mounted) return null;

  return (
    <section className="">
      <div className="mx-auto w-full px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mt-1 text-sm text-neutral-500">
              Manage products, prices, availability and visibility.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            {/* Search */}
            <div className="md:col-span-5">
              <label className="mb-1 block text-xs font-medium text-neutral-700">
                Search
              </label>
              <div className="relative">
                <input
                  placeholder="Search by title, slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    w-full rounded-xl border border-black/10
                    px-3 py-2.5 pr-10 text-sm
                    outline-none
                    focus:ring-2 focus:ring-neutral-900/10
                  "
                />
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  ⌕
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="md:col-span-3">
              <label className="mb-1 block text-xs font-medium text-neutral-700">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="
                  w-full rounded-xl border border-black/10
                  px-3 py-2.5 text-sm
                  outline-none
                  focus:ring-2 focus:ring-neutral-900/10
                "
              >
                <option value={"All"}>All categories</option>
                <option value={"Bolts / Screws"}>Bolts / Screws</option>
                <option value={"Anchors"}>Anchors</option>
              </select>
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-700">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as "All" | "true" | "false")
                }
                className="
                  w-full rounded-xl border border-black/10
                  px-3 py-2.5 text-sm
                  outline-none
                  focus:ring-2 focus:ring-neutral-900/10
                "
              >
                <option value="All">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Stock */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-700">
                Stock
              </label>
              <select
                value={selectedStock}
                onChange={(e) =>
                  setSelectedStock(e.target.value as "All" | "true" | "false")
                }
                className="
                  w-full rounded-xl border border-black/10
                  px-3 py-2.5 text-sm
                  outline-none
                  focus:ring-2 focus:ring-neutral-900/10
                "
              >
                <option value="All">All</option>
                <option value="true">In stock</option>
                <option value="false">Out of stock</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Quick toggles */}
            <div className="flex flex-wrap gap-2">
              {/* <span className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-medium text-neutral-700">
                Best sellers
              </span>
              <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-neutral-700">
                Recently added
              </span>
              <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-neutral-700">
                Discounted
              </span> */}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-neutral-600">
                Sort:
              </span>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="
                  rounded-xl border border-black/10
                  px-3 py-2 text-sm
                  outline-none
                  focus:ring-2 focus:ring-neutral-900/10
                "
              >
                <option value={"Newest"}>Newest</option>
                <option value={"Oldest"}>Oldest</option>
                <option value={"Title"}>Title (A-Z)</option>
                <option value={"Price asc"}>Price (low-high)</option>
                <option value={"Price desc"}>Price (high-low)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
          <div className="grid grid-cols-12 gap-3 border-b border-black/10 bg-black/2 px-4 py-3 text-xs font-semibold text-neutral-700">
            <div className="col-span-3">Product</div>
            <div className="col-span-1">Count of Options</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-1">Discount</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Date added</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {filteredProducts.map((el) => (
            <CatalogCard product={el} key={el.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
