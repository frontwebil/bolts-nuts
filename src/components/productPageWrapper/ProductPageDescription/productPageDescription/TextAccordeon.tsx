import { useEffect, useRef, useState } from "react";
import { PiCaretDownBold } from "react-icons/pi";

export function TextAccordeon({
  title,
  text,
  isOpenByDefault,
}: {
  title: string;
  text: string;
  isOpenByDefault: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(isOpenByDefault);

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
    <div className="ProductPageDescription-accordeon">
      <div
        className="ProductPageDescription-accordeon-title"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p>{title}</p>
        <PiCaretDownBold className={`arrow ${isOpen ? "open" : ""}`} />
      </div>
      <div
        ref={contentRef}
        className={`ProductPageDescription-accordeon-content ${
          isOpen ? "active" : ""
        }`}
      >
        <div
          className="ProductPageDescription-accordeon-content-text"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
