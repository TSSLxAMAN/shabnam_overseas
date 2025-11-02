"use client";

import { useEffect, useState, useContext, Suspense } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthContext } from "@/app/context/UserAuthContext";

function FilterContent() {
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
  };

  const convertCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;

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
  const filter = searchParams.get("filter");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

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
      const url = `https://www.shabnamoverseas.com/api/filter/products?filter=${encodeURIComponent(
        filterValue
      )}`;
      const res = await axios.get(url);
      const data = res.data?.products ?? [];
      setProducts(data);
    } catch (error: any) {
      console.error("Failed to fetch products", error?.message || error);
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
      const r1 = await axios.get("https://www.shabnamoverseas.com/api/users/wishlist", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const ids1 = normalizeWishlistIds(r1.data);
      if (ids1.length || Array.isArray(r1.data)) {
        setWishlist(new Set(ids1));
        return;
      }

      const r2 = await axios.get("https://www.shabnamoverseas.com/api/users/me", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const ids2 = normalizeWishlistIds(r2.data);
      if (ids2.length) {
        setWishlist(new Set(ids2));
        return;
      }
    } catch (err) {
      console.warn("Wishlist preload failed");
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

  // Effects
  useEffect(() => {
    if (filter) {
      fetchFilteredProducts(filter);
    } else {
      // If no filter, show all products
      fetchFilteredProducts("");
    }
  }, [filter]);

  useEffect(() => {
    preloadWishlist();
  }, [user?.token]);

  // Get display name for the current filter
  const getFilterDisplayName = () => {
    if (!filter) return "All Products";

    // Extract the value part after the colon (if exists)
    const value = filter.includes(":") ? filter.split(":")[1] : filter;
    return FILTER_DISPLAY_NAMES[value.toUpperCase()] || value;
  };

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

        {/* Products Section */}
        <section className="px-4 sm:px-6 lg:px-10 pb-20 mt-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-gray-600">
                {products.length} products found
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-[#f7f7f7] p-4 animate-pulse"
                  >
                    <div className="rounded-xl bg-gray-200 aspect-[3/4] md:aspect-[2/3]" />
                    <div className="mt-4 h-4 bg-gray-200 rounded w-2/3" />
                    <div className="mt-2 h-3 bg-gray-200 rounded w-1/2" />
                    <div className="mt-3 h-4 bg-gray-200 rounded w-24" />
                    <div className="mt-4 h-10 bg-gray-200 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-gray-600">
                No products found for this filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => {
                  const images = Array.isArray(product.image)
                    ? product.image
                    : [];
                  const primary =
                    typeof images[0] === "string" ? images[0] : "";
                  const isWishlisted = wishlist.has(product._id);
                  const lowestPrice = getLowestPrice(product.sizes);

                  return (
                    <article
                      key={product._id}
                      className="group rounded-2xl bg-[#f7f7f7] p-4"
                    >
                      <div className="relative">
                        <Link href={`/product/${product._id}`}>
                          <div className="relative overflow-hidden rounded-xl bg-white aspect-[3/4] md:aspect-[2/3]">
                            {primary ? (
                              <Image
                                src={primary}
                                alt={product.name}
                                fill
                                sizes="(min-width: 768px) 33vw, 100vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
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
                        <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                          {product.description}
                        </p>
                        <div className="mt-2 font-semibold">
                          Starting at {convertCurrency(lowestPrice)}
                        </div>

                        {/* Product attributes */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {product.style && (
                            <span className="text-xs px-2 py-1 rounded bg-white border">
                              {product.style}
                            </span>
                          )}
                          {product.byType && (
                            <span className="text-xs px-2 py-1 rounded bg-white border">
                              {product.byType}
                            </span>
                          )}
                        </div>

                        {/* View Product Button */}
                        <div className="mt-4">
                          <Link
                            href={`/product/${product._id}`}
                            className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#742402] hover:bg-[#5c1c01] transition text-white uppercase font-semibold tracking-wide text-center"
                          >
                            View Product
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
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