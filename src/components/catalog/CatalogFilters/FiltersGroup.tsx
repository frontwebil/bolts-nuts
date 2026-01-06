import { toggleSpecValue } from "@/redux/main/slices/productSlice";
import { RootState } from "@/redux/main/store";
import { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { PiCaretDownBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";

export default function FiltersGroup({
  label,
  values,
}: {
  label: string;
  values: string[];
}) {
  const { selectedSpecs } = useSelector(
    (store: RootState) => store.productSlice
  );
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

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
        <h2>{label}</h2>
        <PiCaretDownBold className={`arrow ${isOpen ? "open" : ""}`} />
      </div>

      <div
        ref={contentRef}
        className={`filter-content-group-buttons ${isOpen ? "open" : ""}`}
      >
        {values.map((el, i) => (
          <div className="filter-content-button-wrapper" key={i}>
            <div
              className="filter-content-button-wrapper-left-withinput"
              onClick={() =>
                dispatch(toggleSpecValue({ key: label, value: el }))
              }
            >
              <div
                className={`filter-content-button-wrapper-custom-input ${
                  selectedSpecs[label].includes(el) && "active"
                }`}
              >
                <FaCheck />
              </div>
              <button>{el}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
