"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/app/context/UserAuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Info } from "lucide-react";

const CART_USES_ITEM_ID = false;
const UPDATE_METHOD: "put" | "patch" | "post" = "put";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://www.shabnamoverseas.com/api";
const CART_ENDPOINT = `${API_BASE}/cart`;
const buildItemUrl = (id: string) => `${CART_ENDPOINT}/${id}`;

// Updated Product type to match your API response
type ProductSize = {
  label: "2x3" | "3x5" | "4x6" | "5x8" | "6x9";
  price: number;
  stock: number;
  _id: string;
};

type ProductColor = {
  label: "RED" | "BLUE" | "BEIGE" | "GREEN" | "GREY";
  _id: string;
};

type Product = {
  _id: string;
  name: string;
  description?: string;
  image: string[];
  category?: string;
  sizes: ProductSize[];
  colors: ProductColor[];
  byType?: "HAND-KNOTTED" | "HAND-TUFTED" | "FLAT WEAVE" | "DHURRIE" | "KILIM";
  byRoom?: "LIVING ROOM" | "BEDROOM" | "DINING ROOM" | "HALLWAY";
  style?: "MODERN" | "TRADITIONAL" | "BOHEMIAN" | "MINIMALIST" | "VINTAGE";
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

// CartItem type matching your API response
type CartItem = {
  _id: string;
  product: Product | null;
  quantity: number;
  price: number;
  size?: string; // Size as string from your API
  color?: string; // Color as string from your API
};

const PRODUCT_PAGE_BASE = "/product";

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const INR = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }),
    []
  );

  const productHref = (item: CartItem) => {
    const p = item.product;
    if (!p) return "/shop";
    if (p.slug) return `${PRODUCT_PAGE_BASE}/${encodeURIComponent(p.slug)}`;
    return `${PRODUCT_PAGE_BASE}/${encodeURIComponent(p._id)}`;
  };

  // Helper function to get selected size object from size string
  const getSelectedSize = (item: CartItem): ProductSize | null => {
    if (!item.product || !item.size) return null;
    return item.product.sizes.find((s) => s.label === item.size) || null;
  };

  // Helper function to get selected color object from color string
  const getSelectedColor = (item: CartItem): ProductColor | null => {
    if (!item.product || !item.color) return null;
    return item.product.colors.find((c) => c.label === item.color) || null;
  };

  // Helper function to get item price
  const getItemPrice = (item: CartItem): number => {
    // console.log(item)
    // Fallback to first size price if no specific size
    if (item.price) {
      return item.price;
    }

    return 0;
  };

  // Helper function to get available stock
  const getAvailableStock = (item: CartItem): number => {
    if (!item.product) return 0;

    // If size is specified, get stock from that size
    if (item.size) {
      const selectedSize = getSelectedSize(item);
      if (selectedSize) return selectedSize.stock;
    }

    // Fallback to first size stock
    if (item.product.sizes && item.product.sizes.length > 0) {
      return item.product.sizes[0].stock;
    }

    return 999; // Default high stock
  };

  const getActionId = (item: CartItem) => {
    return CART_USES_ITEM_ID
      ? item._id
      : `${item.product?._id || item._id}-${item.size || "default"}-${
          item.color || "default"
        }`;
  };

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data } = await axios.get(CART_ENDPOINT, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        // console.log("Cart API Response:", data); // Debug log

        const items = Array.isArray(data) ? data : data?.items || [];
        // console.log(items)
        // Filter out items with null products and ensure proper structure
        const validItems = items.filter((item: CartItem) => {
          if (!item.product) {
            // console.log("Filtering out item with null product:", item._id);
            return false;
          }
          return true;
        });

        // console.log("Valid cart items:", validItems); // Debug log
        setCart(validItems);
      } catch (err) {
        // console.error("Error fetching cart", err);
        setCart([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.token]);

  const handleRemove = async (id: string) => {
    if (!user?.token) return;

    const itemToRemove = cart.find((item) => getActionId(item) === id);
    if (!itemToRemove || !itemToRemove.product) return;

    try {
      setUpdatingId(id);
      const prev = cart;
      const next = prev.filter((it) => getActionId(it) !== id);
      setCart(next);

      // Use the product ID for deletion (not cart item ID)
      await axios.delete(`${CART_ENDPOINT}/${itemToRemove.product._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
    } catch (err: any) {
      // console.error("Error removing from cart:", err?.response?.data || err);
      // Revert on error
      try {
        const { data } = await axios.get(CART_ENDPOINT, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const items = Array.isArray(data) ? data : data?.items || [];
        const validItems = items.filter(
          (item: CartItem) => item.product !== null
        );
        setCart(validItems);
      } catch (_) {
        // If refetch fails, just keep current state
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleQuantityChange = async (id: string, qty: number) => {
    if (!user?.token || qty < 1) return;

    const item = cart.find((item) => getActionId(item) === id);
    if (!item || !item.product) return;

    const availableStock = getAvailableStock(item);
    if (qty > availableStock) return;

    const prev = cart;
    const next = cart.map((it) =>
      getActionId(it) === id ? { ...it, quantity: qty } : it
    );

    setUpdatingId(id);
    setCart(next);

    try {
      // Update quantity using the product ID (not cart item ID)
      await axios.put(
        `${CART_ENDPOINT}/${item.product._id}`,
        { quantity: qty },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
    } catch (err: any) {
      // console.error("Update qty failed:", err?.response?.data || err);
      setCart(prev);
    } finally {
      setUpdatingId(null);
    }
  };

  const subtotal = cart.reduce((acc, item) => {
    const price = getItemPrice(item);
    const quantity = Number(item.quantity || 0);
    return acc + price * quantity;
  }, 0);

  if (!user?.token) {
    return (
      <>
        <Navbar forceWhite disableScrollEffect />
        <main className="pt-[170px] bg-white text-black w-full">
          <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
            <div className="w-full max-w-5xl py-12 sm:py-16 md:py-20">
              <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                My Cart
              </h1>
              <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
                Please log in to view your cart.
              </p>
            </div>
          </section>
          <section className="max-w-5xl mx-auto mt-10 px-6 lg:px-12 pb-20">
            <div className="mx-auto w-full max-w-md bg-[#f2f2f2] p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
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
        <main className="pt-[125px] bg-white text-black w-full">
          <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
            <div className="w-full max-w-5xl py-12 sm:py-16 md:py-20">
              <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                My Cart
              </h1>
              <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
                Loading your items…
              </p>
            </div>
          </section>
          <section className="max-w-6xl mx-auto mt-10 px-6 lg:px-12 pb-20">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-gray-200 bg-[#f2f2f2] p-4"
                  >
                    <div className="flex gap-4">
                      <div className="h-24 w-24 rounded-xl bg-gray-200 animate-pulse" />
                      <div className="flex-1">
                        <div className="h-5 w-3/4 bg-gray-200 rounded mb-2 animate-pulse" />
                        <div className="h-4 w-1/2 bg-gray-200 rounded mb-2 animate-pulse" />
                        <div className="h-9 w-40 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-gray-200 bg-[#f2f2f2] p-6 h-fit">
                <div className="h-5 w-32 bg-gray-200 rounded mb-3 animate-pulse" />
                <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
              </div>
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
      <main className="pt-[125px] bg-white text-black w-full">
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-5xl py-12 sm:py-16 md:py-20">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              My Cart
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
              Review your items before checkout.
            </p>
          </div>
        </section>
        <section className="max-w-6xl mx-auto mt-10 px-6 lg:px-12 font-serif pb-20">
          {cart.length === 0 ? (
            <div className="mx-auto max-w-md bg-[#f2f2f2] p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
              <p className="text-gray-700">Your cart is empty.</p>
              <Link
                href="/shop"
                className="mt-4 inline-flex items-center justify-center w-full bg-[#742402] hover:bg-[#5c1c01] transition text-white py-3 rounded-xl uppercase font-semibold tracking-wide"
              >
                Browse the Shop
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => {
                  if (!item.product) return null; // Safety check

                  const actionId = getActionId(item);
                  const img = item.product.image?.[0];
                  const qty = item.quantity || 0;
                  const unit = getItemPrice(item);
                  // console.log(unit)
                  const line = unit * qty;
                  const availableStock = getAvailableStock(item);
                  const selectedSize = getSelectedSize(item);
                  const selectedColor = getSelectedColor(item);

                  return (
                    <article
                      key={actionId}
                      className="rounded-2xl border border-gray-200 bg-[#f2f2f2] p-4"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          href={productHref(item)}
                          className="block shrink-0"
                        >
                          <img
                            src={img || "/placeholder-image.jpg"}
                            alt={item.product.name || "Product"}
                            className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl object-cover border border-gray-200 transition hover:opacity-90"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-image.jpg";
                            }}
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
                            <Link
                              href={productHref(item)}
                              className="underline-offset-2 hover:underline text-[#742402]"
                            >
                              {item.product.name}
                            </Link>
                          </h3>

                          {/* Product Details */}
                          <div className="mt-2 space-y-2">
                            {/* Size and Color - Prominent Display */}
                            {(item.size || item.color) && (
                              <div className="flex flex-wrap gap-2">
                                {item.size && (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                    Size: {item.size}
                                  </span>
                                )}
                                {item.color && (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                    Color: {item.color}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Additional Details */}
                            <div className="text-sm text-gray-600 space-y-1">
                              {item.product.category && (
                                <div>
                                  Category:{" "}
                                  <span className="font-medium text-gray-800">
                                    {item.product.category}
                                  </span>
                                </div>
                              )}
                              {item.product.byType && (
                                <div>
                                  Type:{" "}
                                  <span className="font-medium text-gray-800">
                                    {item.product.byType}
                                  </span>
                                </div>
                              )}
                              {availableStock < 999 && (
                                <div className="flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                  <span className="font-medium text-gray-800">
                                    In stock
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              Unit Price:{" "}
                              <span className="font-bold text-lg text-gray-900">
                                {INR.format(Math.round(unit))}
                              </span>
                              {item.size && selectedSize && (
                                <span className="text-xs text-gray-500 ml-1">
                                  (for {item.size})
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 inline-flex items-center rounded-xl border border-gray-300 bg-white">
                            <button
                              aria-label="Decrease quantity"
                              className="px-3 py-2 text-sm disabled:opacity-40 hover:bg-gray-50"
                              onClick={() =>
                                handleQuantityChange(actionId, qty - 1)
                              }
                              disabled={qty <= 1 || updatingId === actionId}
                            >
                              −
                            </button>
                            <span className="px-4 py-2 text-sm font-semibold border-x border-gray-300">
                              {qty}
                            </span>
                            <button
                              aria-label="Increase quantity"
                              className="px-3 py-2 text-sm disabled:opacity-50 hover:bg-gray-50"
                              onClick={() =>
                                handleQuantityChange(actionId, qty + 1)
                              }
                              disabled={
                                updatingId === actionId || qty >= availableStock
                              }
                            >
                              +
                            </button>
                          </div>

                          {/* Stock warning */}
                          {qty >= availableStock && availableStock < 999 && (
                            <div className="mt-2 text-xs text-amber-600 font-medium">
                              Maximum stock reached
                            </div>
                          )}
                        </div>

                        <div className="sm:text-right">
                          <div className="text-xs text-gray-600">
                            Line total
                          </div>
                          <div className="text-base font-bold text-gray-900">
                            {INR.format(Math.round(line))}
                          </div>
                          <button
                            onClick={() => handleRemove(actionId)}
                            className="mt-3 inline-flex items-center rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60 transition"
                            disabled={updatingId === actionId}
                          >
                            {updatingId === actionId ? "Removing..." : "Remove"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="rounded-2xl border border-gray-200 bg-[#f2f2f2] p-6 h-fit">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-gray-700">Subtotal</dt>
                    <dd className="font-medium text-gray-900">
                      {INR.format(Math.round(subtotal))}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <dt>
                      Items (
                      {cart.reduce((acc, item) => acc + item.quantity, 0)})
                    </dt>
                    <dd></dd>
                  </div>
                </dl>
                <div className="mt-4 border-t border-gray-300 pt-3 flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    {INR.format(Math.round(subtotal))}
                  </span>
                </div>
                <div className="border-gray-300 flex items-center justify-between relative">
                  <span className="text-base font-semibold text-gray-900">
                    Shipping
                  </span>
                  <div
                    className="relative"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <span className="text-xl font-bold text-gray-900 cursor-help">
                      <Info size={16} strokeWidth={1} />
                    </span>

                    {/* Tooltip */}
                    {showTooltip && (
                      <div className="absolute right-0 top-6 w-64 bg-white text-black text-sm rounded-lg p-3 shadow-lg z-10 border border-red-900">
                        <div className="relative">
                          {/* Arrow pointing up */}
                          <div className="absolute -top-2 right-3 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-red-800"></div>

                          <p className="leading-relaxed text-xs ">
                            Shipping depends on size, quantity, and shipping
                            address. You will be informed via SMS or call
                            regarding delivery details after placing the order.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => router.push("/checkout")}
                  className="mt-4 w-full bg-[#742402] hover:bg-[#5c1c01] transition text-white py-2 rounded-xl tracking-wide font-medium"
                  disabled={cart.length === 0}
                >
                  Checkout
                </button>
                <Link
                  href="/shop"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </Link>
              </aside>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
