import { CATEGORYES } from "@/generalConfigs/SITE_CONFIG";
import { setSelectedCategory } from "@/redux/main/slices/productSlice";
import { RootState } from "@/redux/main/store";
import { useState, useRef, useEffect } from "react";
import { PiCaretDownBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";

export function SelectedCategory() {
  const { selectedCategory, products } = useSelector(
    (store: RootState) => store.productSlice
  );

  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const categoryMap = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
          <div className="filter-content-button-wrapper" key={i}>
            <button
              onClick={() => dispatch(setSelectedCategory(el.category))}
              className={el.category === selectedCategory ? "active" : ""}
            >
              {el.category}
            </button>
            <p>({categoryMap[el.category] ? categoryMap[el.category] : 0})</p>
          </div>
        ))}
      </div>
    </div>
  );
}
