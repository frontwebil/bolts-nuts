import Image from "next/image";
import "../CategoryWrapper/style.css";
import { FaLongArrowAltRight } from "react-icons/fa";

export function CategoryWrapper() {
  const data = [
    {
      title: "NEW ARRIVALS",
      image: "/images/categories/bolts-categories.png",
    },
    {
      title: "TOP-PRODUCTS",
      image: "/images/categories/bolts-categories.png",
    },
    {
      title: "ON SALE",
      image: "/images/categories/bolts-categories.png",
    },
    {
      title: "RECOMMENDED",
      image: "/images/categories/bolts-categories.png",
    },
    {
      title: "CATALOGUE",
      image: "/images/categories/bolts-categories.png",
    },
  ];
  return (
    <section className="CategoryWrapper">
      {data.map((el) => (
        <div className="CategoryWrapper-block" key={el.title}>
          <h2 className="CategoryWrapper-block-top">{el.title}</h2>
          <div className="center-image">
            <div className="circle"></div>
            <Image src={el.image} alt={el.title} width={1000} height={1000} />
          </div>
          <div className="CategoryWrapper-block-bottom">
            <p>Shop now</p>
            <FaLongArrowAltRight />
          </div>
        </div>
      ))}
    </section>
  );
}
