"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Calendar,
  Building,
} from "lucide-react";

export default function TraderDetailsPage() {
  const { id } = useParams();

  const [trader, setTrader] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    approvedBy?: { email: string };
    lastLogin?: string;
  };

  useEffect(() => {
    if (id) fetchTrader();
  }, [id]);

  const getToken = () => {
    const storedAdmin = localStorage.getItem("adminInfo");
    if (!storedAdmin) return null;
    const { token } = JSON.parse(storedAdmin);
    return token as string | null;
  };

  const fetchTrader = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const { data } = await axios.get<Trader[]>(
        `https://api.shabnamoverseas.com/api/admin/traders/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log(data);
      setTrader(data);
    } catch (err) {
      // console.error(err);
      toast.error("Failed to fetch trader details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar forceWhite disableScrollEffect />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded-lg w-64 mb-6"></div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!trader) {
    return (
      <>
        <Navbar forceWhite disableScrollEffect />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="text-center py-12">
              <XCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Trader Not Found
              </h2>
              <p className="text-slate-600">
                The requested trader details could not be found.
              </p>
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
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">
                {trader.firstName} {trader.lastName}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  trader.tradeStatus
                )}`}
              >
                {getStatusIcon(trader.tradeStatus)}
                {trader.tradeStatus.charAt(0).toUpperCase() +
                  trader.tradeStatus.slice(1)}
              </span>
              {trader.isApproved && (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                  <Shield className="w-4 h-4" />
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-slate-600" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                    <Mail className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-600">Email</p>
                      <p className="font-medium text-slate-900">
                        {trader.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                    <Phone className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-600">Phone</p>
                      <p className="font-medium text-slate-900">
                        {trader.phoneNumber}
                      </p>
                    </div>
                  </div>
                  {trader.companyName && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                      <Building className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-600">Company</p>
                        <p className="font-medium text-slate-900">
                          {trader.companyName}
                        </p>
                      </div>
                    </div>
                  )}
                  {trader.country && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                      <Globe className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-600">Country</p>
                        <p className="font-medium text-slate-900">
                          {trader.country}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Approval Information */}
              {(trader.approvedBy || trader.approvedAt) && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Approval Details
                  </h2>
                  <div className="space-y-3">
                    {trader.approvedBy && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <span className="text-sm text-slate-600">
                            Approved by:
                          </span>
                          <span className="ml-2 font-medium text-slate-900">
                            {trader.approvedBy.email}
                          </span>
                        </div>
                      </div>
                    )}
                    {trader.approvedAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <span className="text-sm text-slate-600">
                            Approved on:
                          </span>
                          <span className="ml-2 font-medium text-slate-900">
                            {new Date(trader.approvedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Account Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-600">Verification</span>
                    <span
                      className={`text-sm font-medium ${
                        trader.isApproved ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {trader.isApproved ? "Verified" : "Unverified"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-600">Trade Status</span>
                    <span
                      className={`text-sm font-medium capitalize ${
                        trader.tradeStatus === "approved"
                          ? "text-green-600"
                          : trader.tradeStatus === "rejected"
                          ? "text-red-600"
                          : "text-amber-600"
                      }`}
                    >
                      {trader.tradeStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-slate-600" />
                  Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-slate-600">Last Login</p>
                      <p className="text-sm font-medium text-slate-900">
                        {trader.lastLogin
                          ? new Date(trader.lastLogin).toLocaleString()
                          : "Never logged in"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
