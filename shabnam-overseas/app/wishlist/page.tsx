"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/UserAuthContext";

type Size = {
  label: string;
  price: number;
  stock: number;
  _id: string;
};

type Color = {
  label: string;
  _id: string;
};

type Product = {
  _id: string;
  name: string;
  image: string[]; // Updated: now an array
  description: string;
  category: string;
  sizes: Size[]; // Updated: added sizes array
  colors: Color[]; // Updated: added colors array
  byType: string;
  byRoom: string;
  style: string;
  slug?: string;
};

const PRODUCT_PAGE_BASE = "/product";

export default function WishlistPage() {
  const { user } = useAuth();
  const [WishlistCount, setWishlistCount] = useState(0);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const INR = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }),
    []
  );

  const broadcastWishlistCount = (count: number) => {
    try {
      setWishlistCount(count);
    } catch {}
  };

  const productHref = (p: Product) => {
    if (p.slug) return `${PRODUCT_PAGE_BASE}/${encodeURIComponent(p.slug)}`;
    return `${PRODUCT_PAGE_BASE}/${encodeURIComponent(p._id)}`;
  };

  // Helper function to get the main image (first image from array)
  const getMainImage = (product: Product) => {
    return Array.isArray(product.image) && product.image.length > 0
      ? product.image[0]
      : "";
  };

  // Helper function to get the starting price (minimum price from sizes)
  const getStartingPrice = (product: Product) => {
    if (!product.sizes || product.sizes.length === 0) return 0;
    return Math.min(...product.sizes.map((size) => size.price));
  };

  // Helper function to format price display
  const formatPriceDisplay = (product: Product) => {
    if (!product.sizes || product.sizes.length === 0)
      return "Price not available";

    const prices = product.sizes.map((size) => size.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return INR.format(Math.round(minPrice));
    } else {
      return `${INR.format(Math.round(minPrice))} - ${INR.format(
        Math.round(maxPrice)
      )}`;
    }
  };

  useEffect(() => {
    let unsub = false;
    (async () => {
      if (!user?.token) {
        setLoading(false);
        broadcastWishlistCount(0);
        return;
      }
      try {
        const { data } = await axios.get(
          "https://api.shabnamoverseas.com/api/users/wishlist",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const items: Product[] = Array.isArray(data)
          ? data
          : data?.wishlist || [];
        if (!unsub) {
          setWishlist(items);
          broadcastWishlistCount(items.length);
        }
      } catch (err) {
        // console.error("Error fetching wishlist", err);
      } finally {
        if (!unsub) setLoading(false);
      }
    })();
    return () => {
      unsub = true;
    };
  }, [user?.token]);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const { data } = await axios.delete(
        `https://api.shabnamoverseas.com/api/users/wishlist/${productId}`,
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setWishlist((prev) => {
        const next = prev.filter((item) => item._id !== productId);
        broadcastWishlistCount(next.length);
        return next;
      });
      toast.success(data?.message || "Removed from wishlist");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Error removing from wishlist"
      );
    }
  };

  if (!user?.token) {
    return (
      <>
        <Navbar forceWhite disableScrollEffect />
        <main className="pt-[170px] bg-white text-black w-full">
          <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
            <div className="w-full max-w-5xl py-12 sm:py-16 md:py-20">
              <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                My Wishlist
              </h1>
              <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
                Please log in to view your saved items.
              </p>
            </div>
          </section>
          <section className="max-w-5xl mx-auto mt-10 px-6 lg:px-12 pb-20">
            <div className="mx-auto max-w-md bg-[#f2f2f2] p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full bg-[#742402] hover:bg-[#5c1c01] transition text-white py-3 rounded-xl uppercase font-semibold tracking-wide"
              >
                Go to Login
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar forceWhite disableScrollEffect />
        <main className="pt-[170px] bg-white text-black w-full">
          <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
            <div className="w-full max-w-5xl py-12 sm:py-16 md:py-20">
              <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                My Wishlist
              </h1>
              <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
                Loading your saved items…
              </p>
            </div>
          </section>
          <section className="max-w-6xl mx-auto mt-10 px-6 lg:px-12 pb-20">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-200 bg-[#f2f2f2] p-4 shadow-sm"
                >
                  <div className="h-48 w-full rounded-xl bg-gray-200 animate-pulse" />
                  <div className="mt-3 h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
                  <div className="mt-2 h-3 w-1/3 rounded bg-gray-200 animate-pulse" />
                  <div className="mt-4 h-10 w-full rounded bg-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar forceWhite disableScrollEffect />
      <main className="pt-[170px] bg-white text-black w-full">
        {/* Hero */}
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-5xl py-12 sm:py-16 md:py-20">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              My Wishlist
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
              Save your favorite pieces for later.
            </p>
          </div>
        </section>
        <section className="max-w-6xl mx-auto mt-10 px-6 lg:px-12 pb-20">
          {wishlist.length === 0 ? (
            <div className="mx-auto max-w-md bg-[#f2f2f2] p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
              <p className="text-gray-700">No items in your wishlist yet.</p>
              <Link
                href="/shop"
                className="mt-4 inline-flex items-center justify-center w-full bg-[#742402] hover:bg-[#5c1c01] transition text-white py-3 rounded-xl uppercase font-semibold tracking-wide"
              >
                Browse the Shop
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishlist.map((p) => (
                <article
                  key={p._id}
                  className="rounded-2xl border border-gray-200 bg-[#f2f2f2] p-4 shadow-sm flex flex-col"
                >
                  <Link href={productHref(p)} className="block">
                    <img
                      src={getMainImage(p)}
                      alt={p.name}
                      className="h-48 w-full rounded-xl object-cover border border-gray-200 transition hover:opacity-90"
                    />
                  </Link>
                  <div className="mt-3 flex-1">
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                      <Link
                        href={productHref(p)}
                        className="underline-offset-2 hover:underline text-[#742402]"
                      >
                        {p.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-700 font-medium">
                      {formatPriceDisplay(p)}
                    </p>
                    {/* Additional product info */}
                    <div className="mt-2 space-y-1">
                      {p.category && (
                        <p className="text-xs text-gray-500">
                          Category: {p.category}
                        </p>
                      )}
                      {p.byRoom && (
                        <p className="text-xs text-gray-500">
                          Room: {p.byRoom}
                        </p>
                      )}
                      {p.style && (
                        <p className="text-xs text-gray-500">
                          Style: {p.style}
                        </p>
                      )}
                      {p.colors && p.colors.length > 0 && (
                        <p className="text-xs text-gray-500">
                          Colors: {p.colors.map((c) => c.label).join(", ")}
                        </p>
                      )}
                      {p.sizes && p.sizes.length > 0 && (
                        <p className="text-xs text-gray-500">
                          Sizes: {p.sizes.map((s) => s.label).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href={productHref(p)}
                      className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleRemoveFromWishlist(p._id)}
                      className="inline-flex items-center justify-center rounded-xl bg-[#742402] hover:bg-[#5c1c01] text-white px-3 py-2 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
