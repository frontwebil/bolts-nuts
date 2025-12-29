"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/admin/store";
import {
  addOption,
  removeOption,
  updateOptionField,
  setMainOption,
  moveOption,
} from "@/redux/admin/slices/addProduct";

// ✅ Category template label (later you can pull it from CATEGORY_TEMPLATES by selectedCategoryId)
const OPTION_LABEL_FROM_TEMPLATE = "Number of pieces per package";

export function ProductOptionsManager() {
  const { options } = useSelector((s: RootState) => s.addProductSlice);
  const dispatch = useDispatch();

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Options</h2>
          <p className="mt-1 text-sm text-gray-500">
            Add package options (e.g., 100 / 250 / 500 pieces).
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch(addOption())}
          className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Add option
        </button>
      </div>

      {options.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
          No options yet. Click <b>“Add option”</b> to create the first one.
        </div>
      ) : (
        <div className="space-y-3">
          {options.map((opt, idx) => (
            <div key={opt.clientId} className="rounded-xl border p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {opt.isMain ? (
                    <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Main
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => dispatch(setMainOption(opt.clientId))}
                      className="rounded-md border px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                    >
                      Make main
                    </button>
                  )}

                  <label className="ml-2 flex items-center gap-2 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={opt.inStock}
                      onChange={(e) =>
                        dispatch(
                          updateOptionField({
                            clientId: opt.clientId,
                            field: "inStock",
                            value: e.target.checked,
                          })
                        )
                      }
                    />
                    In stock
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() =>
                      dispatch(moveOption({ from: idx, to: idx - 1 }))
                    }
                    className="rounded-md border px-2 py-1 text-xs disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={idx === options.length - 1}
                    onClick={() =>
                      dispatch(moveOption({ from: idx, to: idx + 1 }))
                    }
                    className="rounded-md border px-2 py-1 text-xs disabled:opacity-40"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() => dispatch(removeOption(opt.clientId))}
                    className="rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-6">
                {/* ✅ Label is fixed from template (same for all options) */}
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Label (from category template)
                  </label>
                  <input
                    value={OPTION_LABEL_FROM_TEMPLATE}
                    disabled
                    className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none"
                  />
                </div>

                <Field
                  label="Value"
                  className="md:col-span-2"
                  value={opt.value ?? ""}
                  placeholder='e.g. "100", "250", "500"'
                  onChange={(v) =>
                    dispatch(
                      updateOptionField({
                        clientId: opt.clientId,
                        field: "value",
                        value: v,
                      })
                    )
                  }
                />

                <NumberField
                  label="Price"
                  className="md:col-span-1"
                  value={opt.price}
                  onChange={(n) =>
                    dispatch(
                      updateOptionField({
                        clientId: opt.clientId,
                        field: "price",
                        value: n,
                      })
                    )
                  }
                />

                <NumberField
                  label="Discount"
                  className="md:col-span-1"
                  value={opt.discount ?? 0}
                  onChange={(n) =>
                    dispatch(
                      updateOptionField({
                        clientId: opt.clientId,
                        field: "discount",
                        value: n,
                      })
                    )
                  }
                />

                <Field
                  label="Unit (optional)"
                  className="md:col-span-2"
                  value={opt.unit ?? ""}
                  placeholder='e.g. "pcs"'
                  onChange={(v) =>
                    dispatch(
                      updateOptionField({
                        clientId: opt.clientId,
                        field: "unit",
                        value: v,
                      })
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium text-gray-700">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/10"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium text-gray-700">
        {label}
      </label>
      <input
        type="text"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/10"
      />
    </div>
  );
}
