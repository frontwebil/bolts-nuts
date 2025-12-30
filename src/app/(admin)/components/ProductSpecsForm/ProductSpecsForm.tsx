"use client";

import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/admin/store"; // <- заміни шлях
import { updateSpecValue } from "@/redux/admin/slices/Product"; // <- заміни шлях

export function ProductSpecsForm() {
  const dispatch = useDispatch();

  const specs = useSelector((s: RootState) => s.ProductSlice.specs); // <- заміни addProduct якщо інша назва в store

  const grouped = useMemo(() => {
    const map = new Map<string, typeof specs>();
    for (const sp of specs) {
      const arr = map.get(sp.group) ?? [];
      arr.push(sp);
      map.set(sp.group, arr);
    }
    return Array.from(map.entries()); // [group, specs[]]
  }, [specs]);

  if (!specs.length) return null;

  return (
    <div className=" space-y-5 mt-10">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900">Specifications</h2>
        <p className="mt-1 text-sm text-gray-500">
          Fill specs for this category
        </p>
      </div>

      <div className="space-y-6">
        {grouped.map(([groupName, groupSpecs]) => (
          <section key={groupName} className="space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold">{groupName}</h4>
              <div className="h-px flex-1 bg-black/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {groupSpecs.map((sp) => {
                const isEmpty = sp.required && !sp.value?.trim();

                return (
                  <div key={sp.clientId} className="space-y-1.5">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <span>{sp.key}</span>
                      {sp.required ? (
                        <span className="text-xs px-2 py-0.5 rounded-full border">
                          required
                        </span>
                      ) : null}
                    </label>

                    {sp.type === "select" ? (
                      <select
                        value={sp.value ?? ""}
                        onChange={(e) =>
                          dispatch(
                            updateSpecValue({
                              clientId: sp.clientId,
                              value: e.target.value,
                            })
                          )
                        }
                        className={[
                          "w-full rounded-xl border px-3 py-2 outline-none",
                          isEmpty ? "border-red-500" : "",
                        ].join(" ")}
                      >
                        <option value="">
                          {sp.placeholder ?? "Select..."}
                        </option>
                        {(sp.options ?? []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={sp.value ?? ""}
                        onChange={(e) =>
                          dispatch(
                            updateSpecValue({
                              clientId: sp.clientId,
                              value: e.target.value,
                            })
                          )
                        }
                        placeholder={sp.placeholder ?? ""}
                        className={[
                          "w-full rounded-xl border px-3 py-2 outline-none",
                          isEmpty ? "border-red-500" : "",
                        ].join(" ")}
                      />
                    )}

                    {isEmpty ? (
                      <p className="text-xs text-red-600">
                        This field is required
                      </p>
                    ) : (
                      <p className="text-xs opacity-60">
                        {sp.type === "select"
                          ? "Choose one option"
                          : "Type the value"}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
