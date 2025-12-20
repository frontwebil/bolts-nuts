"use client";

import { useRouter } from "next/navigation";
import { MdKeyboardArrowRight } from "react-icons/md";
import "./style.css";

type BreadcrumbItem = {
  title: string;
  href?: string;
};

type Props = {
  links: BreadcrumbItem[];
};

export function Breadcrums({ links }: Props) {
  const router = useRouter();

  const handleReplace = (item: BreadcrumbItem) => {
    if (item.href) {
      router.replace(item.href);
    }
  };

  return (
    <div className="breadcrumbs">
        <nav className="breadcrumbs-row">
          {links.map((item, index) => {
            const isLast = index === links.length - 1;
            const isClickable = !!item.href;

            return isLast ? (
              <div key={index} className="breadcrumb-item active">
                {item.title}
              </div>
            ) : (
              <button
                key={index}
                onClick={() => handleReplace(item)}
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
