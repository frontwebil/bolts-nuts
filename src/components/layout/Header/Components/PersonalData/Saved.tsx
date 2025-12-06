import { useWindowWidth } from "@/hooks/useWidth";
import { FaRegBookmark } from "react-icons/fa";

export default function Saved() {
  const width = useWindowWidth();
  return (
    <div className="header-personal-data-column">
      <div className="header-personal-data-top-row">
        <FaRegBookmark />
        <h3>
          Saved{" "}
          {width !== 0 && width && width < 1100 && (
            <span className="header-personal-data-top-row-count">(0)</span>
          )}
        </h3>
      </div>
      <div className="header-personal-data-bottom-row">
        <p className="header-personal-data-bottom-row-text">(0) added</p>
      </div>
    </div>
  );
}
