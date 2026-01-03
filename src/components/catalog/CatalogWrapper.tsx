import { CatalogFilters } from "./CatalogFilters/CatalogFilters";
import "../catalog/style.css";
import { Breadcrums } from "../breadcrums/Breadcrums";
import { CatalogCardsContainer } from "./CatalogCards/CatalogCards";

export function CatalogWrapper() {
  return (
    <div className="CatalogWrapper">
      <Breadcrums
        links={[{ title: "Home", href: "/" }, { title: "Catalog" }]}
      />
      <div className="CatalogWrapper-flex">
        <CatalogFilters />
        <CatalogCardsContainer />
      </div>
    </div>
  );
}
