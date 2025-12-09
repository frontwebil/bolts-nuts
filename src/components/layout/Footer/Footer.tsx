import Image from "next/image";
import "../Footer/style.css";

export function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-left-column">
          <div className="footer-logo">
            <Image src={"/logo.svg"} width={300} height={60} alt="Bolts-Nuts" />
          </div>
          <div className="footer-left-column-content"></div>
        </div>
      </div>
    </footer>
  );
}
