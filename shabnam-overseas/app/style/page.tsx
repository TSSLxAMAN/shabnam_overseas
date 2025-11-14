"use client";

import { useEffect, useState, useMemo, useContext, Suspense } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Heart, Eye, ArrowUpFromDot } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthContext } from "@/app/context/UserAuthContext";

function StylePageContent() {
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
  };

  const STYLES = ["MODERN", "TRADITIONAL", "BOHEMIAN", "MINIMALIST", "VINTAGE"];

  // Extract unique sizes and colors from products
  const extractUniqueFilters = (products: Product[]) => {
    const sizes = new Set<string>();
    const colors = new Set<string>();
    let minPrice = Infinity;
    let maxPrice = 0;

    products.forEach((product) => {
      product.sizes?.forEach((size) => {
        sizes.add(size.label);
        minPrice = Math.min(minPrice, size.price);
        maxPrice = Math.max(maxPrice, size.price);
      });
      product.colors?.forEach((color) => {
        colors.add(color.label);
      });
    });

    return {
      sizes: Array.from(sizes).sort(),
      colors: Array.from(colors).sort(),
      minPrice: minPrice === Infinity ? 0 : minPrice,
      maxPrice,
    };
  };

  const convertCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;

  const { user } = useContext(AuthContext);
  const searchParams = useSearchParams();
  const urlFilter = searchParams.get("filter");

  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Filter states
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // Available filters
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });

  // Helper function to toggle array values
  const toggleInArray = <T,>(array: T[], value: T): T[] =>
    array.includes(value)
      ? array.filter((item) => item !== value)
      : [...array, value];

  // Initialize selected styles from URL parameter
  useEffect(() => {
    if (selectedStyles.length > 0) {
      const filterValue = `style:${selectedStyles.join(",")}`;
      fetchFilteredProducts(filterValue);
    } else if (urlFilter) {
      fetchFilteredProducts(urlFilter);
    } else {
      fetchFilteredProducts("");
    }
  }, [selectedStyles.join("|"), urlFilter]);

  // Normalize any wishlist GET payload into array of productIds
  const normalizeWishlistIds = (data: any): string[] => {
    if (!data) return [];
    if (Array.isArray(data)) {
      if (data.length === 0) return [];
      if (typeof data[0] === "string") return data as string[];
      if (typeof data[0] === "object" && data[0]?._id)
        return (data as any[]).map((x) => x._id);
    }
    if (Array.isArray(data?.wishlist)) {
      const w = data.wishlist;
      if (w.length === 0) return [];
      if (typeof w[0] === "string") return w as string[];
      if (typeof w[0] === "object" && w[0]?._id)
        return (w as any[]).map((x) => x._id);
    }
    if (Array.isArray(data?.user?.wishlist)) {
      const w = data.user.wishlist;
      if (w.length === 0) return [];
      if (typeof w[0] === "string") return w as string[];
      if (typeof w[0] === "object" && w[0]?._id)
        return (w as any[]).map((x) => x._id);
    }
    return [];
  };

  // Fetch products with style filters
  const fetchFilteredProducts = async (filterValue: string) => {
    setLoading(true);
    try {
      const url = `https://www.shabnamoverseas.com/api/filter/products?filter=${encodeURIComponent(
        filterValue
      )}`;
      const res = await axios.get(url);
      const data = res.data?.products ?? [];
      setAllProducts(data);
      setProducts(data);

      // Extract available filters from products
      const filters = extractUniqueFilters(data);
      setAvailableSizes(filters.sizes);
      setAvailableColors(filters.colors);
      setPriceRange({ min: filters.minPrice, max: filters.maxPrice });

      // Reset price inputs to show full range
      setPriceMin(filters.minPrice.toString());
      setPriceMax(filters.maxPrice.toString());
    } catch (error: any) {
      toast.error("Failed to load products.");
      setProducts([]);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [priceMin, priceMax, selectedSizes, selectedColors, allProducts]);

  const applyFilters = () => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts];

    // Price filter
    const minPrice = parseFloat(priceMin) || priceRange.min;
    const maxPrice = parseFloat(priceMax) || priceRange.max;

    filtered = filtered.filter((product) =>
      product.sizes?.some(
        (size) => size.price >= minPrice && size.price <= maxPrice
      )
    );

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.sizes?.some((size) => selectedSizes.includes(size.label))
      );
    }

    // Color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter((product) =>
        product.colors?.some((color) => selectedColors.includes(color.label))
      );
    }

    setProducts(filtered);
  };

  // Preload wishlist
  const preloadWishlist = async () => {
    if (!user?.token) return;
    try {
      const r1 = await axios.get(
        "https://www.shabnamoverseas.com/api/users/wishlist",
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
        "https://www.shabnamoverseas.com/api/users/me",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const ids2 = normalizeWishlistIds(r2.data);
      if (ids2.length) {
        setWishlist(new Set(ids2));
        return;
      }

      const r3 = await axios.get(
        "https://www.shabnamoverseas.com/api/users/profile",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const ids3 = normalizeWishlistIds(r3.data);
      setWishlist(new Set(ids3));
    } catch (err) {
      // console.warn("Wishlist preload failed (non-fatal).");
    }
  };

  // Effects
  useEffect(() => {
    const filterValue =
      selectedStyles.length > 0 ? `style:${selectedStyles.join(",")}` : "";
    fetchFilteredProducts(filterValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStyles.join("|")]);

  useEffect(() => {
    preloadWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  // Handlers
  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

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
          `https://www.shabnamoverseas.com/api/users/wishlist/${productId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        toast.success("Removed from wishlist");
      } else {
        await axios.post(
          `https://www.shabnamoverseas.com/api/users/wishlist/${productId}`,
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

  // Get the lowest price from all sizes
  const getLowestPrice = (sizes: Product["sizes"]) => {
    if (!sizes || sizes.length === 0) return 0;
    return Math.min(...sizes.map((size) => size.price));
  };

  // Filter Content Component
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
          <div className="mt-2 text-xs text-gray-500">
            Range: {convertCurrency(priceRange.min)} -{" "}
            {convertCurrency(priceRange.max)}
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
        <div className="px-5 pb-4 text-sm max-h-60 overflow-y-auto">
          {availableSizes.map((size) => (
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
        <div className="px-5 pb-4 text-sm max-h-60 overflow-y-auto">
          {availableColors.map((color) => (
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

      {/* Clear Filters */}
      {(selectedSizes.length > 0 ||
        selectedColors.length > 0 ||
        priceMin !== priceRange.min.toString() ||
        priceMax !== priceRange.max.toString()) && (
        <button
          onClick={() => {
            setSelectedSizes([]);
            setSelectedColors([]);
            setPriceMin(priceRange.min.toString());
            setPriceMax(priceRange.max.toString());
          }}
          className="w-full px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-xl transition"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  // UI
  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#f7f7f7] p-4 animate-pulse">
              <div className="rounded-xl bg-gray-200 aspect-[3/4] md:aspect-[2/3]" />
              <div className="mt-4 h-4 bg-gray-200 rounded w-2/3" />
              <div className="mt-2 h-3 bg-gray-200 rounded w-1/2" />
              <div className="mt-3 h-4 bg-gray-200 rounded w-24" />
              <div className="mt-4 h-10 bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
      );
    }

    if (!products.length) {
      return (
        <div className="text-center py-16 text-gray-600">
          No products matching the selected filters were found.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {products.map((product) => {
          const images = Array.isArray(product.image) ? product.image : [];
          const primary = typeof images[0] === "string" ? images[0] : "";
          const secondary = typeof images[1] === "string" ? images[1] : "";
          const isWishlisted = wishlist.has(product._id);
          const lowestPrice = getLowestPrice(product.sizes);

          return (
            <article
              key={product._id}
              className="group rounded-2xl bg-[#f7f7f7] p-3 sm:p-4"
            >
              <div className="relative">
                <Link href={`/product/${product._id}`}>
                  <div className="relative overflow-hidden rounded-xl bg-white aspect-[3/4] md:aspect-[2/3]">
                    {primary ? (
                      <>
                        <Image
                          src={primary}
                          alt={product.name}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                        />
                        {!!secondary && (
                          <Image
                            src={secondary}
                            alt={`${product.name} alt`}
                            fill
                            sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-cover absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          />
                        )}
                      </>
                    ) : (
                      <div className="absolute inset-0 grid place-items-center bg-gray-100 text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                </Link>

                <button
                  className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
                  aria-label="Wishlist"
                  onClick={() => handleToggleWishlist(product._id)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isWishlisted
                        ? "text-red-500 fill-red-500"
                        : "text-gray-700"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-4">
                <Link href={`/product/${product._id}`}>
                  <h3 className="font-medium text-[17px] hover:underline line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {product.description}
                </p>
                <div className="mt-2 font-semibold">
                  Starting at {convertCurrency(lowestPrice)}
                </div>

                {product.style && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-white border">
                      {product.style}
                    </span>
                  </div>
                )}

                <div className="mt-4">
                  <select
                    className="w-full mb-2 px-3 py-2 rounded-lg border border-gray-300"
                    id={`size-select-${product._id}`}
                  >
                    {product.sizes.map((size) => (
                      <option key={size.label} value={size.label}>
                        {size.label} - {convertCurrency(size.price)}{" "}
                        {size.stock === 0 ? "(Out of stock)" : ""}
                      </option>
                    ))}
                  </select>

                  <a
                    href={`/product/${product._id}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#742402] hover:bg-[#5c1c01] transition text-white font-serif tracking-wide"
                  >
                    <Eye />
                    View Product
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  }, [loading, products, wishlist]);

  return (
    <>
      <Navbar forceWhite={true} disableScrollEffect={true} />

      {/* Hero */}
      <main className="pt-[125px] bg-white text-black w-full">
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-6xl py-12 sm:py-16 md:py-20">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] break-words text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              SHOP BY STYLE
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
              Find Your Perfect Rug Style
            </p>
          </div>
        </section>

        {/* Style filter links */}
        <section className="px-4 sm:px-6 lg:px-10 mt-8">
          <div className="max-w-6xl mx-auto flex flex-wrap gap-3 justify-center">
            {STYLES.map((style) => {
              const active = selectedStyles.includes(style);
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleStyle(style)}
                  aria-pressed={active}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition transform active:scale-[0.98] ${
                    active
                      ? "bg-[#742402] text-white border-[#742402]"
                      : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                  }`}
                >
                  {style.charAt(0) + style.slice(1).toLowerCase()}
                </button>
              );
            })}
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-10 pb-20 mt-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="sticky top-32">
                  <h2 className="text-lg font-semibold mb-4">Filters</h2>
                  <FilterContent />
                </div>
              </div>

              {/* Products Grid */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-gray-600">
                    {products.length} products
                  </p>
                </div>
                {content}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default function StylePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StylePageContent />
    </Suspense>
  );
}
