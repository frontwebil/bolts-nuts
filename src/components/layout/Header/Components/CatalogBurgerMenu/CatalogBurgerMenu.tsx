import { CATEGORYES } from "@/generalConfigs/SITE_CONFIG";
import { RootState } from "@/redux/main/store";
import { useDispatch, useSelector } from "react-redux";
import "../CatalogBurgerMenu/style.css";
import { setAtiveCategory } from "@/redux/main/slices/uiSlice";
import { CatalogBurgerMenuCard } from "./CatalogBurgerMenuCard";

export function CatalogBurgerMenu() {
  const { isOpenCatalog, activeCategory } = useSelector(
    (store: RootState) => store.uiSlice
  );
  const dispatch = useDispatch();

  const handleChangeCategory = (category: string) => {
    dispatch(setAtiveCategory(category));
  };

  const cards = [
    {
      title: "DuraDrive #8 x 3 in.",
      subTitle: "Square Drive Deck Screws",
      price: "34.95",
      img: "/images/swiper-example/1.png",
    },
    {
      title: "DuraDrive #8 x 3 in.",
      subTitle: "Square Drive Deck Screws",
      price: "34.95",
      img: "/images/swiper-example/2.png",
    },
    {
      title: "DuraDrive #8 x 3 in.",
      subTitle: "Square Drive Deck Screws",
      price: "34.95",
      img: "/images/swiper-example/3.png",
    },
    {
      title: "DuraDrive #8 x 3 in.",
      subTitle: "Square Drive Deck Screws",
      price: "34.95",
      img: "/images/swiper-example/4.png",
    },
    {
      title: "DuraDrive #8 x 3 in.",
      subTitle: "Square Drive Deck Screws",
      price: "34.95",
      img: "/images/swiper-example/4.png",
    },
  ];

  return (
    <>
      <div className={`catalog-burger-menu ${isOpenCatalog ? "active" : ""}`}>
        <div className="container-catalog">
          <div className="catalog-burger-menu-content">
            <h3>All Categories</h3>
            <div className="catalog-burger-menu-content-categoryes">
              <div className="catalog-burger-menu-content-categoryes-column">
                {CATEGORYES.map((el, i) => (
                  <button
                    onMouseEnter={() => handleChangeCategory(el.category)}
                    key={i}
                  >
                    {el.category}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="catalog-burger-menu-content-cards">
            <h3>{activeCategory}</h3>
            <div className="catalog-burger-menu-content-cards-container">
              {cards.map((el, i) => (
                <CatalogBurgerMenuCard card={el} key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
