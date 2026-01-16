"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
    description?: string;
    slug?: string;
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

const PRODUCT_PAGE_BASE = "/product";

const productDetailEndpoint = (id: string) =>
  `https://api.shabnamoverseas.com/api/products/${encodeURIComponent(id)}`;

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "settings"
  >("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  const [productInfoMap, setProductInfoMap] = useState<
    Record<string, { description?: string; slug?: string }>
  >({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo");
        const token = userInfo ? JSON.parse(userInfo).token : null;

        if (!token) {
          router.push("/login");
          return;
        }

        const { data } = await axios.get(
          `https://api.shabnamoverseas.com/api/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data.user) {
          setUser(data.user);
          setEditForm({ name: data.user.name, email: data.user.email });
        }
        if (data.orders) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Fetch product details for orders
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
              const slug =
                p?.slug || p?.product?.slug || p?.data?.slug || undefined;
              const description =
                p?.description ||
                p?.product?.description ||
                p?.data?.description ||
                undefined;
              return { id, info: { slug, description } };
            } catch {
              return { id, info: {} as any };
            }
          })
        );
        setProductInfoMap((prev) => {
          const next = { ...prev };
          for (const { id, info } of results)
            next[id] = { ...(next[id] || {}), ...info };
          return next;
        });
      } catch (e) {
        // Silent fail
      }
    })();
  }, [orders, productInfoMap]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userInfo = localStorage.getItem("userInfo");
      const token = userInfo ? JSON.parse(userInfo).token : null;
      if (!token) return;

      await axios.put(
        `https://api.shabnamoverseas.com/api/users/profile`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser((prev) =>
        prev ? { ...prev, name: editForm.name, email: editForm.email } : null
      );
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    router.push("/login");
  };

  const productHref = (it: OrderItem) => {
    const id = it?.product?._id;
    const slug =
      it?.product?.slug || (id ? productInfoMap[id]?.slug : undefined);
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

  // Calculate stats
  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrders = orders.length;
  const totalItems = orders.reduce(
    (sum, order) => sum + order.orderItems.reduce((s, i) => s + i.qty, 0),
    0
  );

  if (loading) {
    return (
      <>
        <Navbar forceWhite disableScrollEffect />
        <main className="pt-[125px] bg-white text-black min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="animate-pulse space-y-6">
              <div className="h-48 bg-gray-200 rounded-2xl" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-32 bg-gray-200 rounded-xl" />
                <div className="h-32 bg-gray-200 rounded-xl" />
                <div className="h-32 bg-gray-200 rounded-xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar forceWhite disableScrollEffect />

      <main className="pt-[125px] bg-gradient-to-b from-[#f5dfd6] to-white text-black min-h-screen">
        {/* Hero Header with User Info */}
        <section className="bg-[#f5dfd6] px-4 sm:px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}

              {/* User Details */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-[AdvercaseFont-Demo-Regular] text-gray-900 mb-2">
                  {user.name}
                </h1>
                <p className="text-lg text-gray-600 mb-3">{user.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#742402] text-white">
                    {user.role.toUpperCase()}
                  </span>
                  {user.isVerified ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                      Unverified
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                    Member since{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="md:mt-0 px-6 py-2 bg-white border-2 border-[#742402] text-[#742402] rounded-lg font-semibold hover:bg-[#742402] hover:text-white transition"
              >
                Logout
              </button>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-[#742402]">
                    {totalOrders}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#f5dfd6] rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#742402]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                  <p className="text-3xl font-bold text-[#742402]">
                    {INR(totalSpent)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#f5dfd6] rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#742402]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Items</p>
                  <p className="text-3xl font-bold text-[#742402]">
                    {totalItems}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#f5dfd6] rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#742402]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="max-w-7xl mx-auto px-6 mt-12">
          <div className="flex gap-2 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 font-semibold transition relative ${
                activeTab === "overview"
                  ? "text-[#742402]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Overview
              {activeTab === "overview" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#742402]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-3 font-semibold transition relative ${
                activeTab === "orders"
                  ? "text-[#742402]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Orders ({totalOrders})
              {activeTab === "orders" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#742402]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-6 py-3 font-semibold transition relative ${
                activeTab === "settings"
                  ? "text-[#742402]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Settings
              {activeTab === "settings" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#742402]" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="pb-20">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                  <h2 className="text-2xl font-semibold mb-4">
                    Welcome back, {user.name}!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for being a valued member of Shabnam Overseas.
                    Here's a quick overview of your account.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Recent Activity
                      </h3>
                      {orders.length > 0 ? (
                        <p className="text-sm text-gray-600">
                          Last order placed on{" "}
                          {new Date(orders[0].createdAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "long", year: "numeric" }
                          )}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600">
                          No orders yet. Start shopping!
                        </p>
                      )}
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Account Status
                      </h3>
                      <p className="text-sm text-gray-600">
                        {user.isVerified
                          ? "Your account is verified and active."
                          : "Please verify your email to unlock all features."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <Link
                      href="/shop"
                      className="px-6 py-3 bg-[#742402] hover:bg-[#5c1c01] text-white rounded-lg font-semibold transition"
                    >
                      Continue Shopping
                    </Link>
                    <Link
                      href="/wishlist"
                      className="px-6 py-3 bg-white border-2 border-[#742402] text-[#742402] rounded-lg font-semibold hover:bg-[#742402] hover:text-white transition"
                    >
                      View Wishlist
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                        <div>
                          <p className="text-sm text-gray-600">Order ID</p>
                          <p className="font-mono text-sm font-semibold">
                            {order._id}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-2xl font-bold text-[#742402]">
                            {INR(order.totalPrice)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {order.orderItems.map((item, idx) => {
                          const href = productHref(item);
                          return (
                            <div
                              key={idx}
                              className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                            >
                              <Link href={href}>
                                <img
                                  src={
                                    item.product?.image || "/placeholder.jpg"
                                  }
                                  alt={item.product?.name}
                                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                />
                              </Link>
                              <div className="flex-1">
                                <Link
                                  href={href}
                                  className="font-semibold text-gray-900 hover:text-[#742402]"
                                >
                                  {item.product?.name}
                                </Link>
                                {item.product?.description && (
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {item.product.description}
                                  </p>
                                )}
                                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                  <span>Qty: {item.qty}</span>
                                  <span>•</span>
                                  <span>{INR(item.price)} each</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  {INR(item.qty * item.price)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No orders yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start exploring our products and place your first order!
                    </p>
                    <Link
                      href="/shop"
                      className="inline-block px-6 py-3 bg-[#742402] hover:bg-[#5c1c01] text-white rounded-lg font-semibold transition"
                    >
                      Browse Products
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Account Settings</h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-[#742402] hover:bg-[#5c1c01] text-white rounded-lg font-semibold transition"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#742402] focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#742402] focus:border-transparent"
                          required
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          className="px-6 py-3 bg-[#742402] hover:bg-[#5c1c01] text-white rounded-lg font-semibold transition"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setEditForm({ name: user.name, email: user.email });
                          }}
                          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Full Name
                          </label>
                          <p className="text-lg font-semibold text-gray-900">
                            {user.name}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Email Address
                          </label>
                          <p className="text-lg font-semibold text-gray-900">
                            {user.email}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Account Role
                          </label>
                          <p className="text-lg font-semibold text-gray-900 capitalize">
                            {user.role}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Verification Status
                          </label>
                          <p className="text-lg font-semibold text-gray-900">
                            {user.isVerified ? "✓ Verified" : "⚠ Not Verified"}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6 mt-6">
                        <h3 className="font-semibold text-gray-900 mb-4">
                          Security
                        </h3>
                        <Link
                          href="/forgot-password"
                          className="inline-block px-6 py-3 bg-white border-2 border-[#742402] text-[#742402] rounded-lg font-semibold hover:bg-[#742402] hover:text-white transition"
                        >
                          Change Password
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
