import { CatalogWrapper } from "@/components/catalog/CatalogWrapper";
import Loader from "@/components/loader/Loader";
import { Suspense } from "react";

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
