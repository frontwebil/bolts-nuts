import Image from "next/image";
import "../productCard/style.css";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { ProductWithRelations } from "@/types/ProductType";
import Link from "next/link";

export function ProductCard({ data }: { data: ProductWithRelations }) {
  const mainVariant = data.options.filter((el) => el.isMain);
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
          <p>{data.brandName}</p>
        </div>
      </div>
      <div className="ProductCard-buttons">
        <div className="ProductCard-button-price">${mainVariant[0].price}</div>
        <div className="ProductCard-button-order">
          <PiShoppingCartSimpleBold />
          <p>Add</p>
        </div>
      </div>
    </Link>
  );
}
