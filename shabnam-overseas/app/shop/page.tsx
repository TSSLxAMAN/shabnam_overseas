"use client";

import { useEffect, useMemo, useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  ArrowUpFromDot,
  Grid2x2,
  Grid3x3,
  Filter,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthContext } from "@/app/context/UserAuthContext";

type Currency = "INR" | "USD";

type Product = {
  _id: string;
  name: string;
  description?: string;
  image?: string[];
  sizes: { label: string; price: number; stock: number }[];
  colors: { label: string }[];
  category?: string;
  byType?: string;
  byRoom?: string;
  style?: string;
  createdAt?: string;
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currency, setCurrency] = useState<Currency>("INR");

  // Multi-select filters
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");

  // Grid layout and sorting
  const [gridCols, setGridCols] = useState<2 | 3>(2);
  const [sortBy, setSortBy] = useState<
    "featured" | "price-asc" | "price-desc" | "newest"
  >("featured");

  // Mobile filter modal state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Local wishlist paint
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());

  const { user } = useContext(AuthContext);

  // Fetch (server still only guaranteed size/color; we apply the rest client-side)
  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedSizes[0]) params.append("sizes", selectedSizes[0]);
      if (selectedColors[0]) params.append("color", selectedColors[0]);

      const res = await fetch(
        `https://www.shabnamoverseas.com/api/filter/products?${params.toString()}`
      );
      // If the server ever returns non-JSON (error page), protect against it:
      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response from /api/products:", text);
        data = [];
      }

      if (Array.isArray(data)) setProducts(data);
      else if (Array.isArray(data?.products)) setProducts(data.products);
      else setProducts([]);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setProducts([]);
    }
  };

  const getPriceRange = (product: Product) => {
    if (!product.sizes || product.sizes.length === 0) return null;
    const prices = product.sizes.map((s) => s.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max
      ? convertCurrency(min)
      : `${convertCurrency(min)} - ${convertCurrency(max)}`;
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSizes.length, selectedColors.length]);

  // Client-side filters + sort
  const filteredProducts = useMemo(() => {
    let out = [...products];

    if (selectedColors.length) {
      out = out.filter((p) =>
        p.colors?.some((c) => selectedColors.includes(c.label))
      );
    }

    if (selectedSizes.length) {
      out = out.filter((p) =>
        p.sizes?.some((s) => selectedSizes.includes(s.label))
      );
    }

    const min = priceMin ? Number(priceMin) : undefined;
    const max = priceMax ? Number(priceMax) : undefined;
    if (min !== undefined && !Number.isNaN(min)) {
      out = out.filter((p) => p.sizes?.some((s) => s.price >= min));
    }
    if (max !== undefined && !Number.isNaN(max)) {
      out = out.filter((p) => p.sizes?.some((s) => s.price <= max));
    }

    if (sortBy === "price-asc")
      out.sort(
        (a, b) =>
          Math.min(...a.sizes.map((s) => s.price)) -
          Math.min(...b.sizes.map((s) => s.price))
      );
    if (sortBy === "price-desc")
      out.sort(
        (a, b) =>
          Math.max(...b.sizes.map((s) => s.price)) -
          Math.max(...a.sizes.map((s) => s.price))
      );

    if (sortBy === "newest")
      out.sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      });

    return out;
  }, [products, selectedColors, selectedSizes, priceMin, priceMax, sortBy]);

  const convertCurrency = (price: number) =>
    currency === "INR"
      ? `₹${price.toLocaleString("en-IN")}`
      : `$${(price * 0.012).toFixed(2)}`;

  const toggleInArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const handleToggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error("Please login to manage wishlist");
      return;
    }

    // if product already wishlisted -> remove
    if (wishlistedIds.has(productId)) {
      try {
        const { data } = await axios.delete(
          `https://www.shabnamoverseas.com/api/users/wishlist/${productId}`,
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        setWishlistedIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        toast.success(data?.message || "Removed from wishlist");
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Error removing from wishlist"
        );
      }
    } else {
      // else -> add to wishlist
      try {
        const { data } = await axios.post(
          `https://www.shabnamoverseas.com/api/users/wishlist/${productId}`,
          {},
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        setWishlistedIds((prev) => {
          const next = new Set(prev);
          next.add(productId);
          return next;
        });
        toast.success(data?.message || "Added to wishlist");
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Error adding to wishlist"
        );
      }
    }
  };

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceMin("");
    setPriceMax("");
  };

  const activeFilterCount =
    selectedSizes.length +
    selectedColors.length +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0);

  const SIZES = ["2x3", "3x5", "4x6", "5x8", "6x9"];
  const COLORS = ["RED", "BLUE", "BEIGE", "GREEN", "GREY"];

  // Filter Component (reusable for both sidebar and modal)
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price */}
      <details className="group bg-[#f9f9f9] rounded-2xl shadow-lg" open>
        <summary className="cursor-pointer list-none px-5 py-4 font-medium flex items-center justify-between">
          <span>Price</span>
          <span className="transition group-open:-rotate-180">
            <ArrowUpFromDot size={16} strokeWidth={1.25} absoluteStrokeWidth />
          </span>
        </summary>
        <div className="px-5 pb-5 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-24 p-2 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30"
            />
            <span>to </span>
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-24 p-2 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30"
            />
          </div>
        </div>
      </details>

      {/* Size (multi) */}
      <details className="group bg-[#f9f9f9] rounded-2xl shadow-lg" open>
        <summary className="cursor-pointer list-none px-5 py-4 font-medium flex items-center justify-between">
          <span>Size (ft)</span>
          <span className="transition group-open:-rotate-180">
            <ArrowUpFromDot size={16} strokeWidth={1.25} absoluteStrokeWidth />
          </span>
        </summary>
        <div className="px-5 pb-4 text-sm">
          {SIZES.map((size) => (
            <label key={size} className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={selectedSizes.includes(size)}
                onChange={() => setSelectedSizes((s) => toggleInArray(s, size))}
                className="accent-[#742402]"
              />
              {size}
            </label>
          ))}
        </div>
      </details>

      {/* Color (multi) */}
      <details className="group bg-[#f9f9f9] rounded-2xl shadow-lg" open>
        <summary className="cursor-pointer list-none px-5 py-4 font-medium flex items-center justify-between">
          <span>Color</span>
          <span className="transition group-open:-rotate-180">
            <ArrowUpFromDot size={16} strokeWidth={1.25} absoluteStrokeWidth />
          </span>
        </summary>
        <div className="px-5 pb-4 text-sm">
          {COLORS.map((color) => (
            <label key={color} className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={selectedColors.includes(color)}
                onChange={() =>
                  setSelectedColors((c) => toggleInArray(c, color))
                }
                className="accent-[#742402]"
              />
              {color}
            </label>
          ))}
        </div>
      </details>
    </div>
  );

  return (
    <>
      <Navbar forceWhite={true} disableScrollEffect={true} />

      {/* HERO like Appointment page */}
      <main className="pt-[125px] bg-white text-black w-full">
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-6xl py-12 sm:py-16 md:py-20">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] break-words text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              ALL RUGS
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
              Discover Your Perfect Match In Our Diverse Rug Selection.
            </p>
          </div>
        </section>

        {/* Mobile Filter Bar */}
        <section className="px-4 sm:px-6 lg:hidden">
          <div className="max-w-6xl mx-auto py-4">
            <div className="flex items-center justify-between gap-3">
              {/* Filter Button */}
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#742402] text-white rounded-lg text-sm font-medium"
              >
                <Filter size={16} strokeWidth={1.25} absoluteStrokeWidth />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-white text-[#742402] px-2 py-0.5 rounded-full text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Currency and Sort */}
              <div className="flex items-center gap-2">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#742402]/30"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#742402]/30"
                >
                  <option value="featured">Sort by</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedSizes.map((size) => (
                  <span
                    key={size}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#742402] text-white text-xs rounded-full"
                  >
                    Size: {size}
                    <button
                      onClick={() =>
                        setSelectedSizes((s) => s.filter((x) => x !== size))
                      }
                      className="hover:bg-white/20 rounded"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {selectedColors.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#742402] text-white text-xs rounded-full"
                  >
                    Color: {color}
                    <button
                      onClick={() =>
                        setSelectedColors((c) => c.filter((x) => x !== color))
                      }
                      className="hover:bg-white/20 rounded"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {(priceMin || priceMax) && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#742402] text-white text-xs rounded-full">
                    Price: {priceMin || "0"} - {priceMax || "∞"}
                    <button
                      onClick={() => {
                        setPriceMin("");
                        setPriceMax("");
                      }}
                      className="hover:bg-white/20 rounded"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-[#742402] hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Desktop Controls row */}
        <section className="px-4 sm:px-6 hidden lg:block">
          <div className="max-w-6xl mx-auto flex items-center justify-end py-4">
            <div className="flex items-center gap-3">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#742402]/30"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#742402]/30"
              >
                <option value="featured">Sort by</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-10 pb-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6">
            {/* Desktop Sidebar - Sticky, independently scrollable with hidden scrollbar */}
            <aside className="hidden lg:block sticky top-[140px] max-h-[calc(100vh-160px)] overflow-y-auto pr-2 no-scrollbar">
              <FilterContent />
            </aside>

            {/* Products */}
            <div>
              {/* Desktop Top Bar with layout controls and product count */}
              <div className="hidden lg:flex items-center justify-between mb-6 bg-[#f9f9f9] px-4 py-3 rounded-lg shadow-sm">
                {/* Left: Grid Layout Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGridCols(2)}
                    className={`px-3 py-1 rounded-md border ${
                      gridCols === 2
                        ? "bg-[#742402] text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    <Grid2x2 size={16} strokeWidth={1.25} absoluteStrokeWidth />
                  </button>
                  <button
                    onClick={() => setGridCols(3)}
                    className={`px-3 py-1 rounded-md border ${
                      gridCols === 3
                        ? "bg-[#742402] text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    <Grid3x3 size={16} strokeWidth={1.25} absoluteStrokeWidth />
                  </button>
                </div>

                {/* Center: Total products */}
                <p className="text-sm text-end font-medium text-gray-700">
                  {filteredProducts.length} products listed
                </p>

                {/* Right: (Empty for now, keeps center aligned) */}
              </div>

              {/* Mobile Product Count & Grid Controls */}
              <div className="flex lg:hidden items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-700">
                  {filteredProducts.length} products
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setGridCols(2)}
                    className={`px-2 py-1 rounded-md border ${
                      gridCols === 2
                        ? "bg-[#742402] text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    <Grid2x2 size={14} strokeWidth={1.25} absoluteStrokeWidth />
                  </button>
                  <button
                    onClick={() => setGridCols(3)}
                    className={`px-2 py-1 rounded-md border ${
                      gridCols === 3
                        ? "bg-[#742402] text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    <Grid3x3 size={14} strokeWidth={1.25} absoluteStrokeWidth />
                  </button>
                </div>
              </div>

              {/* Products Grid - Responsive columns */}
              <div
                className={`grid gap-3 sm:gap-5 ${
                  gridCols === 2
                    ? "grid-cols-2 lg:grid-cols-2"
                    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3"
                }`}
              >
                {filteredProducts.map((product) => {
                  const images = Array.isArray(product.image)
                    ? product.image
                    : [];
                  const primary =
                    typeof images[0] === "string" ? images[0] : "";
                  const secondary =
                    typeof images[1] === "string" ? images[1] : "";
                  const isWishlisted = wishlistedIds.has(product._id);

                  return (
                    <article
                      key={product._id}
                      className="group rounded-2xl bg-[#f7f7f7] p-2 sm:p-3"
                    >
                      <div className="relative">
                        <Link href={`/product/${product._id}`}>
                          {/* Responsive image container */}
                          <div className="relative overflow-hidden rounded-xl bg-white aspect-[2/3] md:aspect-[3/4]">
                            {primary ? (
                              <>
                                <Image
                                  src={primary}
                                  alt={product.name}
                                  fill
                                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
                                  className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                                />
                                {!!secondary && (
                                  <Image
                                    src={secondary}
                                    alt={`${product.name} alt`}
                                    fill
                                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
                                    className="object-cover absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                  />
                                )}
                              </>
                            ) : (
                              // Placeholder (prevents crash)
                              <div className="absolute inset-0 grid place-items-center bg-gray-100 text-gray-400 text-xs">
                                No image
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Heart - responsive size */}
                        <button
                          onClick={() => handleToggleWishlist(product._id)}
                          className="absolute top-2 right-2 sm:top-3 sm:right-3 inline-flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full shadow hover:bg-white"
                          aria-label="Add to wishlist"
                        >
                          <Heart
                            className="h-3 w-3 sm:h-4 sm:w-4"
                            stroke={isWishlisted ? "#ef4444" : "#374151"}
                            fill={isWishlisted ? "#ef4444" : "none"}
                          />
                        </button>
                      </div>

                      <div className="mt-3 sm:mt-4">
                        <Link href={`/product/${product._id}`}>
                          <h3 className="font-serif text-sm sm:text-[17px] hover:underline line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-xs sm:text-sm font-serif text-gray-600 line-clamp-1">
                          {product.description}
                        </p>
                        <div className="mt-1 sm:mt-2 font-serif text-sm sm:text-base">
                          {getPriceRange(product)}
                        </div>

                        {/* Colors - responsive display */}
                        {product.colors?.length > 0 && (
                          <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-2">
                            {product.colors
                              .slice(0, gridCols === 3 ? 2 : 3)
                              .map((c, i) => (
                                <span
                                  key={i}
                                  className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border text-[10px] sm:text-xs bg-gray-100"
                                >
                                  {c.label}
                                </span>
                              ))}
                            {product.colors.length >
                              (gridCols === 3 ? 2 : 3) && (
                              <span className="text-[10px] sm:text-xs text-gray-500">
                                +{" "}
                                {product.colors.length -
                                  (gridCols === 3 ? 2 : 3)}{" "}
                                more
                              </span>
                            )}
                          </div>
                        )}

                        <div className="mt-3 sm:mt-4">
                          <a
                            href={`/product/${product._id}`}
                            className="w-full inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-xl bg-[#742402] hover:bg-[#5c1c01] text-white border hover:shadow transition tracking-wide font-serif text-sm sm:text-base"
                          >
                            View Product
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Filter Modal */}
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsFilterModalOpen(false)}
            />

            {/* Modal */}
            <div className="absolute inset-x-4 top-4 bottom-4 bg-white rounded-2xl shadow-2xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-medium">Filters</h2>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <FilterContent />
              </div>

              {/* Footer */}
              <div className="border-t p-4 flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 px-4 py-3 border border-[#742402] text-[#742402] rounded-xl font-medium"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-[#742402] text-white rounded-xl font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Hide scrollbars globally for .no-scrollbar (still scrollable) */}
      <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none; /* IE/Edge */
          scrollbar-width: none; /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
      `}</style>
    </>
  );
}
