"use client";

import { useEffect, useState, Suspense } from "react";
import axios from "@/lib/userAxios";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

// Create a separate component that uses useSearchParams
function ProductsContent() {
  // Types remain the same...
  type Size = {
    label: string;
    price: number;
    stock?: number;
  };

  type Color = {
    label: string;
  };

  type Product = {
    _id: string;
    name: string;
    description?: string;
    image: string[];
    category?: string;
    sizes: Size[];
    colors?: Color[];
    byType?: string;
    byRoom?: string;
    style?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allSizes, setAllSizes] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const router = useRouter();
  const query = useSearchParams();

  // Hydrate state from URL
  useEffect(() => {
    const q = query.get("search") || "";
    const c = query.get("category") || "";
    const s = query.get("size") || "";
    const sort = query.get("sort") || "newest";
    const pg = parseInt(query.get("page") || "1", 10);
    const all = query.get("showAll") === "1";

    setSearch(q);
    setCategoryFilter(c);
    setSizeFilter(s);
    setSortBy(sort);
    setPage(pg);
    setShowAll(all);
  }, [query]);

  // Keep URL in sync - FIXED: Only update when values actually change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search);
    if (categoryFilter) params.set("category", categoryFilter);
    if (sizeFilter) params.set("size", sizeFilter);
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (!showAll && page > 1) params.set("page", page.toString());
    if (showAll) params.set("showAll", "1");

    const newUrl = `/admin/products?${params.toString()}`;
    const currentUrl = window.location.pathname + window.location.search;

    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [search, categoryFilter, sizeFilter, sortBy, page, showAll, router]);

  // FIXED: Fetch products with debounce and proper error handling
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300); // Debounce search requests

    return () => clearTimeout(timeoutId);
  }, [search, categoryFilter, sizeFilter, sortBy, page, showAll]);

  const toTitleCase = (str: string) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log("Fetching products with params:", {
        search: search.trim(),
        category: categoryFilter,
        size: sizeFilter,
        sort: sortBy,
        page: showAll ? 1 : page,
        limit: showAll ? 9999 : 12,
      });

      const { data } = await axios.get("/products", {
        params: {
          search: search.trim() || undefined, // Don't send empty strings
          category: toTitleCase(categoryFilter) || undefined,
          sizes: sizeFilter || undefined,
          sort: sortBy,
          page: showAll ? 1 : page,
          limit: showAll ? 9999 : 12,
        },
      });

      console.log("API Response:", data);

      // Handle response
      const productsArray = data.products || [];
      setProducts(productsArray);
      setTotalPages(
        data.pages || Math.ceil((data.total || productsArray.length) / 12)
      );
      setTotalCount(data.total || productsArray.length);

      // FIXED: Only extract categories/sizes from ALL products, not filtered ones
      if (productsArray.length > 0) {
        // Get all unique categories (case-insensitive)
        // Extract unique categories (explicit typing)
        const categories: string[] = Array.from(
          new Set(
            productsArray
              .map((p: Product) => p.category)
              .filter(
                (cat: string | undefined): cat is string =>
                  typeof cat === "string" && cat.length > 0
              )
              .map((cat: string) => cat.toLowerCase().trim())
          )
        );

        // Extract unique sizes (explicit typing)
        const sizes: string[] = Array.from(
          new Set(
            productsArray
              .filter((p: Product) => Array.isArray(p.sizes))
              .flatMap((p: Product) => p.sizes.map((s: Size) => s.label))
              .filter(
                (label: string | undefined): label is string =>
                  typeof label === "string" && label.length > 0
              )
              .map((size: string) => size.toLowerCase().trim())
          )
        );

        setAllCategories(categories);
        setAllSizes(sizes);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setPage(1); // Reset to first page
  };

  const handleSizeChange = (value: string) => {
    setSizeFilter(value);
    setPage(1); // Reset to first page
  };

  // Actions
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await axios.delete(`/products/${id}`);
      toast.success("Product deleted");

      // Refresh the current view
      await fetchProducts();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Delete failed");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setSizeFilter("");
    setSortBy("newest");
    setPage(1);
    setShowAll(false);
  };

  // UI Helpers
  const inputBase =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#742402]/30 focus:border-[#742402]";
  const selectBase = inputBase;

  return (
    <>
      <Navbar forceWhite disableScrollEffect />

      <div className="min-h-screen bg-white text-black pt-24 px-6 mt-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Products
            </h1>
            <button
              onClick={() => router.push("/admin/products/new")}
              className="inline-flex items-center justify-center rounded-xl bg-[#742402] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5c1c01]"
            >
              + Add New Product
            </button>
          </div>

          {/* FIXED: Filters with proper change handlers */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm mb-6">
            <div className="grid gap-4 p-4 sm:grid-cols-2 md:grid-cols-4">
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={inputBase}
              />

              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={selectBase}
              >
                <option value="">All Categories</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={sizeFilter}
                onChange={(e) => handleSizeChange(e.target.value)}
                className={selectBase}
              >
                <option value="">All Sizes</option>
                {allSizes.map((sz) => (
                  <option key={sz} value={sz}>
                    {sz}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={selectBase}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>

              <label className="sm:col-span-2 md:col-span-4 mt-1 flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showAll}
                  onChange={(e) => setShowAll(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#742402] focus:ring-[#742402]"
                />
                Show all products
              </label>

              <button
                onClick={resetFilters}
                className="sm:col-span-2 md:col-span-4 mt-1 inline-flex items-center justify-center rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(search || categoryFilter || sizeFilter) && (
            <div className="mb-4 flex gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Search: "{search}"
                  <button
                    onClick={() => handleSearchChange("")}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {categoryFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Category: {toTitleCase(categoryFilter)}
                  <button
                    onClick={() => handleCategoryChange("")}
                    className="text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {sizeFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  Size: {sizeFilter}
                  <button
                    onClick={() => handleSizeChange("")}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="h-48 w-full rounded-lg bg-gray-200 mb-4 animate-pulse" />
                  <div className="h-4 w-3/5 rounded bg-gray-200 mb-2 animate-pulse" />
                  <div className="h-3 w-1/3 rounded bg-gray-200 mb-1 animate-pulse" />
                  <div className="h-3 w-1/4 rounded bg-gray-200 animate-pulse" />
                  <div className="mt-4 flex justify-between">
                    <div className="h-9 w-20 rounded-lg bg-gray-200 animate-pulse" />
                    <div className="h-9 w-20 rounded-lg bg-gray-200 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center">
              <p className="text-gray-600 mb-2">No products found</p>
              {search || categoryFilter || sizeFilter ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    Try adjusting your filters
                  </p>
                  <button
                    onClick={resetFilters}
                    className="text-[#742402] hover:text-[#5c1c01] font-medium text-sm"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Add your first product to get started
                </p>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Showing {products.length} of {totalCount} products
              </p>

              {/* Product Grid - Same as before */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-12">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                  >
                    <div className="relative">
                      <img
                        src={product.image?.[0] || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {product.category && (
                        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-gray-700 border border-gray-200">
                          {product.category}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 text-base font-semibold text-gray-900">
                      {product.name}
                    </h2>

                    <div className="mt-2 space-y-1">
                      {product.sizes?.map((sz, idx) => (
                        <p
                          key={`${sz.label}-${idx}`}
                          className="text-sm text-gray-700 flex justify-between"
                        >
                          <span>{sz.label}</span>
                          <span>₹{sz.price.toLocaleString()}</span>
                        </p>
                      ))}
                    </div>

                    {product.colors && product.colors.length > 0 && (
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {product.colors.map((c, idx) => (
                          <span
                            key={`${c.label}-${idx}`}
                            className="text-xs px-2 py-0.5 border rounded-full text-gray-600"
                          >
                            {c.label}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex justify-between gap-2">
                      <button
                        onClick={() =>
                          router.push(`/admin/products/${product._id}/edit`)
                        }
                        className="flex-1 rounded-xl bg-[#742402] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#5c1c01]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* FIXED: Pagination */}
              {!showAll && totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3 py-2 rounded-lg text-sm border disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm transition ${
                          pageNum === page
                            ? "bg-[#742402] text-white"
                            : "bg-white text-black hover:bg-gray-100 border"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-2 rounded-lg text-sm border disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

// Main component with Suspense wrapper
export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
