"use client";
import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    mobileNumber: "",
  });

  const INR = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }),
    []
  );

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
      const validItems = items.filter(item => item.product && item.product._id);
      
      if (validItems.length < items.length) {
        toast.error("Some cart items are invalid and were removed");
      }
      
      setCartItems(validItems);
      
      // ✅ Calculate grand total using correct size price
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
              .filter(item => item.product) // ✅ Extra safety check
              .map((item) => {
                const selectedSize = item.product!.sizes.find(
                  (s) => s.label === item.size
                );
                const price = selectedSize ? selectedSize.price : item.price || 0;
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
        name: "My Shop",
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
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-5xl py-12">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] text-4xl sm:text-6xl lg:text-7xl">
              CHECKOUT
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
              YOUR NEW FLOOR STATEMENT IS JUST A CLICK AWAY.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto mt-10 px-6 lg:px-12 space-y-8">
          {/* ✅ Order Summary */}
          <div className="bg-[#f2f2f2] p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              ORDER SUMMARY
            </h2>
            {loading ? (
              <p className="mt-4">Loading...</p>
            ) : cartItems.length > 0 ? (
              <div className="mt-4 space-y-4">
                {cartItems.map((item) => {
                  // ✅ Add null check for product
                  if (!item.product) return null;
                  
                  const price = item.price || 0;
                  return (
                    <div
                      key={item._id}
                      className="flex items-start justify-between border-b pb-3"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × {INR.format(price)}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {INR.format(price * item.quantity)}
                      </p>
                    </div>
                  );
                })}
                <div className="pt-3 border-t border-gray-300 flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-900">
                    Total + <span className="text-xs text-gray-500 ">Shipping(Depends on size and quantity)</span>
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    {INR.format(itemsPrice)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-gray-700">Your cart is empty.</p>
            )}
          </div>

          {/* ✅ Shipping Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#f2f2f2] p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              SHIPPING DETAILS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="p-3 rounded border bg-white w-full"
              />
              <input
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="p-3 rounded border bg-white w-full"
              />
              <input
                name="postalCode"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={handleChange}
                required
                className="p-3 rounded border bg-white w-full"
              />
              <input
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                required
                className="p-3 rounded border bg-white w-full"
              />
              <input
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                className="p-3 rounded border bg-white w-full md:col-span-2"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full bg-[#742402] hover:bg-[#5c1c01] transition text-white py-3 uppercase font-semibold tracking-wide rounded-xl"
            >
              Make Payment
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}