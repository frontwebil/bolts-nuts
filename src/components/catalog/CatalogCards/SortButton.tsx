import { setOrderByOption } from "@/redux/main/slices/productSlice";
import { RootState } from "@/redux/main/store";
import { useState } from "react";
import { PiCaretDownBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";

export function SortButton() {
  const [isOpen, setIsOpen] = useState(true);
  const { sortBy } = useSelector((store: RootState) => store.productSlice);
  const dispatch = useDispatch();

  const sortOptions = [
    "Best Selling",
    "Newest Arrivals",
    "Price: Low to High",
    "Price: High to Low",
  ];

  return (
    <div className="CatalogCards-top-end-content">
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
                className="CatalogCards-top-end-content-sort-select-button"
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
