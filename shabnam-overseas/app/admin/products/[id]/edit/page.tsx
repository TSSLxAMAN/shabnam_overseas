"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "@/lib/userAxios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

interface Product {
  _id: string;
  name: string;
  description: string;
  image: string[];
  category: string;
  sizes: { label: string; price: number; stock: number }[];
  colors: { label: string }[];
  byType: string;
  byRoom: string;
  style: string;
  // New fields
  dimensions?: string;
  material?: string;
  careInformation?: string;
  additionalDetails?: string;
  shippingReturns?: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

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
    // New fields
    dimensions: "",
    material: "",
    careInformation: "",
    additionalDetails: "",
    shippingReturns: "",
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);

  // Fetch product data on mount
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        const response = await axios.get(`/products/${productId}`);
        const product = response.data;

        setOriginalProduct(product);
        setForm({
          name: product.name || "",
          description: product.description || "",
          image: product.image || [],
          category: product.category || "",
          sizes:
            product.sizes?.map((s: any) => ({
              label: s.label,
              price: String(s.price),
              stock: String(s.stock),
            })) || [],
          colors: product.colors || [],
          byType: product.byType || "",
          byRoom: product.byRoom || "",
          style: product.style || "",
          // New fields
          dimensions: product.dimensions || "",
          material: product.material || "",
          careInformation: product.careInformation || "",
          additionalDetails: product.additionalDetails || "",
          shippingReturns: product.shippingReturns || "",
        });
      } catch (err: any) {
        toast.error("Failed to load product");
        // console.error(err);
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

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
      updated[index][field] = value;
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
      // console.error(err);
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
      // Convert sizes prices and stocks back to numbers
      const formattedSizes = form.sizes.map((size) => ({
        label: size.label,
        price: parseFloat(size.price),
        stock: parseInt(size.stock),
      }));

      const updatedProduct = {
        ...form,
        sizes: formattedSizes,
      };

      await axios.put(`/products/${productId}`, updatedProduct);
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
      // console.error(err);
    }
  };

  const handleCancel = () => {
    router.push("/admin/products");
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

  if (loading) {
    return (
      <>
        <Navbar forceWhite disableScrollEffect />
        <div className="min-h-screen bg-white flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#742402] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar forceWhite disableScrollEffect />

      <div className="min-h-screen bg-white text-black pt-24 px-6 mt-10">
        <div className="max-w-3xl mx-auto">
          <div className={`${sectionCard} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Edit Product
              </h1>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                ✕ Cancel
              </button>
            </div>

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
                    <option value="HAND-KNOTTED">HAND-KNOTTED</option>
                    <option value="HAND-TUFTED">HAND-TUFTED</option>
                    <option value="FLAT WEAVE">FLAT WEAVE</option>
                    <option value="DHURRIE">DHURRIE</option>
                    <option value="KILIM">KILIM</option>
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
                    <option value="LIVING ROOM">LIVING ROOM</option>
                    <option value="BEDROOM">BEDROOM</option>
                    <option value="DINING ROOM">DINING ROOM</option>
                    <option value="HALLWAY">HALLWAY</option>
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
                    <option value="MODERN">MODERN</option>
                    <option value="TRADITIONAL">TRADITIONAL</option>
                    <option value="BOHEMIAN">BOHEMIAN</option>
                    <option value="MINIMALIST">MINIMALIST</option>
                    <option value="VINTAGE">VINTAGE</option>
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
                <label className={label}>Sizes & Pricing</label>
                {form.sizes.map((s, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <select
                      value={s.label}
                      onChange={(e) => updateSize(i, "label", e.target.value)}
                      className={selectBase}
                      required
                    >
                      <option value="">Select Size</option>
                      <option value="2x3">2x3</option>
                      <option value="3x5">3x5</option>
                      <option value="4x6">4x6</option>
                      <option value="5x8">5x8</option>
                      <option value="6x9">6x9</option>
                    </select>

                    <input
                      type="number"
                      placeholder="Price"
                      value={s.price}
                      onChange={(e) => updateSize(i, "price", e.target.value)}
                      className={inputBase}
                      required
                      min="0"
                      step="0.01"
                    />

                    <input
                      type="number"
                      placeholder="Stock"
                      value={s.stock}
                      onChange={(e) => updateSize(i, "stock", e.target.value)}
                      className={inputBase}
                      required
                      min="0"
                    />
                    <button
                      type="button"
                      onClick={() => removeSize(i)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      title="Remove size"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSize}
                  className="mt-2 px-4 py-2 bg-[#742402] text-white rounded-lg hover:bg-[#5c1c01] transition"
                >
                  + Add Size
                </button>
              </div>

              {/* Colors */}
              <div>
                <label className={label}>Colors</label>
                <div className="flex gap-2 mb-2">
                  <select
                    onChange={(e) => {
                      addColor(e.target.value);
                      e.target.value = "";
                    }}
                    className={selectBase}
                  >
                    <option value="">Select Color</option>
                    <option value="RED">RED</option>
                    <option value="BLUE">BLUE</option>
                    <option value="BEIGE">BEIGE</option>
                    <option value="GREEN">GREEN</option>
                    <option value="GREY">GREY</option>
                  </select>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {form.colors.map((c) => (
                    <span
                      key={c.label}
                      className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {c.label}
                      <button
                        type="button"
                        onClick={() => removeColor(c.label)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Remove color"
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
                  accept="image/*"
                  onChange={handleUpload}
                  className={inputBase}
                />
                {uploading && (
                  <p className="mt-2 text-sm text-blue-600">
                    Uploading images...
                  </p>
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
                          className="h-32 w-full object-cover"
                        />

                        {/* Order controls */}
                        <div className="absolute left-2 top-2 flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveImage(i, "left")}
                            disabled={i === 0}
                            className={`${iconBtn} bg-white/90 border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white`}
                            title="Move left"
                          >
                            ⬅
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(i, "right")}
                            disabled={i === form.image.length - 1}
                            className={`${iconBtn} bg-white/90 border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white`}
                            title="Move right"
                          >
                            ➡
                          </button>
                        </div>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img)}
                          className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600 transition"
                          title="Remove image"
                        >
                          ✕
                        </button>

                        {/* First image indicator */}
                        {i === 0 && (
                          <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit buttons */}
              <div className="flex justify-between gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading}
                  className={`rounded-xl bg-[#742402] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5c1c01] ${
                    uploading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {uploading ? "Uploading..." : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
