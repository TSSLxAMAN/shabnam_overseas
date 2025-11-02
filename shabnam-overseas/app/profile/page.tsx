"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface User {
  name: string;
  email: string;
}

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
    description?: string; // may or may not come from your orders API
    slug?: string;        // optional, if your orders API includes it
  };
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  totalPrice: number;
  createdAt: string;
}

/** ---------------------------------------
 * CONFIG: set your product page route base
 * If your route is /products/[slug or id], change to "/products"
 * --------------------------------------*/
const PRODUCT_PAGE_BASE = "/product";

// If your product detail endpoint is different, tweak here:
const productDetailEndpoint = (id: string) =>
  `https://www.shabnamoverseas.com/api/products/${encodeURIComponent(id)}`;

export default function ProfilePage() {
  const [user, setUser] = useState<User>({ name: "", email: "" });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Cache product metadata we fetch on-demand (by id)
  const [productInfoMap, setProductInfoMap] = useState<
    Record<string, { description?: string; slug?: string }>
  >({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo");
        const token = userInfo ? JSON.parse(userInfo).token : null;

        if (!token) {
          console.error("No token found, user not logged in.");
          return;
        }

        const { data } = await axios.get(`https://www.shabnamoverseas.com/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.user && data.orders) {
          setUser({ name: data.user.name, email: data.user.email });
          setOrders(data.orders);
        } else {
          setUser({ name: data.name, email: data.email });
          if (data.orders) setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  // After orders load, fetch descriptions/slugs for any products missing them
  useEffect(() => {
    if (!orders.length) return;

    const missingIds = new Set<string>();
    for (const o of orders) {
      for (const it of o.orderItems) {
        const id = it.product?._id;
        if (!id) continue;
        const hasDesc = Boolean(it.product?.description);
        const cached = productInfoMap[id];
        if (!hasDesc && !cached) missingIds.add(id);
      }
    }
    if (!missingIds.size) return;

    (async () => {
      try {
        const results = await Promise.all(
          Array.from(missingIds).map(async (id) => {
            try {
              const res = await fetch(productDetailEndpoint(id));
              if (!res.ok) return { id, info: {} as any };
              const p = await res.json();
              // Try common shapes for slug/description
              const slug =
                p?.slug || p?.product?.slug || p?.data?.slug || undefined;
              const description =
                p?.description || p?.product?.description || p?.data?.description || undefined;
              return { id, info: { slug, description } };
            } catch {
              return { id, info: {} as any };
            }
          })
        );
        setProductInfoMap((prev) => {
          const next = { ...prev };
          for (const { id, info } of results) next[id] = { ...(next[id] || {}), ...info };
          return next;
        });
      } catch (e) {
        // Silent; UI still works without fetched descriptions
        console.warn("[profile] product enrichment failed", e);
      }
    })();
  }, [orders, productInfoMap]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userInfo = localStorage.getItem("userInfo");
      const token = userInfo ? JSON.parse(userInfo).token : null;
      if (!token) {
        console.error("No token found, user not logged in.");
        return;
      }
      await axios.put(`https://www.shabnamoverseas.com/api/users/profile`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const placeholderImg = "/placeholder.jpg";

  // Build best product link (prefer slug, then id; both support image+title click)
  const productHref = (it: OrderItem) => {
    const id = it?.product?._id;
    const slug = it?.product?.slug || (id ? productInfoMap[id]?.slug : undefined);
    if (slug) return `${PRODUCT_PAGE_BASE}/${encodeURIComponent(slug)}`;
    if (id) return `${PRODUCT_PAGE_BASE}/${encodeURIComponent(String(id))}`;
    return `/shop?search=${encodeURIComponent(it?.product?.name || "")}`;
  };

  const INR = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  if (loading) {
    return (
      <>
        <Navbar forceWhite disableScrollEffect />
        <main className="pt-[125px] bg-white text-black w-full">
          <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
            <div className="w-full max-w-5xl py-12 sm:py-16 md:py-20">
              <div className="h-10 w-72 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
              <div className="h-5 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>
          </section>
          <section className="max-w-5xl mx-auto mt-10 px-6 lg:px-12 pb-16">
            <div className="grid gap-6">
              <div className="bg-[#f2f2f2] rounded-2xl p-6 md:p-8 border border-gray-200">
                <div className="h-6 w-40 bg-gray-200 rounded mb-6 animate-pulse" />
                <div className="space-y-4">
                  <div className="h-11 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-11 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-11 w-40 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="bg-[#f2f2f2] rounded-2xl p-6 md:p-8 border border-gray-200">
                <div className="h-6 w-48 bg-gray-200 rounded mb-6 animate-pulse" />
                <div className="space-y-4">
                  {[0, 1].map((k) => (
                    <div key={k} className="rounded-xl border border-gray-200 bg-white p-4 flex gap-4">
                      <div className="h-20 w-20 bg-gray-200 rounded-lg animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 w-2/3 bg-gray-200 rounded mb-2 animate-pulse" />
                        <div className="h-3 w-1/2 bg-gray-200 rounded mb-1 animate-pulse" />
                        <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="w-24 h-6 bg-gray-200 rounded self-start animate-pulse" />
                    </div>
                  ))}
                </div>
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
      {/* ✅ Always-white navbar, no effect */}
      <Navbar forceWhite disableScrollEffect />

      <main className="pt-[125px] bg-white text-black w-full">
        {/* Hero Header (matches appointment style) */}
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-5xl py-12 sm:py-16 md:py-20">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] break-words text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              MY PROFILE
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
              Manage your details & view your orders.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-5xl mx-auto mt-10 px-6 lg:px-12 pb-20">
          {/* Profile Card */}
          <form
            onSubmit={handleSave}
            className="bg-[#f2f2f2] p-6 md:p-8 rounded-2xl shadow-lg space-y-5 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900">Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="p-3 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30"
                required
              />
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="p-3 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30"
                required
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full md:w-auto bg-[#742402] hover:bg-[#5c1c01] transition text-white px-6 py-3 uppercase font-semibold tracking-wide rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </form>

          {/* Orders Card */}
          <div className="mt-8 bg-[#f2f2f2] p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
              {orders?.length > 0 && (
                <span className="text-xs text-gray-600">Total: {orders.length}</span>
              )}
            </div>

            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <section
                    key={order._id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 space-y-4"
                  >
                    {/* Order meta */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm text-gray-700">
                        <span className="font-medium text-gray-900">Order ID:</span>{" "}
                        <span className="font-mono">{order._id}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        Total: ₹{Math.round(order.totalPrice).toLocaleString("en-IN")}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="grid gap-4">
                      {order.orderItems.map((it, idx) => {
                        const href = productHref(it);
                        const qty = it.qty;
                        const unit = it.price;
                        const lineTotal = qty * unit;

                        // Prefer inline description; else use fetched cache (by id)
                        const id = it?.product?._id;
                        const desc =
                          it?.product?.description ||
                          (id ? productInfoMap[id]?.description : undefined);
                        const hasFallback = href.startsWith("/shop?search=");

                        return (
                          <article
                            key={order._id + ":" + idx}
                            className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-200 bg-white"
                          >
                            {/* Image */}
                            <div className="shrink-0">
                              <Link href={href} aria-label={`Open product: ${it.product?.name}`} className="block">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={it.product?.image || placeholderImg}
                                  alt={it.product?.name || "Product image"}
                                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-lg object-cover border border-gray-200 transition hover:opacity-90"
                                />
                              </Link>
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                                <Link
                                  href={href}
                                  className="underline-offset-2 hover:underline text-[#742402]"
                                >
                                  {it.product?.name || "Unnamed Product"}
                                </Link>
                                {hasFallback && (
                                  <span className="ml-2 inline-flex items-center rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200 px-2 py-0.5 text-[10px] font-medium">
                                    unresolved link
                                  </span>
                                )}
                              </h3>

                              {/* ✅ Product description inside the card */}
                              {desc && (
                                <p className="mt-1 text-xs sm:text-sm text-gray-700 line-clamp-2">
                                  {desc}
                                </p>
                              )}

                              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-700">
                                <span>
                                  Qty:{" "}
                                  <span className="font-medium text-gray-900">{qty}</span>
                                </span>
                                <span>
                                  Unit:{" "}
                                  <span className="font-medium text-gray-900">
                                    {INR(Math.round(unit))}
                                  </span>
                                </span>
                                <span>
                                  Line total:{" "}
                                  <span className="font-medium text-gray-900">
                                    {INR(Math.round(lineTotal))}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600">No orders found.</div>
            )}
          </div>
        </section>
      </main>

      {/* ✅ Footer added */}
      <Footer />
    </>
  );
}
