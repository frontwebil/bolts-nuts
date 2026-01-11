import Image from "next/image";
import "../Footer/style.css";
import { TfiEmail } from "react-icons/tfi";
import { LINKS } from "@/generalConfigs/SITE_CONFIG";
import { LuPhone } from "react-icons/lu";
import Link from "next/link";

export function Footer() {
  return (
    <footer id="hide-fixed-buttons-anchor">
      <div className="footer-logo-mobile">
        <Image src={"/logo.PNG"} width={300} height={60} alt="Bolts-Nuts" />
      </div>
      <div className="container">
        <div className="footer-left-column">
          <div className="footer-logo">
            <Image src={"/logo.PNG"} width={300} height={60} alt="Bolts-Nuts" />
          </div>
          <div className="footer-left-column-content">
            <h3>contact us</h3>
            <div className="footer-left-column-content-row">
              <div className="footer-left-column-content-row-img">
                <TfiEmail />
              </div>
              <div className="footer-left-column-content-row-text">
                <h3>Email</h3>
                <Link href={`mailto:${LINKS.gmail}`}>{LINKS.gmail}</Link>
              </div>
            </div>
            <div className="footer-left-column-content-row">
              <div className="footer-left-column-content-row-img">
                <LuPhone />
              </div>
              <div className="footer-left-column-content-row-text">
                <h3>Phone Number</h3>
                <Link href={`tel:${LINKS.phone}`}>{LINKS.phone}</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-right-columns">
          <div className="footer-right-column">
            <h3>LEGAL</h3>
            <div className="footer-right-column-links">
              <Link href="/">Shipping</Link>
              <Link href="/">Terms</Link>
              <Link href="/">Warranty</Link>
              <Link href="/">Returns</Link>
              <Link href="/">Privacy & Data</Link>
            </div>
          </div>

          <div className="footer-right-column">
            <h3>NAVIGATION</h3>
            <div className="footer-right-column-links">
              <Link href="/">Catalogue</Link>
              <Link href="/">Search</Link>
              <Link href="/">FAQ</Link>
            </div>
          </div>

          <div className="footer-right-column">
            <h3>ABOUT</h3>
            <div className="footer-right-column-links">
              <Link href="/">Read about Bolts&Nuts</Link>
              <Link href="/">Careers</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="all-rights-reserved">© 2025. All rights reserved</div>
      </div>
    </footer>
  );
}
