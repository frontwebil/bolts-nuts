import { RootState } from "@/redux/main/store";
import { useDispatch, useSelector } from "react-redux";
import { SelectedFilters } from "./SelectedFilters";
import { SelectedCategory } from "./SelectedCategory";
import FiltersGroup from "./FiltersGroup";
import { closeFilterMenu } from "@/redux/main/slices/uiSlice";
import { IoClose } from "react-icons/io5";
import { useEffect } from "react";
import { resetFilters } from "@/redux/main/slices/productSlice";
import "../CatalogFilters/style.css";

export function CatalogFiltersMobile() {
  const { filtersSpecs } = useSelector(
    (store: RootState) => store.productSlice
  );

  const { isOpenFilterMenu } = useSelector((store: RootState) => store.uiSlice);

  useEffect(() => {
    if (isOpenFilterMenu) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => document.body.classList.remove("no-scroll");
  }, [isOpenFilterMenu]);

  const dispatch = useDispatch();
  return (
    <>
      <div className={`CatalogFilters ${isOpenFilterMenu && "active"}`}>
        <div className="CatalogFilters-top">
          <h3>Filter</h3>
          <IoClose
            className="CatalogFilters-top-img-close"
            onClick={() => dispatch(closeFilterMenu())}
          />
        </div>
        <div className="CatalogFilters-content">
          <SelectedFilters />
          <SelectedCategory />
          {Object.entries(filtersSpecs).map((row, i) => {
            return <FiltersGroup key={i} values={row[1]} label={row[0]} />;
          })}
        </div>
        <div className="CatalogFilters-content-buttons">
          <div
            className="CatalogFilters-content-buttons-apply"
            onClick={() => dispatch(closeFilterMenu())}
          >
            Apply Filters
          </div>
          <div
            className="CatalogFilters-content-buttons-reset"
            onClick={() => {
              dispatch(resetFilters());
              dispatch(closeFilterMenu());
            }}
          >
            Reset All
          </div>
        </div>
      </div>
      {isOpenFilterMenu && (
        <div
          className="opacity-background"
          onClick={() => {
            dispatch(closeFilterMenu());
          }}
        ></div>
      )}
    </>
  );
}
