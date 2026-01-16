"use client";

import { useEffect, useState, useContext, Suspense, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Heart,
  ArrowUpFromDot,
  Grid2x2,
  Grid3x3,
  Filter,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthContext } from "@/app/context/UserAuthContext";

function FilterContent() {
  type Currency = "INR" | "USD";

  type Product = {
    _id: string;
    name: string;
    description?: string;
    image: string[];
    sizes: {
      label: string;
      price: number;
      stock: number;
    }[];
    colors: {
      label: string;
    }[];
    byType?: string;
    byRoom?: string;
    style?: string;
    category?: string;
    createdAt?: string;
  };

  // Mapping for filter types to display names
  const FILTER_DISPLAY_NAMES: Record<string, string> = {
    "HAND-KNOTTED": "Hand-Knotted",
    "HAND-TUFTED": "Hand-Tufted",
    "FLAT WEAVE": "Flat Weave",
    DHURRIE: "Dhurrie",
    KILIM: "Kilim",
    "LIVING ROOM": "Living Room",
    BEDROOM: "Bedroom",
    "DINING ROOM": "Dining Room",
    HALLWAY: "Hallway",
    RED: "Red",
    BLUE: "Blue",
    BEIGE: "Beige",
    GREEN: "Green",
    GREY: "Grey",
  };

  const { user } = useContext(AuthContext);
  const searchParams = useSearchParams();
  const urlFilter = searchParams.get("filter");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Filter states
  const [currency, setCurrency] = useState<Currency>("USD");
  const [exchangeRate, setExchangeRate] = useState<number>(83.5); // Default fallback
  const [rateLoading, setRateLoading] = useState<boolean>(true);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceMinInput, setPriceMinInput] = useState("");
  const [priceMaxInput, setPriceMaxInput] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [gridCols, setGridCols] = useState<2 | 3>(3);
  const [sortBy, setSortBy] = useState<
    "featured" | "price-asc" | "price-desc" | "newest"
  >("featured");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Fetch real-time exchange rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"
        );
        const data = await response.json();

        if (data?.usd?.inr) {
          setExchangeRate(data.usd.inr);
        }
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        // Keep using the default fallback rate
      } finally {
        setRateLoading(false);
      }
    };

    fetchExchangeRate();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPriceMin(priceMinInput);
      setPriceMax(priceMaxInput);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [priceMinInput, priceMaxInput]);

  const SIZES = useMemo(() => {
    const sizeSet = new Set<string>();
    products.forEach((product) => {
      product.sizes?.forEach((size) => {
        if (size.label) sizeSet.add(size.label);
      });
    });
    return Array.from(sizeSet).sort();
  }, [products]);

  const COLORS = useMemo(() => {
    const colorSet = new Set<string>();
    products.forEach((product) => {
      product.colors?.forEach((color) => {
        if (color.label) colorSet.add(color.label);
      });
    });
    return Array.from(colorSet).sort();
  }, [products]);

  // Normalize wishlist data
  const normalizeWishlistIds = (data: any): string[] => {
    if (!data) return [];
    if (Array.isArray(data)) {
      if (data.length === 0) return [];
      if (typeof data[0] === "string") return data as string[];
      if (typeof data[0] === "object" && data[0]?._id)
        return data.map((x: any) => x._id);
    }
    if (Array.isArray(data?.wishlist)) {
      const w = data.wishlist;
      if (w.length === 0) return [];
      if (typeof w[0] === "string") return w as string[];
      if (typeof w[0] === "object" && w[0]?._id)
        return w.map((x: any) => x._id);
    }
    if (Array.isArray(data?.user?.wishlist)) {
      const w = data.user.wishlist;
      if (w.length === 0) return [];
      if (typeof w[0] === "string") return w as string[];
      if (typeof w[0] === "object" && w[0]?._id)
        return w.map((x: any) => x._id);
    }
    return [];
  };

  // Fetch filtered products
  const fetchFilteredProducts = async (filterValue: string) => {
    setLoading(true);
    try {
      const url = filterValue
        ? `https://api.shabnamoverseas.com/api/filter/products?filter=${encodeURIComponent(
            filterValue
          )}`
        : `https://api.shabnamoverseas.com/api/filter/products`;
      const res = await axios.get(url);
      const data = res.data?.products ?? [];
      setProducts(data);
    } catch (error: any) {
      toast.error("Failed to load products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Preload wishlist
  const preloadWishlist = async () => {
    if (!user?.token) return;
    try {
      const r1 = await axios.get(
        "https://api.shabnamoverseas.com/api/users/wishlist",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const ids1 = normalizeWishlistIds(r1.data);
      if (ids1.length || Array.isArray(r1.data)) {
        setWishlist(new Set(ids1));
        return;
      }

      const r2 = await axios.get(
        "https://api.shabnamoverseas.com/api/users/me",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const ids2 = normalizeWishlistIds(r2.data);
      if (ids2.length) {
        setWishlist(new Set(ids2));
        return;
      }
    } catch (err) {
      // console.warn("Wishlist preload failed");
    }
  };

  // Toggle wishlist
  const handleToggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error("Please login to manage wishlist");
      return;
    }
    const already = wishlist.has(productId);

    // Optimistic UI
    setWishlist((prev) => {
      const next = new Set(prev);
      if (already) next.delete(productId);
      else next.add(productId);
      return next;
    });

    try {
      if (already) {
        await axios.delete(
          `https://api.shabnamoverseas.com/api/users/wishlist/${productId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        toast.success("Removed from wishlist");
      } else {
        await axios.post(
          `https://api.shabnamoverseas.com/api/users/wishlist/${productId}`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        toast.success("Added to wishlist");
      }
    } catch (err: any) {
      // Revert on error
      setWishlist((prev) => {
        const next = new Set(prev);
        if (already) next.add(productId);
        else next.delete(productId);
        return next;
      });
      toast.error(err?.response?.data?.message || "Wishlist error");
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

  // Updated currency conversion function
  const convertCurrency = (priceInINR: number): string => {
    if (currency === "USD") {
      const priceInUSD = priceInINR / exchangeRate;
      return `$${priceInUSD.toFixed(2)}`;
    }
    return `₹${priceInINR.toLocaleString("en-IN")}`;
  };

  const toggleInArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

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

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceMinInput("");
    setPriceMaxInput("");
    setPriceMin("");
    setPriceMax("");
  };

  const activeFilterCount =
    selectedSizes.length +
    selectedColors.length +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0);

  // Effects
  useEffect(() => {
    if (urlFilter) {
      fetchFilteredProducts(urlFilter);
    } else {
      fetchFilteredProducts("");
    }
  }, [urlFilter]);

  useEffect(() => {
    preloadWishlist();
  }, [user?.token]);

  // Get display name for the current filter
  const getFilterDisplayName = () => {
    if (!urlFilter) return "All Products";
    const value = urlFilter.includes(":") ? urlFilter.split(":")[1] : urlFilter;
    return FILTER_DISPLAY_NAMES[value.toUpperCase()] || value;
  };

  // Filter Component (reusable for both sidebar and modal)
  const FilterSidebar = () => (
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
              type="text"
              inputMode="numeric"
              placeholder="Min"
              value={priceMinInput}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^\d+$/.test(val)) {
                  setPriceMinInput(val);
                }
              }}
              className="w-24 p-2 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30"
            />
            <span>to </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Max"
              value={priceMaxInput}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^\d+$/.test(val)) {
                  setPriceMaxInput(val);
                }
              }}
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

      {/* Hero Section */}
      <main className="pt-[125px] bg-white text-black w-full">
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-6xl py-12 sm:py-16 md:py-20">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] break-words text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              SHOP {getFilterDisplayName().toUpperCase()}
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
              Discover our curated collection of{" "}
              {getFilterDisplayName().toLowerCase()} rugs
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
                  disabled={rateLoading}
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
                disabled={rateLoading}
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

        {/* Products Section with Sidebar */}
        <section className="px-4 sm:px-6 lg:px-10 pb-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6">
            {/* Desktop Sidebar - Sticky, independently scrollable with hidden scrollbar */}
            <aside className="hidden lg:block sticky top-[140px] max-h-[calc(100vh-160px)] overflow-y-auto pr-2 no-scrollbar">
              <FilterSidebar />
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

              {loading ? (
                <div
                  className={`grid gap-3 sm:gap-5 ${
                    gridCols === 2
                      ? "grid-cols-2 lg:grid-cols-2"
                      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3"
                  }`}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-[#f7f7f7] p-2 sm:p-3 animate-pulse"
                    >
                      <div className="rounded-xl bg-gray-200 aspect-[2/3] md:aspect-[3/4]" />
                      <div className="mt-4 h-4 bg-gray-200 rounded w-2/3" />
                      <div className="mt-2 h-3 bg-gray-200 rounded w-1/2" />
                      <div className="mt-3 h-4 bg-gray-200 rounded w-24" />
                      <div className="mt-4 h-10 bg-gray-200 rounded-xl" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16 text-gray-600">
                  No products found for this filter.
                </div>
              ) : (
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
                    const isWishlisted = wishlist.has(product._id);

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
                                <div className="absolute inset-0 grid place-items-center bg-gray-100 text-gray-400 text-xs">
                                  No image
                                </div>
                              )}
                            </div>
                          </Link>

                          {/* Heart - responsive size */}
                          <button
                            onClick={() => handleToggleWishlist(product._id)}
                            className="absolute top-2 right-2 sm:top-3 sm:right-3 inline-flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
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
              )}
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
                <FilterSidebar />
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

export default function ShopFilterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FilterContent />
    </Suspense>
  );
}
