import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PiCaretDownBold } from "react-icons/pi";

export function DeliveryAccordeon() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true);

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
        <p>Available Shipping Method(s)</p>
        <PiCaretDownBold className={`arrow ${isOpen ? "open" : ""}`} />
      </div>
      <div
        ref={contentRef}
        className={`ProductPageDescription-accordeon-content ${
          isOpen ? "active" : ""
        }`}
      >
        <div className="ProductPageDescription-delivery">
          <div className="ProductPageDescription-delivery-card">
            <Image
              src={"/icons/delivery.svg"}
              width={54}
              height={54}
              alt="Shipping Method"
            />
            <h3>Parcel Shipping</h3>
            {/* <p>Description</p> */}
          </div>
          <div className="ProductPageDescription-delivery-card">
            <Image
              src={"/icons/package.svg"}
              width={54}
              height={54}
              alt="Shipping Method"
            />
            <h3>Local couriers</h3>
            {/* <p>Description</p> */}
          </div>
          <div className="ProductPageDescription-delivery-card">
            <Image
              src={"/icons/delivery.svg"}
              width={54}
              height={54}
              alt="Shipping Method"
            />
            <h3>fast shipping</h3>
            {/* <p>Description</p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
