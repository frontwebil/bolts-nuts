import { useWindowWidth } from "@/hooks/useWidth";
import { useState } from "react";
import { PiCaretDownBold } from "react-icons/pi";

export function CatalogMenu() {
  const [isOpenCatalog, setIsOpenCatalog] = useState(false);
  const width = useWindowWidth();

  if (!width) return null;

  return (
    <div className="catalog-menu">
      {width && width > 960 ? (
        <div
          className="catalog-menu-button"
          onClick={() => setIsOpenCatalog(!isOpenCatalog)}
        >
          <p className="font-bold uppercase">
            Сatalogue <span className="catalog-menu-hidden">menu</span>
          </p>
          <PiCaretDownBold />
        </div>
      ) : (
        <div
          className={`catalog-menu-button-burger ${
            isOpenCatalog ? "active" : ""
          }`}
          onClick={() => {
            setIsOpenCatalog(!isOpenCatalog);
          }}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      )}
    </div>
  );
}
