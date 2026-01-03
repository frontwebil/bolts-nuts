import { closeBurger } from "@/redux/main/slices/uiSlice";
import { ProductWithRelations } from "@/types/ProductType";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export function CatalogBurgerMenuCard({
  card,
}: {
  card: ProductWithRelations;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(closeBurger());
    router.replace(`/product/${card.slug}`);
  };

  return (
    <div
      className="CatalogBurgerMenuCard cursor-pointer"
      onClick={() => handleClick()}
    >
      <div className="CatalogBurgerMenuCard-img">
        <Image src={card.images[0]} alt={card.title} width={300} height={300} />
      </div>
      <h2>{card.title}</h2>
    </div>
  );
}
