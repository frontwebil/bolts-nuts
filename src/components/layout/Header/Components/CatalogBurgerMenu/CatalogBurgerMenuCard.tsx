import { ProductWithRelations } from "@/types/ProductType";
import Image from "next/image";

export function CatalogBurgerMenuCard({
  card,
}: {
  card: ProductWithRelations;
}) {
  return (
    <div className="CatalogBurgerMenuCard">
      <div className="CatalogBurgerMenuCard-img">
        <Image src={card.images[0]} alt={card.title} width={300} height={300} />
      </div>
      <h2>{card.title}</h2>
    </div>
  );
}
