"use client";

import { useRouter } from "next/navigation";
import { MdKeyboardArrowRight } from "react-icons/md";
import "./style.css";

type BreadcrumbItem = {
  title: string;
  href?: string;
  onClick?: () => void;
};

type Props = {
  links: BreadcrumbItem[];
};

export function ProductBreadcrums({ links }: Props) {
  const router = useRouter();

  const handleClick = (item: BreadcrumbItem) => {
    if (item.onClick) item.onClick(); // ✅ спочатку свій onClick
    if (item.href) router.replace(item.href); // ✅ або replace, як хочеш
  };

  return (
    <div className="breadcrumbs">
      <nav className="breadcrumbs-row">
        {links.map((item, index) => {
          const isLast = index === links.length - 1;
          const isClickable = !!item.href || !!item.onClick;

          return isLast ? (
            <div
              key={index}
              className="breadcrumb-item active"
              style={{
                textWrap: "nowrap",
                overflow: "hidden",
              }}
            >
              {item.title}
            </div>
          ) : (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(item)}
              className={`breadcrumb-item ${
                isClickable ? "cursor-pointer" : ""
              }`}
              disabled={!isClickable}
            >
              {item.title}
              <MdKeyboardArrowRight className="breadcrumb-separator" />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
