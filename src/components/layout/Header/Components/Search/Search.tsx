import { RootState } from "@/redux/main/store";
import "./style.css";

import { useMemo, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchTerm,
  setSelectedCategory,
} from "@/redux/main/slices/productSlice";
import { ShowHints } from "./ShowHints";
import { useRouter } from "next/navigation";
import { SearchCards } from "./SearchCards";
import { PiArrowLineUpRightBold } from "react-icons/pi";

export function Search() {
  const [isFocused, setIsFocused] = useState(false);
  const { searchTerm, products } = useSelector(
    (store: RootState) => store.productSlice,
  );
  const router = useRouter();

  const dispatch = useDispatch();

  const highlightMatch = (text: string, term: string) => {
    if (!term) return text;

    const lowerText = text.toLowerCase();
    const lowerTerm = term.toLowerCase();

    const index = lowerText.indexOf(lowerTerm);

    if (index === -1) return text;

    return (
      <>
        {text.slice(0, index)}
        <mark className="search-highlight">
          {text.slice(index, index + term.length)}
        </mark>
        {text.slice(index + term.length)}
      </>
    );
  };

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term || term.length < 3) return [];

    return products.filter((product) => {
      const titleMatch = product.title.toLowerCase().includes(term);

      const descriptionMatch = product.description.toLowerCase().includes(term);

      return titleMatch || descriptionMatch;
    });
  }, [searchTerm, products]);

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term || term.length < 2) return [];

    const map = new Map<string, number>();

    products.forEach((p) => {
      const cat = p.category; // або p.categories[0]

      if (!cat) return;

      const matchesCategory = cat.toLowerCase().includes(term);
      const matchesProduct =
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term);

      // Рахуємо тільки релевантні
      if (matchesCategory || matchesProduct) {
        map.set(cat, (map.get(cat) || 0) + 1);
      }
    });

    return Array.from(map.entries()).map(([category, count]) => ({
      category,
      count,
    }));
  }, [searchTerm, products]);

  const showResults = filteredProducts.length > 0;

  return (
    <div className="header-search">
      <input
        type="text"
        placeholder="Search ..."
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={searchTerm}
        onChange={(e) => {
          dispatch(setSearchTerm(e.target.value));
        }}
      />

      <IoIosSearch />

      {isFocused && (
        <div className="header-search-resaults">
          <ShowHints
            searchTerm={searchTerm}
            filteredProducts={filteredProducts}
          />

          {/* 4) Есть результаты */}
          {showResults && (
            <>
              <div className="header-search-resaults-content">
                <div className="header-search-resaults-top">Suggestions</div>
                <div className="header-search-resaults-content-cards">
                  {filteredCategories.map((el, i) => (
                    <div
                      key={i}
                      className="header-search-resaults-content-card-categoryes"
                      onMouseDown={() => {
                        dispatch(setSelectedCategory(el.category));
                        setIsFocused(false);
                        dispatch(setSearchTerm(""));
                        router.replace("/catalog");
                      }}
                    >
                      <span className="suggestion-name">
                        {highlightMatch(el.category, searchTerm)}
                      </span>
                      <p className="suggestion-count">({el.count})</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="header-search-resaults-content">
                <div className="header-search-resaults-top">Products</div>
                <SearchCards filteredProducts={filteredProducts} />
              </div>
              <div
                className="header-search-resaults-see-all-results"
                onMouseDown={() => {
                  dispatch(setSearchTerm(""));
                  router.replace(
                    `/catalog?searchParams=${encodeURIComponent(searchTerm)}`,
                  );
                }}
              >
                <p>See all results</p>
                <PiArrowLineUpRightBold />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
