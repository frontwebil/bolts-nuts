import { ProductWithRelations } from "@/types/ProductType";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CatalogCard({
  product,
}: {
  product: ProductWithRelations;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const mainVariant = product.options.filter((el) => el.isMain)[0];
  const hasDiscount = mainVariant.discount && mainVariant.discount > 0;
  const priceWithDiscount = hasDiscount
    ? Math.ceil(
        mainVariant.price - mainVariant.price * (mainVariant.discount! / 100)
      )
    : mainVariant.price;

  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (loading) return;

    setLoading(true);

    const res = await axios.delete("/api/admin/deleteProduct", {
      data: { id: product.id },
    });

    if (res.data.ok) {
      toast.success("Product Deleted");
      router.refresh();
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-3 px-4 py-4 text-sm hover:bg-black/2">
      <div className="col-span-3 flex items-center gap-3">
        <Image
          src={product.images[0]}
          width={48}
          height={48}
          alt={product.title}
          className="h-12 w-12 rounded-xl border border-black/10"
        />
        <div className="min-w-0">
          <div className="truncate font-semibold text-neutral-900">
            {product.title}
          </div>
          <div className="truncate text-xs text-neutral-500">
            {product.slug}
          </div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {product.isBestSeller && (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                Best seller
              </span>
            )}
            {product.inStock ? (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                In stock
              </span>
            ) : (
              <span className="rounded-full bg-gray-500/10 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                Out of stock
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="col-span-1 flex items-center text-neutral-700">
        {product.options.length}
      </div>
      <div className="col-span-2 flex items-center text-neutral-700">
        {product.category}
      </div>

      <div className="col-span-1 flex items-center">
        {hasDiscount ? (
          <>
            <div className="font-semibold text-neutral-900">
              ${priceWithDiscount}
            </div>
            <div className="ml-2 text-xs text-neutral-500 line-through">
              ${mainVariant.price}
            </div>
          </>
        ) : (
          <div className="font-semibold text-neutral-900">
            ${mainVariant.price}
          </div>
        )}
      </div>

      <div className="col-span-1 flex items-center">
        <div className="font-semibold text-neutral-900">
          {hasDiscount ? `${mainVariant.discount}%` : "No discount"}
        </div>
      </div>

      <div className="col-span-1 flex items-center gap-2">
        {product.isActive ? (
          <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-700">
            Active
          </span>
        ) : (
          <span className="rounded-full bg-gray-500/10 px-2 py-1 text-xs font-semibold text-gray-700">
            Inactive
          </span>
        )}
      </div>

      <div className="col-span-2 flex items-center gap-2">
        <span className="text-neutral-700">
          {new Date(product.createdAt).toLocaleString("uk-UA")}
        </span>
      </div>

      <div className="col-span-1 flex items-center justify-end gap-2">
        <Link
          href={`/admin-page-21sQsafaboltsnuts/editProduct/${product.id}`}
          type="button"
          className="
                    rounded-lg border border-black/10 px-2.5 py-1.5 text-xs font-semibold
                    text-neutral-800 hover:bg-black/5
                    focus:outline-none focus:ring-2 focus:ring-neutral-900/15
                  "
        >
          Edit
        </Link>
        <button
          onClick={() => {
            if (confirmDelete) {
              handleDelete();
            } else {
              setConfirmDelete(true);
            }
          }}
          type="button"
          className="
                    rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white
                    hover:bg-red-500
                    focus:outline-none focus:ring-2 focus:ring-red-600/30
                  "
        >
          {!confirmDelete ? "Del" : loading ? "Deleting..." : "Confirm"}
        </button>
      </div>
    </div>
  );
}
