"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/userAxios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";


type OrderItem = {
  _id: string;
  name: string;
  qty: number;
  color: string;
  size: string;
  image: string;
  price: number;
  product: string;
};

type PaymentResult = {
  id: string;
  status: string;
  update_time: string;
};

type Order = {
  _id: string;
  user: { _id: string; name: string; email: string };
  orderItems: OrderItem[];
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  totalPrice: number;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  paymentMethod: string;
  paymentResult: PaymentResult;
  mobileNumber: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
};

export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const storedAdmin = localStorage.getItem("adminInfo");
        if (!storedAdmin) {
          toast.error("No admin info found");
          return;
        }

        const { token } = JSON.parse(storedAdmin);

        const { data } = await axios.get(
          `https://www.shabnamoverseas.com/api/admin/orders/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrder(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
          <p className="text-amber-800 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <p className="text-red-600 font-medium">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar forceWhite disableScrollEffect />
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mt-[125px] bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 mb-6 border border-amber-200">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">
              Order Details
            </h1>
            <p className="text-amber-700 font-mono text-sm bg-white px-3 py-1 rounded inline-block">
              ID: {order._id}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white border border-amber-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-amber-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-amber-700 font-medium">Name</p>
                    <p className="text-gray-900 font-semibold">
                      {order.user.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-amber-700 font-medium">Email</p>
                    <p className="text-gray-900">{order.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-amber-700 font-medium">Mobile</p>
                    <p className="text-gray-900 font-mono">
                      {order.mobileNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-amber-700 font-medium">
                      Customer ID
                    </p>
                    <p className="text-gray-900 font-mono text-sm">
                      {order.user._id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white border border-amber-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-amber-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                  Shipping Address
                </h2>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-gray-900 font-medium">
                    {order.shippingAddress.address}
                  </p>
                  <p className="text-gray-700 mt-1">
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-gray-700">
                    {order.shippingAddress.country}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white border border-amber-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-amber-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                  Order Items
                </h2>
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg border border-amber-100"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-sm"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {item.name}
                        </h3>
                        <p className="text-sm text-amber-700 font-mono mb-2">
                          Product ID: {item.product}
                        </p>

                        {/* Color and Size */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-600">
                              Color:
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-md">
                              {item.color}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-600">Size:</span>
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-md">
                              {item.size}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-700">
                            Quantity:{" "}
                            <span className="font-semibold">{item.qty}</span>
                          </span>
                          <span className="text-gray-700">
                            Price:{" "}
                            <span className="font-semibold">₹{item.price}</span>
                          </span>
                          <span className="text-amber-900 font-bold">
                            Total: ₹{item.qty * item.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Status & Summary */}
            <div className="space-y-6">
              {/* Order Status */}
              <div className="bg-white border border-amber-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-amber-900 mb-4">
                  Order Status
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Payment</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.isPaid
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.isPaid ? "✅ Paid" : "❌ Unpaid"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Delivery</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.isDelivered
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {order.isDelivered ? "✅ Delivered" : "📦 Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white border border-amber-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-amber-900 mb-4">
                  Payment Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Method</span>
                    <span className="font-semibold text-gray-900">
                      {order.paymentMethod}
                    </span>
                  </div>
                  {order.isPaid && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Payment ID</span>
                        <span className="font-mono text-sm text-gray-900">
                          {order.paymentResult.id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Paid At</span>
                        <span className="text-sm text-gray-900">
                          {order.paidAt
                            ? new Date(order.paidAt).toLocaleString()
                            : "N/A"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-amber-900 mb-4">
                  Price Summary
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Items Price</span>
                    <span>₹{order.itemsPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax Price</span>
                    <span>₹{order.taxPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping Price</span>
                    <span>₹{order.shippingPrice}</span>
                  </div>
                  <hr className="border-amber-300" />
                  <div className="flex justify-between text-xl font-bold text-amber-900">
                    <span>Total</span>
                    <span>₹{order.totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-white border border-amber-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-amber-900 mb-4">
                  Timestamps
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-amber-700 font-medium">Order Created</p>
                    <p className="text-gray-900">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-amber-700 font-medium">Last Updated</p>
                    <p className="text-gray-900">
                      {new Date(order.updatedAt).toLocaleString()}
                    </p>
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
