/* eslint-disable @typescript-eslint/no-explicit-any */
export function ShowHints({
  searchTerm,
  filteredProducts,
}: {
  searchTerm: string;
  filteredProducts: any;
}) {
  const term = searchTerm.trim();

  const showEmptyHint = term.length === 0;
  const showMinCharsHint = term.length > 0 && term.length < 3;
  const showNoResults = term.length >= 3 && filteredProducts.length === 0;
  return (
    <>
      {/* 1) Ничего не введено */}
      {showEmptyHint && (
        <div className="search-hint">
          <p>Start typing to search products</p>
        </div>
      )}

      {/* 2) Мало символов */}
      {showMinCharsHint && (
        <div className="search-hint">
          <p>Enter at least 3 characters</p>
        </div>
      )}

      {/* 3) Ничего не найдено */}
      {showNoResults && (
        <div className="search-hint">
          <p>We couldn’t find any matches for your search Please try again</p>
        </div>
      )}
    </>
  );
}
