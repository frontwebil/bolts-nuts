import { setSearchTerm } from "@/redux/main/slices/productSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getMainPin = (pins: any) => {
  return pins.find((p: any) => p.isMain) ?? pins[0];
};

export const getFinalPrice = (price: number, discount: number | null) => {
  if (!discount) return price;

  return (price - price * (discount / 100)).toFixed(2);
};

export function SearchCards({ filteredProducts }: { filteredProducts: any }) {
  const router = useRouter();
  const dispatch = useDispatch();
  return (
    <div className="header-search-resaults-content-cards">
      {filteredProducts.slice(0, 3).map((el: any) => {
        const mainPin = getMainPin(el.options);
        const finalPrice = getFinalPrice(mainPin.price, mainPin.discount);
        return (
          <div
            onMouseDown={() => {
              dispatch(setSearchTerm(""));
              router.replace(`/product/${el.slug}`);
            }}
            className="header-search-resaults-content-card"
            key={el.id}
          >
            <div className="header-search-resaults-content-card-image">
              <Image src={el.images[0]} alt={el.title} width={70} height={70} />
            </div>
            <div className="header-search-resaults-content-card-text">
              <h2>{el.title}</h2>
              <p>${finalPrice}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
