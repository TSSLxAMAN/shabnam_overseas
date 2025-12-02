"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Currency = "INR" | "USD";

type CartItem = {
  _id: string;
  product: {
    _id: string;
    name: string;
    description: string;
    image: string[];
    sizes: { label: string; price: number; stock: number }[];
    colors: { label: string }[];
  } | null;
  size: string;
  color: string;
  quantity: number;
  price: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [itemsPrice, setItemsPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    mobileNumber: "",
  });

  const formatCurrency = useMemo(() => {
    return (price: number) =>
      currency === "INR"
        ? `₹${price.toLocaleString("en-IN")}`
        : `$${(price * 0.012).toFixed(2)}`;
  }, [currency]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const storedUser = localStorage.getItem("userInfo");
      let token: string | null = null;
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          token = parsed.token;
        } catch {
          toast.error("Invalid login session");
          setLoading(false);
          return;
        }
      }
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch("https://www.shabnamoverseas.com/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setLoading(false);
        toast.error("Failed to load cart");
        return;
      }

      const data = await res.json();
      const items: CartItem[] = Array.isArray(data) ? data : [];

      // ✅ Filter out items with null/undefined products
      const validItems = items.filter(
        (item) => item.product && item.product._id
      );

      if (validItems.length < items.length) {
        toast.error("Some cart items are invalid and were removed");
      }

      setCartItems(validItems);

      // ✅ Calculate grand total
      const total = validItems.reduce((acc, item) => {
        const price = item.price || 0;
        return acc + price * item.quantity;
      }, 0);

      setItemsPrice(total);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const storedUser = localStorage.getItem("userInfo");
    let token: string | null = null;
    let userId: string | null = null;
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        token = parsed.token;
        userId = parsed._id;
      } catch {
        toast.error("Invalid login session");
        return;
      }
    }
    if (!token) {
      toast.error("You must be logged in");
      return;
    }
    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const orderRes = await fetch(
        "https://www.shabnamoverseas.com/api/payment/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            orderItems: cartItems
              .filter((item) => item.product)
              .map((item) => {
                const selectedSize = item.product!.sizes.find(
                  (s) => s.label === item.size
                );
                const price = selectedSize
                  ? selectedSize.price
                  : item.price || 0;
                return {
                  product: item.product!._id,
                  name: item.product!.name,
                  qty: item.quantity,
                  size: item.size,
                  color: item.color,
                  price,
                  image: item.product!.image?.[0] || "",
                };
              }),
            shippingAddress: {
              address: formData.address,
              city: formData.city,
              postalCode: formData.postalCode,
              country: formData.country,
            },
            mobileNumber: formData.mobileNumber,
            itemsPrice,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: itemsPrice,
          }),
        }
      );

      const orderData = await orderRes.json();
      if (!orderData?.success) {
        toast.error("Failed to initiate payment");
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.razorpayOrder.amount,
        currency: "INR",
        name: "Shabnam Overseas",
        description: "Order Payment",
        order_id: orderData.razorpayOrder.id,
        handler: async function (response: any) {
          const verifyRes = await fetch(
            "https://www.shabnamoverseas.com/api/payment/verify",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                orderId: orderData.orderId,
              }),
            }
          );
          const verifyData = await verifyRes.json();
          if (verifyData?.success) {
            await fetch("https://www.shabnamoverseas.com/api/cart", {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Payment Successful & Order Placed!");
            router.push("/shop");
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: (() => {
          try {
            const u = storedUser ? JSON.parse(storedUser) : null;
            return {
              name: u?.name || "",
              email: u?.email || "",
              contact: formData.mobileNumber,
            };
          } catch {
            return { name: "", email: "", contact: formData.mobileNumber };
          }
        })(),
        theme: { color: "#742402" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Navbar forceWhite disableScrollEffect />
      <main className="pt-[125px] bg-white text-black w-full pb-20">
        {/* Hero Section */}
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-6xl py-12 sm:py-16">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] text-4xl sm:text-6xl lg:text-7xl">
              CHECKOUT
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-2xl mt-2">
              YOUR NEW FLOOR STATEMENT IS JUST A CLICK AWAY.
            </p>
          </div>
        </section>

        {/* Currency Selector */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
          <div className="flex justify-end">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#742402]/30 bg-white"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
        </section>

        <section className="max-w-6xl mx-auto mt-6 px-4 sm:px-6 space-y-8">
          {/* Order Summary */}
          <div className="bg-[#f2f2f2] p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ORDER SUMMARY
            </h2>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#742402]"></div>
              </div>
            ) : cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => {
                  if (!item.product) return null;

                  const price = item.price || 0;
                  const primaryImage = item.product.image?.[0] || "";

                  return (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row gap-4 border-b pb-4 last:border-b-0"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-full sm:w-32 h-40 sm:h-32 relative rounded-xl overflow-hidden bg-white">
                        {primaryImage ? (
                          <Image
                            src={primaryImage}
                            alt={item.product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 128px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-base sm:text-lg">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Size: <span className="font-medium">{item.size}</span>{" "}
                          | Color:{" "}
                          <span className="font-medium">{item.color}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity:{" "}
                          <span className="font-medium">{item.quantity}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Unit Price:{" "}
                          <span className="font-medium">
                            {formatCurrency(price)}
                          </span>
                        </p>
                      </div>

                      {/* Price */}
                      <div className="flex sm:flex-col items-end justify-between sm:justify-start">
                        <span className="text-sm text-gray-500 sm:hidden">
                          Subtotal:
                        </span>
                        <span className="font-semibold text-gray-900 text-lg">
                          {formatCurrency(price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Total Section */}
                <div className="pt-4 border-t border-gray-300 space-y-2">
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="text-base">Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(itemsPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="text-base">Shipping</span>
                    <span className="text-sm text-gray-500">
                      Calculated at delivery
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(itemsPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 text-right">
                    *Shipping charges depend on size and quantity
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-700 text-lg">Your cart is empty.</p>
                <button
                  onClick={() => router.push("/shop")}
                  className="mt-4 px-6 py-2 bg-[#742402] text-white rounded-xl hover:bg-[#5c1c01] transition"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Shipping Form */}
          {cartItems.length > 0 && (
            <form
              onSubmit={handleSubmit}
              className="bg-[#f2f2f2] p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                SHIPPING DETAILS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="address"
                  placeholder="Address *"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="p-3 rounded-lg border border-gray-300 bg-white w-full outline-none focus:ring-2 focus:ring-[#742402]/30 focus:border-[#742402]"
                />
                <input
                  name="city"
                  placeholder="City *"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="p-3 rounded-lg border border-gray-300 bg-white w-full outline-none focus:ring-2 focus:ring-[#742402]/30 focus:border-[#742402]"
                />
                <input
                  name="postalCode"
                  placeholder="Postal Code *"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="p-3 rounded-lg border border-gray-300 bg-white w-full outline-none focus:ring-2 focus:ring-[#742402]/30 focus:border-[#742402]"
                />
                <input
                  name="country"
                  placeholder="Country *"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="p-3 rounded-lg border border-gray-300 bg-white w-full outline-none focus:ring-2 focus:ring-[#742402]/30 focus:border-[#742402]"
                />
                <input
                  name="mobileNumber"
                  placeholder="Mobile Number *"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  className="p-3 rounded-lg border border-gray-300 bg-white w-full md:col-span-2 outline-none focus:ring-2 focus:ring-[#742402]/30 focus:border-[#742402]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#742402] hover:bg-[#5c1c01] disabled:bg-gray-400 disabled:cursor-not-allowed transition text-white py-4 uppercase font-semibold tracking-wide rounded-xl text-base"
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </button>
              <p className="text-xs text-gray-500 text-center">
                You will be redirected to Razorpay for secure payment processing
              </p>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
