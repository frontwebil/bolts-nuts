import Image from "next/image";

type Card = {
  title: string;
  subTitle: string;
  price: string;
  img: string;
};

export function CatalogBurgerMenuCard({ card }: { card: Card }) {
  return (
    <div className="CatalogBurgerMenuCard">
      <div className="CatalogBurgerMenuCard-container">
        <Image src={card.img} alt={card.title} width={190} height={190} />
      </div>
      <h2>{card.title}</h2>
    </div>
  );
}
