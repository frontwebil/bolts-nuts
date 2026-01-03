/* eslint-disable @typescript-eslint/no-explicit-any */
import { setTextField } from "@/redux/admin/slices/Product";
import { RootState } from "@/redux/admin/store";
import axios from "axios";
import Image from "next/image";
import { useRef, useState } from "react";
import { BsDownload } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

export function UploadTechImg() {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { technicalImg } = useSelector(
    (store: RootState) => store.ProductSlice
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setError("");
    setLoading(true);

    try {
      const form = new FormData();
      form.append("image", file);

      const res = await axios.post("/api/admin/upload-image", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url: string | undefined = res.data?.url;
      if (!url) throw new Error("No url returned");

      dispatch(setTextField({ field: "technicalImg", value: url }));
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Upload error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 space-y-3">
      <h2 className="text-lg font-bold text-gray-900">Images</h2>
      <div className="tech-upload__row">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex items-center gap-5 rounded-lg cursor-pointer"
        >
          {loading
            ? "Uploading..."
            : technicalImg
            ? "Change tech image"
            : "Upload tech image"}
          <BsDownload />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          upload(file);
          e.currentTarget.value = "";
        }}
      />

      {error && <p className="tech-upload__error">{error}</p>}

      {technicalImg && (
        <div className="tech-upload__preview">
          <Image
            src={technicalImg}
            alt="Technical image"
            width={420}
            height={260}
          />
          {technicalImg && (
            <button
              type="button"
              onClick={() =>
                dispatch(setTextField({ field: "technicalImg", value: "" }))
              }
              className="py-2 px-5 bg-black text-white cursor-pointer"
              disabled={loading}
            >
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
}
