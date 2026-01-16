"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";

export default function TradePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    country: "",
    password: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form data to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://api.shabnamoverseas.com/api/trades/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Trade access request submitted successfully!");
        setIsLoggedIn(true);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      // console.error("Error submitting trade form:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <>
      <Navbar forceWhite={true} />
      <main className="pt-[125px] bg-white text-black w-full pb-20">
        <section className="text-center py-20 bg-[#f5dfd6] h-[300px] px-6 flex items-center justify-center flex-col">
          <h1 className="text-7xl font-[AdvercaseFont-Demo-Regular] mb-2 uppercase">
            TRADE ACCESS
          </h1>
          <p className="text-2xl text-gray-600">
            EXCLUSIVE PRICING. PRIORITY SUPPORT.
          </p>
        </section>

        {!isLoggedIn ? (
          <section className="max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-2xl border mt-10">
            <h2 className="text-3xl font-[ClashDisplay-Semibold] text-center mb-6 uppercase tracking-wide">
              Trade Login / Register
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full border px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#742402]/30"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full border px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#742402]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full border px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#742402]/30"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#742402]/30"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full border px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#742402]/30"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full border px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#742402]/30"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#742402]/30"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#742402] hover:bg-[#5a1b01] transition text-white py-3 rounded-lg text-lg uppercase font-semibold tracking-wide"
              >
                Continue to Trade Access
              </button>
            </form>
          </section>
        ) : (
          <section className="max-w-5xl mx-auto mt-12 px-6 lg:px-12">
            <h2 className="text-4xl font-[ClashDisplay-Semibold] mb-4 text-center uppercase tracking-wide">
              Welcome to Trade Access
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Access exclusive trade pricing, bulk order options, early product
              previews, and a direct line to our design team.
            </p>
            {/* Features here */}
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
