"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  ShieldOff,
  Eye,
  Mail,
  Phone,
  User,
  Loader2,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
type Trader = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isApproved: boolean;
  tradeStatus: "pending" | "approved" | "rejected";
  approvedAt?: string;
  companyName?: string;
  country?: string;
};

interface Discount {
  _id: string;
  value: number;
  createdAt: string;
}

interface DiscountResponse {
  success: boolean;
  message: string;
  data?: Discount;
}

export default function TraderPage() {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [filteredTraders, setFilteredTraders] = useState<Trader[]>([]);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [discount, setDiscount] = useState("");
  const [discountPrize, setDiscountPrize] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "verified" | "unverified"
  >("all");
  const router = useRouter();

  useEffect(() => {
    fetchTraders();
    fetchDiscount();
  }, [discountPrize]);

  useEffect(() => {
    filterTraders();
  }, [traders, searchTerm, statusFilter]);

  const getToken = () => {
    const storedAdmin = localStorage.getItem("adminInfo");
    if (!storedAdmin) return null;
    const { token } = JSON.parse(storedAdmin);
    return token as string | null;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!discount) {
      toast.error("Please enter a discount value");
      return;
    }

    setIsLoading(true);

    try {
      const token = getToken();
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        return;
      }

      const response = await fetch("https://www.shabnamoverseas.com/api/discounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ discount: discount }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Discount saved successfully!");
        setDiscount("");
      } else {
        toast.error(result.message || "Failed to save discount");
      }
      fetchDiscount()
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchTraders = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch("https://www.shabnamoverseas.com/api/admin/traders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch traders");
      }

      const data = await response.json();
      setTraders(data);
    } catch (err) {
      console.error(err);
      console.error("Failed to fetch traders");
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscount = async () => {
    try {
      const response = await fetch("https://www.shabnamoverseas.com/api/discounts", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch discounts");
      }

      const data = await response.json();
      console.log(data)
      // Access the latest discount (assuming last item in array is latest)
      if (data?.data?.length > 0) {
        const latestDiscount = data.data[0];
        setDiscountPrize(latestDiscount.value.toString());
      }

    } catch (err) {
      console.error(err);
      console.error("Failed to fetch discounts");
    }
  };

  const filterTraders = () => {
    let filtered = traders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (trader) =>
          `${trader.firstName} ${trader.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          trader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trader.phoneNumber.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter === "verified") {
      filtered = filtered.filter((trader) => trader.isApproved);
    } else if (statusFilter === "unverified") {
      filtered = filtered.filter((trader) => !trader.isApproved);
    }

    setFilteredTraders(filtered);
  };

  const markBusy = (id: string, add: boolean) =>
    setBusyIds((prev) => {
      const next = new Set(prev);
      add ? next.add(id) : next.delete(id);
      return next;
    });

  const verifyTrader = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const token = getToken();
      if (!token) return;
      markBusy(id, true);

      const response = await fetch(
        `https://www.shabnamoverseas.com/api/admin/traders/${id}/verify`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify trader");
      }

      console.log("Trader verified!");
      setTraders((prev) =>
        prev.map((t) =>
          t._id === id
            ? {
                ...t,
                isApproved: true,
                tradeStatus: "approved",
                approvedAt: new Date().toISOString(),
              }
            : t
        )
      );
    } catch (err) {
      console.error(err);
      console.error("Failed to verify trader");
    } finally {
      markBusy(id, false);
    }
  };

  const handleUnverify = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const token = getToken();
      if (!token) return;
      markBusy(id, true);

      const response = await fetch(
        `https://www.shabnamoverseas.com/api/admin/traders/${id}/unverify`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unverify trader");
      }

      console.log("Trader blocked");
      setTraders((prev) =>
        prev.map((t) =>
          t._id === id
            ? {
                ...t,
                isApproved: false,
                tradeStatus: "pending",
                approvedAt: undefined,
              }
            : t
        )
      );
    } catch (err) {
      console.error(err);
      console.error("Error blocking trader");
    } finally {
      markBusy(id, false);
    }
  };

  const onRowClick = (id: string) => {
    router.push(`/admin/trader/${id}`);
  };

  const getStatusBadge = (trader: Trader) => {
    if (trader.isApproved) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle className="w-3 h-3" />
          Verified
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <Clock className="w-3 h-3" />
          Unverified
        </span>
      );
    }
  };

  const stats = {
    total: traders.length,
    verified: traders.filter((t) => t.isApproved).length,
    unverified: traders.filter((t) => !t.isApproved).length,
  };

  if (loading) {
    return (
      <>
        <Navbar forceWhite disableScrollEffect />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded-lg w-48 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-6">
                    <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
                    <div className="h-8 bg-slate-200 rounded w-12"></div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl p-6">
                <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 bg-slate-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar forceWhite disableScrollEffect />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24">
        <div className="max-w-7xl mx-auto px-6 py-8 mt-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Traders</h1>
            </div>
            <p className="text-slate-600">Manage and verify trader accounts</p>
          </div>

          <div className="container mx-auto p-6">
            {/* Discount Input Section */}
            <div className="bg-white p-6 rounded-lg text-black shadow-md mb-8">
              <h2 className="py-3">Current Discount : {discountPrize}</h2>
              <h2 className="text-xl font-semibold mb-4">Add Discount</h2>
              <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="Enter discount percentage"
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                  step="0.01"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                >
                  {isLoading ? "Saving..." : "Save Discount"}
                </button>
              </form>
            </div>

            {/* Rest of your existing page content */}
            <div>{/* Your existing admin/trader content goes here */}</div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Traders</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Verified</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {stats.verified}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {stats.unverified}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search traders by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Unverified Only</option>
                </select>
              </div>
            </div>
          </div>
          {/* Traders Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {filteredTraders.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No traders found
                </h3>
                <p className="text-slate-500">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "No traders have been registered yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Trader
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredTraders.map((trader) => {
                      const busy = busyIds.has(trader._id);
                      return (
                        <tr
                          key={trader._id}
                          onClick={() => onRowClick(trader._id)}
                          className="hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-100 rounded-lg">
                                <User className="w-4 h-4 text-slate-600" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">
                                  {trader.firstName} {trader.lastName}
                                </p>
                                <p className="text-sm text-slate-500">
                                  ID: {trader._id.slice(-8)}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-slate-900">
                                <Mail className="w-3 h-3 text-slate-400" />
                                {trader.email}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {trader.phoneNumber}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(trader)}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {trader.isApproved ? (
                                <button
                                  onClick={(e) => handleUnverify(trader._id, e)}
                                  disabled={busy}
                                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 border border-red-200 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  {busy ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <ShieldOff className="w-3 h-3" />
                                  )}
                                  {busy ? "Blocking..." : "Block"}
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => verifyTrader(trader._id, e)}
                                  disabled={busy}
                                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-lg hover:bg-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  {busy ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Shield className="w-3 h-3" />
                                  )}
                                  {busy ? "Verifying..." : "Verify"}
                                </button>
                              )}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRowClick(trader._id);
                                }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
                              >
                                <Eye className="w-3 h-3" />
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
