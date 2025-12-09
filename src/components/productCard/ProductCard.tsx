/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import "../productCard/style.css";
import { PiShoppingCartSimpleBold } from "react-icons/pi";

export function ProductCard({ data }: { data: any }) {
  return (
    <div className="ProductCard">
      <div className="ProductCard-top">
        <div className="ProductCard-img">
          <Image src={data.img} width={256} height={256} alt={data.title} />
        </div>
        <div className="ProductCard-text">
          <h3>{data.title}</h3>
          <p>{data.subTitle}</p>
        </div>
      </div>
      <div className="ProductCard-buttons">
        <div className="ProductCard-button-price">${data.price}</div>
        <div className="ProductCard-button-order">
          <PiShoppingCartSimpleBold />
          <p>Add</p>
        </div>
      </div>
    </div>
  );
}
