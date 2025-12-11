import { useWindowWidth } from "@/hooks/useWidth";
import { toggleBurger } from "@/redux/main/slices/uiSlice";
import { RootState } from "@/redux/main/store";
import { PiCaretDownBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";

export function CatalogMenu() {
  const { isOpenCatalog } = useSelector((store: RootState) => store.uiSlice);
  const dispatch = useDispatch();
  const width = useWindowWidth();

  if (!width) return null;

  const HandleToggleBurger = () => {
    dispatch(toggleBurger());
  };

  return (
    <div className="catalog-menu">
      {width && width > 960 ? (
        <div
          className={`catalog-menu-button ${isOpenCatalog && "active"}`}
          onClick={() => HandleToggleBurger()}
        >
          <p className="font-bold uppercase">
            Сatalogue <span className="catalog-menu-hidden">menu</span>
          </p>
          <PiCaretDownBold />
        </div>
      ) : (
        <div
          className={`catalog-menu-button-burger ${
            isOpenCatalog ? "active" : ""
          }`}
          onClick={() => HandleToggleBurger()}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      )}
    </div>
  );
}
