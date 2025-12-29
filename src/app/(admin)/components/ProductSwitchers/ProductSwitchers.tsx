"use client";

import { setBooleanField } from "@/redux/admin/slices/addProduct";
import { RootState } from "@/redux/admin/store";
import { useDispatch, useSelector } from "react-redux";

export function ProductSwitchers() {
  const { isActive, isBestSeller, inStock } = useSelector(
    (store: RootState) => store.addProductSlice
  );
  const dispatch = useDispatch();

  return (
    <div className="mt-5 flex gap-10">
      <label className="flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isActive}
          onChange={() =>
            dispatch(setBooleanField({ field: "isActive", value: !isActive }))
          }
          className="sr-only" // ховаємо стандартний чекбокс
        />
        <div
          className={`
                w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 
                transition-colors duration-300
                ${isActive ? "bg-green-500" : "bg-gray-300"}
              `}
        >
          <div
            className={`
                  bg-white w-4 h-4 rounded-full shadow-md transform 
                  transition-transform duration-300
                  ${isActive ? "translate-x-5" : "translate-x-0"}
                `}
          />
        </div>
        <span className="ml-3 text-gray-700 font-medium">Active</span>
      </label>
      <label className="flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          checked={inStock}
          onChange={() =>
            dispatch(setBooleanField({ field: "inStock", value: !inStock }))
          }
          className="sr-only" // ховаємо стандартний чекбокс
        />
        <div
          className={`
                w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 
                transition-colors duration-300
                ${inStock ? "bg-green-500" : "bg-gray-300"}
              `}
        >
          <div
            className={`
                  bg-white w-4 h-4 rounded-full shadow-md transform 
                  transition-transform duration-300
                  ${inStock ? "translate-x-5" : "translate-x-0"}
                `}
          />
        </div>
        <span className="ml-3 text-gray-700 font-medium">In stock</span>
      </label>
      <label className="flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isBestSeller}
          onChange={() =>
            dispatch(
              setBooleanField({ field: "isBestSeller", value: !isBestSeller })
            )
          }
          className="sr-only" // ховаємо стандартний чекбокс
        />
        <div
          className={`
                w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 
                transition-colors duration-300
                ${isBestSeller ? "bg-green-500" : "bg-gray-300"}
              `}
        >
          <div
            className={`
                  bg-white w-4 h-4 rounded-full shadow-md transform 
                  transition-transform duration-300
                  ${isBestSeller ? "translate-x-5" : "translate-x-0"}
                `}
          />
        </div>
        <span className="ml-3 text-gray-700 font-medium">Bestseller</span>
      </label>
    </div>
  );
}
