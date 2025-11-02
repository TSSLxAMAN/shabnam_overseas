"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios"; // ✅ unchanged
import Navbar from "@/components/Navbar"; // ✅ added for white navbar
import {
  ShieldUser,
  SquareChartGantt,
  ListOrdered,
  FileType2,
  BaggageClaim,
} from "lucide-react";
export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const { data } = await axiosInstance.get("/profile"); // ✅ unchanged
        setAdmin(data);
      } catch (error) {
        toast.error("Unauthorized. Please login as admin.");
        router.push("/admin/login"); // ✅ unchanged
      }
    };

    checkAdminAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminInfo"); // ✅ unchanged
    router.push("/admin/login"); // ✅ unchanged
  };

  return (
    <>
      {/* White navbar, no scroll/hover animation */}
      <Navbar forceWhite={true} disableScrollEffect={true} />

      <div className="min-h-screen bg-white text-black pt-[125px]">
        {/* Hero header (pure UI) */}
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-6xl py-8 sm:py-12">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] leading-[0.95] break-words text-3xl sm:text-5xl md:text-6xl">
              Admin Dashboard
            </h1>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg mt-2">
              Manage orders, products, and admins — all in one place.
            </p>
          </div>
        </section>

        {/* Main content container */}
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
          {/* Admin badge (UI only) */}
          {admin && (
            <div className="mb-8 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
                <p>
                  <span className="font-semibold text-gray-900">Name:</span>{" "}
                  {admin.name}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Email:</span>{" "}
                  {admin.email}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Role:</span>{" "}
                  {admin.role}
                </p>
              </div>
            </div>
          )}

          <p className="mb-8 text-base sm:text-lg text-gray-800">
            Welcome back{admin?.name ? `, ${admin.name}` : ""}! Use the options
            below to manage your store.
          </p>

          {/* Cards grid (same links, prettier UI) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="/admin/orders"
              className="group block rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  <ListOrdered /> Manage Orders
                </h2>
                <span className="text-[#742402] opacity-0 group-hover:opacity-100 transition">
                  →
                </span>
              </div>
              <p className="mt-2 text-gray-600">
                View, update, and mark orders as delivered.
              </p>
              <div className="mt-4 h-1 w-0 group-hover:w-full bg-[#742402]/20 rounded transition-all"></div>
            </a>

            <a
              href="/admin/products"
              className="group block rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  <SquareChartGantt /> Manage Products
                </h2>
                <span className="text-[#742402] opacity-0 group-hover:opacity-100 transition">
                  →
                </span>
              </div>
              <p className="mt-2 text-gray-600">
                Add, edit, or remove products in your store.
              </p>
              <div className="mt-4 h-1 w-0 group-hover:w-full bg-[#742402]/20 rounded transition-all"></div>
            </a>

            <a
              href="/admin/manage"
              className="group block rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  <ShieldUser /> Manage Admins
                </h2>
                <span className="text-[#742402] opacity-0 group-hover:opacity-100 transition">
                  →
                </span>
              </div>
              <p className="mt-2 text-gray-600">
                View, create, and manage admin accounts.
              </p>
              <div className="mt-4 h-1 w-0 group-hover:w-full bg-[#742402]/20 rounded transition-all"></div>
            </a>
            <a
              href="/admin/trader"
              className="group block rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  <BaggageClaim />
                  Manage Trade
                </h2>
                <span className="text-[#742402] opacity-0 group-hover:opacity-100 transition">
                  →
                </span>
              </div>
              <p className="mt-2 text-gray-600">
                Verify trader accounts and manage discounts.
              </p>
              <div className="mt-4 h-1 w-0 group-hover:w-full bg-[#742402]/20 rounded transition-all"></div>
            </a>
            <a
              href="/admin/category"
              className="group block rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  <FileType2 /> Manage Category
                </h2>
                <span className="text-[#742402] opacity-0 group-hover:opacity-100 transition">
                  →
                </span>
              </div>
              <p className="mt-2 text-gray-600">
                View, create, and manage admin accounts.
              </p>
              <div className="mt-4 h-1 w-0 group-hover:w-full bg-[#742402]/20 rounded transition-all"></div>
            </a>
          </div>

          {/* Logout button (same handler, new style) */}
          <div className="mt-10">
            <button
              onClick={handleLogout}
              className="px-5 py-3 rounded-xl bg-[#742402] hover:bg-[#5c1c01] text-white uppercase font-semibold tracking-wide transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
