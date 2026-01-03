import { CATEGORYES } from "@/generalConfigs/SITE_CONFIG";
import { setSelectedCategory } from "@/redux/main/slices/productSlice";
import { RootState } from "@/redux/main/store";
import { useState, useRef, useEffect } from "react";
import { PiCaretDownBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";

export function SelectedCategory() {
  const { selectedCategory } = useSelector(
    (store: RootState) => store.productSlice
  );

  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      contentRef.current.style.maxHeight =
        contentRef.current.scrollHeight + "px";
    } else {
      contentRef.current.style.maxHeight = "0px";
    }
  }, [isOpen]);

  return (
    <div className="filter-content-group">
      <div
        className="filter-content-group-title"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h2>Category</h2>
        <PiCaretDownBold className={`arrow ${isOpen ? "open" : ""}`} />
      </div>

      <div
        ref={contentRef}
        className={`filter-content-group-buttons ${isOpen ? "open" : ""}`}
      >
        {CATEGORYES.map((el, i) => (
          <button
            key={i}
            onClick={() => dispatch(setSelectedCategory(el.category))}
            className={el.category === selectedCategory ? "active" : ""}
          >
            {el.category}
          </button>
        ))}
      </div>
    </div>
  );
}
