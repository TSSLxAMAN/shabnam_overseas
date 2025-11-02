"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/userAxios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

type Order = {
  _id: string;
  user?: { name?: string; email?: string };
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  totalAmount?: number;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedAdmin = localStorage.getItem("adminInfo");
        if (!storedAdmin) {
          toast.error("No admin info found");
          return;
        }

        const { token } = JSON.parse(storedAdmin);
        const { data } = await axios.get(
          "https://www.shabnamoverseas.com/api/admin/orders",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setOrders(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDeliver = async (id: string) => {
    try {
      const storedAdmin = localStorage.getItem("adminInfo");
      if (!storedAdmin) {
        toast.error("No admin info found");
        return;
      }
      const { token } = JSON.parse(storedAdmin);

      console.log("Delivering order:", id); // 👀 log

      const { data } = await axios.put(
        `https://www.shabnamoverseas.com/api/admin/orders/${id}/deliver`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Backend response:", data); // 👀 log

      toast.success("Order marked as delivered");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, isDelivered: true } : order
        )
      );
    } catch (err: any) {
      console.error("Deliver error:", err.response?.data || err.message);
      toast.error("Failed to mark as delivered");
    }
  };


  // Pagination (unchanged)
  const totalOrders = orders.length;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageClick = (n: number) => setCurrentPage(n);

  const getPageNumbers = () => {
    const nums: number[] = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  };

  // --- UI ---
  if (loading) {
    return (
      <>
        <Navbar forceWhite disableScrollEffect />
        <div className="min-h-screen bg-white text-black pt-24 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="h-8 w-48 rounded-lg bg-gray-200 mb-6" />
            <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="h-12 bg-[#f5dfd6]" />
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-white odd:bg-gray-50 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!totalOrders) {
    return (
      <>
        <Navbar forceWhite disableScrollEffect />
        <div className="min-h-screen bg-white text-black pt-24 px-6">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              All Orders
            </h1>
            <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center">
              <p className="text-gray-600">No orders yet.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar forceWhite disableScrollEffect />
      <div className="min-h-screen bg-white text-black mt-10 pt-24 px-6">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, totalOrders)} of{" "}
              {totalOrders} orders
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed bg-white">
                {/* Removed <colgroup> to avoid hydration errors */}
                <thead className="bg-[#f5dfd6] text-[#742402]">
                  <tr>
                    <th className="w-[160px] py-3 px-4 text-left text-sm font-semibold">
                      Order ID
                    </th>
                    <th className="w-[220px] py-3 px-4 text-left text-sm font-semibold">
                      User
                    </th>
                    <th className="w-[140px] py-3 px-4 text-left text-sm font-semibold">
                      Created
                    </th>
                    <th className="w-[120px] py-3 px-4 text-left text-sm font-semibold">
                      Paid
                    </th>
                    <th className="w-[140px] py-3 px-4 text-left text-sm font-semibold">
                      Delivered
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b last:border-none hover:bg-gray-50"
                    >
                      <td className="w-[160px] py-2 px-4 text-sm">
                        <a
                          href={`/admin/orders/${order._id}`}
                          className="text-[#742402] font-medium underline-offset-2 hover:underline"
                        >
                          {order._id.slice(0, 8)}…
                        </a>
                      </td>

                      <td className="w-[220px] py-2 px-4 text-sm">
                        {order.user?.name || order.user?.email || "N/A"}
                      </td>

                      <td className="w-[140px] py-2 px-4 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      <td className="w-[120px] py-2 px-4 text-sm">
                        {order.isPaid ? (
                          <span className="inline-flex items-center rounded-full bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 text-xs font-medium">
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 text-xs font-medium">
                            No
                          </span>
                        )}
                      </td>

                      <td className="w-[140px] py-2 px-4 text-sm">
                        {order.isDelivered ? (
                          <span className="inline-flex items-center rounded-full bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 text-xs font-medium">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 text-xs font-medium">
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="py-2 px-4 text-sm">
                        {!order.isDelivered && (
                          <button
                            onClick={() => handleDeliver(order._id)}
                            className="rounded-lg bg-[#742402] px-3 py-1 text-xs font-semibold text-white transition hover:bg-[#5c1c01]"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <>
              <div className="flex justify-center items-center mt-8 gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm transition ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-[#742402] hover:bg-[#5c1c01] text-white"
                  }`}
                >
                  Previous
                </button>

                {getPageNumbers().map((n) => (
                  <button
                    key={n}
                    onClick={() => handlePageClick(n)}
                    className={`px-3 py-2 rounded-lg text-sm transition ${
                      currentPage === n
                        ? "bg-[#742402] text-white"
                        : "bg-white text-black hover:bg-gray-100 border"
                    }`}
                  >
                    {n}
                  </button>
                ))}

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-sm transition ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-[#742402] hover:bg-[#5c1c01] text-white"
                  }`}
                >
                  Next
                </button>
              </div>

              <div className="text-center mt-4 text-gray-600 text-sm">
                Page {currentPage} of {totalPages}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
