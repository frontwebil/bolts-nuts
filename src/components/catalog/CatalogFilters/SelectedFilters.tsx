import { setSelectedCategory } from "@/redux/main/slices/productSlice";
import { RootState } from "@/redux/main/store";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

export function SelectedFilters() {
  const { selectedCategory } = useSelector(
    (store: RootState) => store.productSlice
  );
  const dispatch = useDispatch();

  if (!selectedCategory && selectedCategory.trim() == "") {
    return null;
  }

  return (
    <div className="filter-selected-content-group">
      <div className="filter-content-group-title">
        <h2>Selected Filters</h2>
      </div>

      <div className="filter-selected-content-button-wrapper">
        <button
          onClick={() => dispatch(setSelectedCategory(""))}
          className="filter-selected-content-button-wrapper-button"
        >
          {selectedCategory}
          <IoClose />
        </button>
      </div>
    </div>
  );
}
