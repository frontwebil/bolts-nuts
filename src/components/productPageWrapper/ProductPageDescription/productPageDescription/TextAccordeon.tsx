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
    setIsOpen(isOpenByDefault);
  }, [isOpenByDefault, title]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isOpen) {
      el.style.maxHeight = el.scrollHeight + "px";
    } else {
      el.style.maxHeight = "0px";
    }
  }, [isOpen, text, title]);

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
