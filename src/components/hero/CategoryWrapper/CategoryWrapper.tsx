"use client";

import Image from "next/image";
import "../CategoryWrapper/style.css";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

export function CategoryWrapper() {
  const router = useRouter();
  const data = [
    {
      title: "NEW ARRIVALS",
      image: "/images/categories/bolts-categories.png",
      onclick: () => {
        router.replace("/catalog?type=new-arrivals");
      },
    },
    {
      title: "TOP-PRODUCTS",
      image: "/images/categories/bolts-categories.png",
      onclick: () => {
        router.replace("/catalog?type=bestseller");
      },
    },
    {
      title: "ON SALE",
      image: "/images/categories/bolts-categories.png",
      onclick: () => {
        router.replace("/catalog?type=on-sale");
      },
    },
    {
      title: "RECOMMENDED",
      image: "/images/categories/bolts-categories.png",
      onclick: () => {
        router.replace("/catalog?type=recommended");
      },
    },
    {
      title: "CATALOGUE",
      image: "/images/categories/bolts-categories.png",
      onclick: () => {
        router.replace("/catalog");
      },
    },
  ];
  return (
    <section className="CategoryWrapper">
      {data.map((el) => (
        <div
          onClick={el.onclick}
          className="CategoryWrapper-block"
          key={el.title}
        >
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
