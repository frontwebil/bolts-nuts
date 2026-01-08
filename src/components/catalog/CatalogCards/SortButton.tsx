import { setOrderByOption } from "@/redux/main/slices/productSlice";
import { openFilterMenu } from "@/redux/main/slices/uiSlice";
import { RootState } from "@/redux/main/store";
import { useEffect, useRef, useState } from "react";
import { PiCaretDownBold, PiFaders } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";

export function SortButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { sortBy, selectedSpecs, selectedCategory } = useSelector(
    (store: RootState) => store.productSlice
  );
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement | null>(null);

  const sortOptions = [
    "Best Selling",
    "Newest Arrivals",
    "Price: Low to High",
    "Price: High to Low",
  ];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const totalSelected = Object.values(selectedSpecs).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return (
    <div className="CatalogCards-top-end-content" ref={ref}>
      <div
        className="CatalogCards-top-end-content-filter-mobile"
        onClick={() => {
          setIsOpen(false);
          dispatch(openFilterMenu());
        }}
      >
        <PiFaders />
        <p>
          Filter{" "}
          <span className="font-semibold text-[#FF5A00]">
            ({selectedCategory ? totalSelected + 1 : totalSelected})
          </span>
        </p>
      </div>
      <div
        className="CatalogCards-sort-component"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="CatalogCards-sort-component-title">
          <p>Sort by:</p>
          <div className="CatalogCards-sort-component-title-sort-option">
            <p>{sortBy}</p>
            <PiCaretDownBold />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="CatalogCards-top-end-content-sort-select">
          {sortOptions.map((el, i) => {
            return (
              <div
                className={`CatalogCards-top-end-content-sort-select-button ${
                  sortBy == el && "active"
                }`}
                key={i}
                onClick={() => {
                  dispatch(setOrderByOption(el));
                  setIsOpen(false);
                }}
              >
                {el}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
