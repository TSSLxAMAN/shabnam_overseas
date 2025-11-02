"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import Navbar from "@/components/Navbar";

type Category = {
  _id: string;
  name: string;
  type: "size" | "style" | "type" | "room" | "color";
  createdAt?: string;
};

export default function AdminCategoryPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Category["type"]>("size");
  const [newValue, setNewValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const tabs: Array<{ key: Category["type"]; label: string; icon: string }> = [
    { key: "size", label: "Sizes", icon: "📏" },
    { key: "style", label: "Styles", icon: "🎨" },
    { key: "type", label: "Types", icon: "📦" },
    { key: "room", label: "Rooms", icon: "🏠" },
    { key: "color", label: "Colors", icon: "🌈" },
  ];

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const { data } = await axiosInstance.get("/profile");
        setAdmin(data);
      } catch (error) {
        toast.error("Unauthorized. Please login as admin.");
        router.push("/admin/login");
      }
    };
    checkAdminAuth();
  }, []);

  useEffect(() => {
    if (admin) {
      fetchCategories();
    }
  }, [admin]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/categories");
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newValue.trim()) {
      toast.error("Please enter a value");
      return;
    }

    setIsAdding(true);
    try {
      const { data } = await axiosInstance.post("/categories", {
        name: newValue.trim(),
        type: activeTab,
      });
      setCategories([...categories, data]);
      setNewValue("");
      toast.success(`${activeTab} added successfully`);
    } catch (error: any) {
      console.error("Failed to add category:", error);
      toast.error(error.response?.data?.message || "Failed to add category");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await axiosInstance.delete(`/categories/${id}`);
      setCategories(categories.filter((cat) => cat._id !== id));
      toast.success("Deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete category:", error);
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  const filteredCategories = categories.filter((cat) => cat.type === activeTab);

  const inputBase =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#742402]/30 focus:border-[#742402]";

  return (
    <>
      <Navbar forceWhite={true} disableScrollEffect={true} />

      <div className="min-h-screen bg-white text-black pt-[125px]">
        {/* Hero header */}
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-6xl py-8 sm:py-12">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] leading-[0.95] break-words text-3xl sm:text-5xl md:text-6xl">
              Category Management
            </h1>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg mt-2">
              Manage product sizes, styles, types, rooms, and colors
            </p>
          </div>
        </section>

        {/* Main content container */}
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
          {/* Admin badge */}
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

          {/* Back button */}
          <div className="mb-6">
            <button
              onClick={() => router.push("/admin")}
              className="text-[#742402] hover:text-[#5c1c01] font-medium text-sm transition"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-6 bg-white border border-gray-100 rounded-2xl shadow-sm p-2">
            <div className="flex gap-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-sm font-semibold transition ${
                    activeTab === tab.key
                      ? "bg-[#742402] text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Add New Form */}
          <div className="mb-6 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Add New{" "}
              {tabs.find((t) => t.key === activeTab)?.label.slice(0, -1)}
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !isAdding && handleAdd()
                }
                placeholder={`Enter ${activeTab} name...`}
                className={inputBase}
                disabled={isAdding}
              />
              <button
                onClick={handleAdd}
                disabled={isAdding || !newValue.trim()}
                className="px-6 py-2 rounded-xl bg-[#742402] text-white font-semibold text-sm transition hover:bg-[#5c1c01] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isAdding ? "Adding..." : "Add"}
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Existing {tabs.find((t) => t.key === activeTab)?.label}
                </h2>
                {!loading && filteredCategories.length > 0 && (
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {filteredCategories.length} items
                  </span>
                )}
              </div>

              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 rounded-xl bg-gray-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
                  <div className="text-5xl mb-4">
                    {tabs.find((t) => t.key === activeTab)?.icon}
                  </div>
                  <p className="text-gray-600 font-medium mb-1">
                    No {activeTab}s added yet
                  </p>
                  <p className="text-sm text-gray-500">
                    Add your first {activeTab} using the form above
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCategories.map((category, index) => (
                    <div
                      key={category._id}
                      className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-[#742402]/30 hover:shadow-sm transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#742402]/10 text-[#742402] text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900">
                          {category.name}
                        </span>
                        {category.createdAt && (
                          <span className="text-xs text-gray-500">
                            Added{" "}
                            {new Date(category.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          handleDelete(category._id, category.name)
                        }
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Back to dashboard button */}
          <div className="mt-10">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 uppercase font-semibold tracking-wide transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
