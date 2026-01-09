import { CatalogWrapper } from "@/components/catalog/CatalogWrapper";
import Loader from "@/components/loader/Loader";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Product Catalog | Buy Online",
  description:
    "Browse our complete product catalog with up-to-date prices, discounts, and fast delivery. Shop online with ease.",
};

export default function page() {
  return (
    <Suspense
      fallback={
        <div className="h-[80vh]">
          <Loader />
        </div>
      }
    >
      <div className="container">
        <CatalogWrapper />
      </div>
    </Suspense>
  );
}
