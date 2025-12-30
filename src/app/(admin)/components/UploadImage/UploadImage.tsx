/* eslint-disable @typescript-eslint/no-explicit-any */
import { setImages } from "@/redux/admin/slices/Product";
import { RootState } from "@/redux/admin/store";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function UploadImage() {
  const { images } = useSelector((store: RootState) => store.ProductSlice);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  const uploadOne = async (file: File) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("image", file);

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");

      dispatch(setImages([...images, data.url]));
    } catch (error: any) {
      toast.error(error.message || "Upload error");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) {
      return;
    }
    const file = e.target.files?.[0];
    if (file) uploadOne(file);
  };

  const removeImage = (url: string) => {
    const filteredImages = images.filter((el) => el !== url);

    dispatch(setImages(filteredImages));
  };

  const moveImageLeft = (i: number) => {
    if (i === 0) return;

    const newImages = [...images];

    [newImages[i - 1], newImages[i]] = [newImages[i], newImages[i - 1]];

    dispatch(setImages(newImages));
  };

  const moveImageRight = (i: number) => {
    if (i === images.length) return;

    const newImages = [...images];

    [newImages[i + 1], newImages[i]] = [newImages[i], newImages[i + 1]];

    dispatch(setImages(newImages));
  };

  return (
    <div className="mt-5 space-y-3">
      <h2 className="text-lg font-bold text-gray-900">Images</h2>
      <p className="mt-1 text-sm text-gray-500">First photo = main</p>

      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          disabled={loading}
          onChange={onPick}
        />
        {loading && <span className="text-sm text-gray-500">Uploading…</span>}
      </div>

      <div className="flex gap-4 flex-wrap">
        {images.map((url: string, i: number) => (
          <div
            key={i}
            className="relative w-[300px] rounded-xl border bg-white shadow-md p-2 transition hover:shadow-xl"
          >
            <Image
              src={url}
              alt={`Photo ${i}`}
              width={180}
              height={260}
              className="rounded-lg object-contain w-full h-[400px]"
            />

            <button
              type="button"
              aria-label="Delete photo"
              onClick={() => removeImage(url)}
              className="
              absolute right-0 top-0
              grid place-items-center
              w-8 h-8 rounded-full
              bg-black/60 text-white
              hover:bg-black/80
              active:scale-95
              transition
            "
            >
              ✕
            </button>

            <div className="absolute bottom-2 left-0 w-full flex justify-center gap-10">
              <button
                disabled={i === 0}
                onClick={(e) => {
                  e.preventDefault();
                  moveImageLeft(i);
                }}
                className="p-1 bg-black/70 text-white rounded-full disabled:opacity-30 hover:scale-110 transition cursor-pointer"
              >
                <FiChevronLeft size={18} />
              </button>

              <button
                disabled={i === images.length - 1}
                className="p-1 bg-black/70 text-white rounded-full disabled:opacity-30 hover:scale-110 transition cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  moveImageRight(i);
                }}
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
