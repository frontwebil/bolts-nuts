"use client";

import { CATEGORY_TEMPLATES } from "@/generalConfigs/CATEGORY_TEMPLATE";
import { setSelectedCategoryId } from "@/redux/admin/slices/addProduct";
import { RootState } from "@/redux/admin/store";
import { useDispatch, useSelector } from "react-redux";

export function ChooseCategory() {
  const { selectedCategoryId } = useSelector(
    (store: RootState) => store.addProductSlice
  );
  const dispatch = useDispatch();

  const handleUpdateCategory = (category: string) => {
    const normalName = CATEGORY_TEMPLATES.find((c) => c.id === category)?.title;

    dispatch(setSelectedCategoryId({ category, normalName }));
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Category</h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose a category to load product specifications
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-700">
          Product category
        </label>

        <select
          value={selectedCategoryId}
          onChange={(e) => handleUpdateCategory(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-0"
        >
          <option value="" disabled>
            Select category
          </option>

          {CATEGORY_TEMPLATES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

      {selectedCategoryId && (
        <>
          <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
            Selected category:&nbsp;
            <span className="font-semibold text-gray-900">
              {
                CATEGORY_TEMPLATES.find((c) => c.id === selectedCategoryId)
                  ?.title
              }
            </span>
          </div>
        </>
      )}
    </div>
  );
}
