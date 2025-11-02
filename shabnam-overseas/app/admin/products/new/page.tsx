"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/userAxios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: [] as string[],
    category: "",
    sizes: [] as { label: string; price: string; stock: string }[],
    colors: [] as { label: string }[],
    byType: "",
    byRoom: "",
    style: "",
    // New fields for product details
    dimensions: "",
    material: "",
    careInformation: "",
    additionalDetails: "",
    shippingReturns: "",
  });
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/admin/categories"); // ✅ your Express route
        setCategories(res.data);
      } catch (err) {
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);
  interface Category {
    _id: string;
    name: string;
    type: "size" | "style" | "type" | "room" | "color";
  }
  const sizesList = categories.filter((c) => c.type === "size");
  const colorList = categories.filter((c) => c.type === "color");
  const typeList = categories.filter((c) => c.type === "type");
  const roomList = categories.filter((c) => c.type === "room");
  const styleList = categories.filter((c) => c.type === "style");

  // --- handle generic fields ---
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // --- size management ---
  const addSize = () => {
    setForm((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { label: "", price: "", stock: "" }],
    }));
  };

  const updateSize = (
    index: number,
    field: "label" | "price" | "stock",
    value: string
  ) => {
    setForm((prev) => {
      const updated = [...prev.sizes];
      if (field === "price" || field === "stock") {
        updated[index][field] = String(value);
      } else {
        updated[index][field] = value;
      }
      return { ...prev, sizes: updated };
    });
  };

  const removeSize = (index: number) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  // --- color management ---
  const addColor = (color: string) => {
    if (!color) return;
    if (form.colors.some((c) => c.label === color)) {
      toast.error("Color already added");
      return;
    }
    setForm((prev) => ({
      ...prev,
      colors: [...prev.colors, { label: color }],
    }));
  };

  const removeColor = (color: string) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c.label !== color),
    }));
  };

  // --- upload images ---
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    console.log(files);
    setUploading(true);
    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "shabnam_upload");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dr2njddnt/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        if (data.secure_url) uploadedUrls.push(data.secure_url);
      }

      if (uploadedUrls.length > 0) {
        setForm((prev) => ({
          ...prev,
          image: [...prev.image, ...uploadedUrls],
        }));
        toast.success("Images uploaded!");
      } else {
        toast.error("No images uploaded");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    setForm((prev) => {
      const updated = [...prev.image];
      const newIndex = direction === "left" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[newIndex];
      updated[newIndex] = temp;
      return { ...prev, image: updated };
    });
  };

  const handleDeleteImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      image: prev.image.filter((img) => img !== url),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploading) {
      toast.error("Please wait, images are still uploading...");
      return;
    }

    if (!form.image || form.image.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (form.sizes.length === 0) {
      toast.error("Please add at least one size");
      return;
    }

    if (form.colors.length === 0) {
      toast.error("Please add at least one color");
      return;
    }

    try {
      await axios.post("/products", form);
      toast.success("Product created");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  // ---------- UI helpers ----------
  const label = "block text-sm font-medium text-gray-800 mb-1";
  const inputBase =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#742402]/30 focus:border-[#742402]";
  const selectBase = inputBase;
  const sectionCard = "rounded-2xl border border-gray-200 bg-white shadow-sm";
  const iconBtn =
    "inline-flex items-center justify-center rounded-lg border px-2 py-1 text-xs font-medium transition";
  // ---------------------------------
  if (loadingCategories) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading categories...
      </div>
    );
  }

  return (
    <>
      <Navbar forceWhite disableScrollEffect />

      <div className="min-h-screen bg-white text-black pt-24 px-6 mt-10">
        <div className="max-w-3xl mx-auto">
          <div className={`${sectionCard} p-6`}>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Add New Product
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={label}>Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={label}>Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className={inputBase}
                  />
                </div>

                <div>
                  <label className={label}>Category</label>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </div>

                <div>
                  <label className={label}>Type</label>
                  <select
                    name="byType"
                    value={form.byType}
                    onChange={handleChange}
                    required
                    className={selectBase}
                  >
                    <option value="">Select Type</option>
                    {typeList.map((t) => (
                      <option key={t._id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={label}>Room</label>
                  <select
                    name="byRoom"
                    value={form.byRoom}
                    onChange={handleChange}
                    required
                    className={selectBase}
                  >
                    <option value="">Select Room</option>
                    {roomList.map((r) => (
                      <option key={r._id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={label}>Style</label>
                  <select
                    name="style"
                    value={form.style}
                    onChange={handleChange}
                    required
                    className={selectBase}
                  >
                    <option value="">Select Style</option>
                    {styleList.map((s) => (
                      <option key={s._id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* New Product Details Section */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Additional Product Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className={label}>
                      Dimensions{" "}
                      <span className="text-gray-500 font-normal">
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      name="dimensions"
                      value={form.dimensions}
                      onChange={handleChange}
                      placeholder="e.g., 200cm x 300cm or 6'7&quot; x 9'10&quot;"
                      rows={2}
                      className={inputBase}
                    />
                  </div>

                  <div>
                    <label className={label}>
                      Material{" "}
                      <span className="text-gray-500 font-normal">
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      name="material"
                      value={form.material}
                      onChange={handleChange}
                      placeholder="e.g., 100% Wool, Hand-tufted with cotton backing"
                      rows={3}
                      className={inputBase}
                    />
                  </div>

                  <div>
                    <label className={label}>
                      Care Information{" "}
                      <span className="text-gray-500 font-normal">
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      name="careInformation"
                      value={form.careInformation}
                      onChange={handleChange}
                      placeholder="e.g., Vacuum regularly. Professional cleaning recommended. Avoid direct sunlight."
                      rows={4}
                      className={inputBase}
                    />
                  </div>

                  <div>
                    <label className={label}>
                      Additional Details{" "}
                      <span className="text-gray-500 font-normal">
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      name="additionalDetails"
                      value={form.additionalDetails}
                      onChange={handleChange}
                      placeholder="e.g., Handmade in India, Unique design, Limited edition, Certificate of authenticity included"
                      rows={4}
                      className={inputBase}
                    />
                  </div>

                  <div>
                    <label className={label}>
                      Shipping & Returns{" "}
                      <span className="text-gray-500 font-normal">
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      name="shippingReturns"
                      value={form.shippingReturns}
                      onChange={handleChange}
                      placeholder="e.g., Free shipping on orders over ₹10,000. 30-day return policy. Items must be in original condition."
                      rows={4}
                      className={inputBase}
                    />
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className={label}>Add Sizes</label>
                {form.sizes.map((s, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <select
                      value={s.label}
                      onChange={(e) => updateSize(i, "label", e.target.value)}
                      className={selectBase}
                    >
                      <option value="">Select Size</option>
                      {sizesList.map((sz) => (
                        <option key={sz._id} value={sz.name}>
                          {sz.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Price"
                      value={s.price}
                      onChange={(e) => updateSize(i, "price", e.target.value)}
                      className={inputBase}
                    />

                    <input
                      type="number"
                      placeholder="Stock"
                      value={s.stock}
                      onChange={(e) => updateSize(i, "stock", e.target.value)}
                      className={inputBase}
                    />
                    <button
                      type="button"
                      onClick={() => removeSize(i)}
                      className="px-2 bg-red-500 text-white rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSize}
                  className="mt-2 px-3 py-1 bg-[#742402] text-white rounded"
                >
                  + Add Size
                </button>
              </div>

              {/* Colors */}
              <div>
                <label className={label}>Colors</label>
                <div className="flex gap-2">
                  <select
                    onChange={(e) => {
                      addColor(e.target.value);
                      e.target.value = "";
                    }}
                    className={selectBase}
                  >
                    <option value="">Select Color</option>
                    {colorList.map((clr) => (
                      <option key={clr._id} value={clr.name}>
                        {clr.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {form.colors.map((c) => (
                    <span
                      key={c.label}
                      className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded"
                    >
                      {c.label}
                      <button
                        type="button"
                        onClick={() => removeColor(c.label)}
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className={label}>Product Images</label>
                <input
                  type="file"
                  multiple
                  onChange={handleUpload}
                  className={inputBase}
                />
                {uploading && (
                  <p className="mt-2 text-sm text-gray-600">Uploading...</p>
                )}

                {form.image.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {form.image.map((img, i) => (
                      <div
                        key={img}
                        className="relative rounded-xl border border-gray-200 overflow-hidden"
                      >
                        <img
                          src={img}
                          alt="preview"
                          className="h-28 w-full object-cover"
                        />

                        {/* top controls */}
                        <div className="absolute left-2 top-2 flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveImage(i, "left")}
                            disabled={i === 0}
                            className={`${iconBtn} bg-white/90 border-gray-300 text-gray-700 disabled:opacity-50`}
                            title="Move left"
                          >
                            ⬅
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(i, "right")}
                            disabled={i === form.image.length - 1}
                            className={`${iconBtn} bg-white/90 border-gray-300 text-gray-700 disabled:opacity-50`}
                            title="Move right"
                          >
                            ➡
                          </button>
                        </div>

                        {/* delete */}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img)}
                          className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`rounded-xl bg-[#742402] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5c1c01] ${
                    uploading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {uploading ? "Uploading..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
