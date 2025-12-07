import { CATEGORYES } from "@/generalConfigs/SITE_CONFIG";
import "../PopularSearch/style.css";

export function PopularSearch() {
  return (
    <div className="PopularSearch">
      <h3>Popular searches:</h3>
      <div className="PopularSearch-row-blocks">
        {CATEGORYES.map((el, i) => (
          <div className="PopularSearch-block" key={i}>
            {el.category}
          </div>
        ))}
      </div>
    </div>
  );
}
