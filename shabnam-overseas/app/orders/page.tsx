"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/userAxios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

type OrderItem = {
  name: string;
  qty: number | string;
  price: number | string;

  // Optional extras — rendered only if present
  image?: string;
  size?: string;
  color?: string;
  type?: string;
  specs?: Record<string, string | number>;

  // Linking fields (any of these work)
  productUrl?: string;
  slug?: string;
  productId?: string;
};

type Order = {
  _id: string;
  isPaid: boolean;
  isDelivered: boolean;
  totalAmount?: number | string;
  createdAt: string;
  orderItems: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedUser = localStorage.getItem("userInfo");
        if (!storedUser) {
          toast.error("Please log in to view your orders");
          return;
        }
        const { token } = JSON.parse(storedUser);

        const { data } = await axios.get(
          "https://www.shabnamoverseas.com/api/users/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.orders) {
          setOrders(data.orders.filter((o: Order) => o.isPaid));
        }
      } catch (err) {
        // console.error(err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ------- helpers (display only) -------
  const toNumber = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const calculateTotal = (order: Order) =>
    (order?.orderItems || []).reduce(
      (acc, item) => acc + toNumber(item.price) * toNumber(item.qty),
      0
    );

  const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const placeholderImg = "/placeholder.jpg";

  const getProductHref = (item: OrderItem) => {
    if (item.productUrl) return item.productUrl;
    if (item.slug) return `/products/${encodeURIComponent(item.slug)}`;
    if (item.productId) return `/products/${encodeURIComponent(item.productId)}`;
    // Fallback: send to shop with a search query
    return `/shop?search=${encodeURIComponent(item.name || "")}`;
  };
  // --------------------------------------

  if (loading) {
    return (
      <>
        <Navbar forceWhite disableScrollEffect />
        <div className="min-h-screen bg-white text-black pt-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="h-10 w-64 bg-gray-200 rounded mb-4 animate-pulse" />
            {Array.from({ length: 2 }).map((_, k) => (
              <div
                key={k}
                className="rounded-2xl border border-gray-200 bg-[#f2f2f2] p-6 shadow-sm mb-4"
              >
                <div className="h-4 w-56 bg-gray-200 rounded mb-3 animate-pulse" />
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 2 }).map((__, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-20 w-20 rounded-lg bg-gray-200 animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 w-2/3 bg-gray-200 rounded mb-2 animate-pulse" />
                        <div className="h-3 w-1/2 bg-gray-200 rounded mb-1 animate-pulse" />
                        <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Always-white navbar */}
      <Navbar forceWhite disableScrollEffect />

      {/* Hero header — matched to your example */}
      <main className="pt-[125px] bg-white text-black w-full pb-20">
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-5xl py-12 sm:py-16 md:py-20">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] break-words text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              MY ORDERS
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
              YOUR PURCHASES, ALL IN ONE PLACE.
            </p>
          </div>
        </section>

        {/* Orders Section — cards + accents aligned with example */}
        <section className="max-w-5xl mx-auto mt-10 px-6 lg:px-12">
          {orders.length === 0 ? (
            <div className="text-center mt-10 text-gray-600">
              You have no paid orders yet.
            </div>
          ) : (
            <div className="space-y-7">
              {orders.map((order) => (
                <section
                  key={order._id}
                  className="bg-[#f2f2f2] p-6 md:p-8 rounded-2xl shadow-lg space-y-6 border border-gray-200"
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

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                        Paid
                      </span>
                      {order.isDelivered ? (
                        <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                          Delivered
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700">
                          Processing
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="grid gap-4">
                    {order.orderItems.map((item, idx) => {
                      const qty = toNumber(item.qty);
                      const unit = toNumber(item.price);
                      const lineTotal = qty * unit;
                      const href = getProductHref(item);

                      return (
                        <article
                          key={idx}
                          className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-200 bg-white"
                        >
                          {/* Image (clickable) */}
                          <div className="shrink-0">
                            <a
                              href={href}
                              aria-label={`Open product: ${item.name}`}
                              className="block"
                            >
                              <img
                                src={item.image || placeholderImg}
                                alt={item.name}
                                className="h-24 w-24 sm:h-28 sm:w-28 rounded-lg object-cover border border-gray-200 transition hover:opacity-90"
                              />
                            </a>
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
                              <a
                                href={href}
                                className="underline-offset-2 hover:underline text-[#742402]"
                              >
                                {item.name}
                              </a>
                            </h3>

                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-700">
                              <span>
                                Qty:{" "}
                                <span className="font-medium text-gray-900">
                                  {qty}
                                </span>
                              </span>
                              <span>
                                Unit:{" "}
                                <span className="font-medium text-gray-900">
                                  {formatINR(unit)}
                                </span>
                              </span>
                              {item.size && (
                                <span>
                                  Size:{" "}
                                  <span className="font-medium text-gray-900">
                                    {item.size}
                                  </span>
                                </span>
                              )}
                              {item.color && (
                                <span>
                                  Color:{" "}
                                  <span className="font-medium text-gray-900">
                                    {item.color}
                                  </span>
                                </span>
                              )}
                              {item.type && (
                                <span>
                                  Type:{" "}
                                  <span className="font-medium text-gray-900">
                                    {item.type}
                                  </span>
                                </span>
                              )}
                            </div>

                            {/* Optional specs table */}
                            {item.specs && Object.keys(item.specs).length > 0 && (
                              <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
                                <dl className="divide-y divide-gray-100">
                                  {Object.entries(item.specs).map(([k, v]) => (
                                    <div
                                      key={k}
                                      className="flex items-center justify-between px-3 py-2"
                                    >
                                      <dt className="text-xs text-gray-600">{k}</dt>
                                      <dd className="text-xs font-medium text-gray-900">
                                        {String(v)}
                                      </dd>
                                    </div>
                                  ))}
                                </dl>
                              </div>
                            )}
                          </div>

                          {/* Price column */}
                          <div className="sm:text-right">
                            <div className="text-xs text-gray-600">Line total</div>
                            <div className="text-base font-bold text-gray-900">
                              {formatINR(lineTotal)}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {/* Order total bar */}
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-white border border-gray-200 px-4 py-3">
                    <div className="text-sm text-gray-700">
                      {order.isDelivered ? "Delivered" : "Estimated delivery soon"}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      Total: {formatINR(calculateTotal(order))}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
