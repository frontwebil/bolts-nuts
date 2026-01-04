import Image from "next/image";
import "../productCard/style.css";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { ProductWithRelations } from "@/types/ProductType";
import Link from "next/link";
import { useState } from "react";

export function ProductCard({ data }: { data: ProductWithRelations }) {
  const [mainVariant, setMainVariant] = useState(
    data.options.find((el) => el.isMain) || data.options[0]
  );

  return (
    <Link href={`/product/${data.slug}`} className="ProductCard">
      <div className="ProductCard-top">
        <div className="ProductCard-img">
          <Image
            src={data.images[0]}
            width={256}
            height={256}
            alt={data.title}
          />
        </div>
        <div className="ProductCard-text">
          <h3>{data.title}</h3>
          <div className="ProductCard-counts">
            {data.options.map((el) => (
              <button
                key={el.id}
                onClick={(e) => {
                  e.preventDefault();
                  setMainVariant(el);
                }}
                className={`count-item ${
                  mainVariant.id === el.id ? "active" : ""
                }`}
              >
                {el.value}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="ProductCard-buttons">
        <div className="ProductCard-button-price">${mainVariant.price}</div>
        <div className="ProductCard-button-order">
          <PiShoppingCartSimpleBold />
          <p>Add</p>
        </div>
      </div>
    </Link>
  );
}
