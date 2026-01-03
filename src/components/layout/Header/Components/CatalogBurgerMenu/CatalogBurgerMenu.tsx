import { CATEGORYES } from "@/generalConfigs/SITE_CONFIG";
import { RootState } from "@/redux/main/store";
import { useDispatch, useSelector } from "react-redux";
import "../CatalogBurgerMenu/style.css";
import { closeBurger, setAtiveCategory } from "@/redux/main/slices/uiSlice";
import { CatalogBurgerMenuCard } from "./CatalogBurgerMenuCard";
import { useWindowWidth } from "@/hooks/useWidth";
import { useEffect } from "react";
import { PiShoppingCartSimpleBold, PiUserCircle } from "react-icons/pi";
import { FaRegBookmark } from "react-icons/fa";
import Loader from "@/components/loader/Loader";
import { setSelectedCategory } from "@/redux/main/slices/productSlice";
import { useRouter } from "next/navigation";

const getCardsCount = (width: number) => {
  if (width >= 1550) return 5;
  if (width >= 1260) return 4;
  if (width >= 1020) return 3;
  if (width >= 960) return 2;
  if (width >= 500) return 4;
  return 0;
};

export function CatalogBurgerMenu() {
  const { isOpenCatalog, activeCategory } = useSelector(
    (store: RootState) => store.uiSlice
  );
  const dispatch = useDispatch();
  const screenWidth = useWindowWidth();
  const cardsToShows = getCardsCount(screenWidth!);
  const handleChangeCategory = (category: string) => {
    dispatch(setAtiveCategory(category));
  };
  const router = useRouter();

  const { products } = useSelector((store: RootState) => store.productSlice);

  const cardsToShowCategoryes = products.filter(
    (el) => el.category == activeCategory
  );

  useEffect(() => {
    if (isOpenCatalog) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => document.body.classList.remove("no-scroll");
  }, [isOpenCatalog]);

  useEffect(() => {
    if (!screenWidth) return;

    if (screenWidth < 960 && activeCategory !== "Bestsellers") {
      dispatch(setAtiveCategory("Bestsellers"));
    }
  }, [screenWidth, activeCategory, dispatch]);

  return (
    <>
      <div className={`catalog-burger-menu ${isOpenCatalog ? "active" : ""}`}>
        <div className="container-catalog">
          {screenWidth && screenWidth <= 500 && (
            <div className="mobile-funcional-buttons">
              <div className="mobile-funcional-button-row">
                <div className="mobile-funcional-button-row-content">
                  <PiUserCircle />
                  <p>Personal Account</p>
                </div>
              </div>
              <div className="mobile-funcional-button-row">
                <div className="mobile-funcional-button-row-content">
                  <FaRegBookmark height={17} />
                  <p>Personal Account</p>
                </div>
                <p className="mobile-funcional-button-row-count">0 items</p>
              </div>
              <div className="mobile-funcional-button-row">
                <div className="mobile-funcional-button-row-content">
                  <PiShoppingCartSimpleBold />
                  <p>Cart</p>
                </div>
                <p className="mobile-funcional-button-row-count">0 items</p>
              </div>
            </div>
          )}
          <div className="catalog-burger-menu-content">
            <h3>All Categories</h3>
            <div className="catalog-burger-menu-content-categoryes">
              <div className="catalog-burger-menu-content-categoryes-column">
                {CATEGORYES.map((el, i) => (
                  <button
                    onMouseEnter={() => handleChangeCategory(el.category)}
                    onClick={() => {
                      dispatch(setSelectedCategory(el.category));
                      dispatch(closeBurger());
                      router.replace("/catalog");
                    }}
                    key={i}
                    className={`${
                      el.category === activeCategory ? "active" : ""
                    }`}
                  >
                    {el.category}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {cardsToShowCategoryes.length <= 0 ? (
            <Loader />
          ) : (
            <div className="catalog-burger-menu-content-cards">
              <h3>{activeCategory}</h3>

              <div className="catalog-burger-menu-content-cards-container">
                {cardsToShowCategoryes.slice(0, cardsToShows).map((el, i) => (
                  <CatalogBurgerMenuCard card={el} key={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
