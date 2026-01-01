"use client";

import { RootState } from "@/redux/admin/store";
import { setTextField } from "@/redux/admin/slices/Product";
import { useDispatch, useSelector } from "react-redux";

export function ProductGeneralInfo() {
  const { title, description, anotherInfo, productGroup } = useSelector(
    (store: RootState) => store.ProductSlice
  );
  const dispatch = useDispatch();

  return (
    <div className="mt-5 space-y-4">
      {/* Product group */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product group
        </label>
        <input
          required
          type="text"
          value={productGroup}
          onChange={(e) =>
            dispatch(
              setTextField({ field: "productGroup", value: e.target.value })
            )
          }
          placeholder="Product group — used to display other size options of the same product"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black-500"
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product title
        </label>
        <input
          required
          type="text"
          value={title}
          onChange={(e) =>
            dispatch(setTextField({ field: "title", value: e.target.value }))
          }
          placeholder="Enter product title"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product description
        </label>
        <textarea
          required
          value={description}
          onChange={(e) =>
            dispatch(
              setTextField({ field: "description", value: e.target.value })
            )
          }
          placeholder="Enter product description"
          rows={4}
          className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Another Info
        </label>
        <textarea
          required
          value={anotherInfo}
          onChange={(e) =>
            dispatch(
              setTextField({ field: "anotherInfo", value: e.target.value })
            )
          }
          placeholder="Enter product description"
          rows={4}
          className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black-500"
        />
      </div>
    </div>
  );
}
