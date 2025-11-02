"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { FaVideo } from "react-icons/fa";
import toast from "react-hot-toast";
import Footer from "@/components/Footer";

export default function AppointmentPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    country: "",
    mobile: "",
    timezone: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("https://www.shabnamoverseas.com/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Appointment booked successfully!");
        setFormData({
          name: "",
          email: "",
          city: "",
          country: "",
          mobile: "",
          timezone: "",
          date: "",
          time: "",
        });
      } else {
        toast.error("Failed to book appointment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sending appointment");
    }
  };

  return (
    <>
      <Navbar forceWhite={true} disableScrollEffect={true} />

      <main className="pt-[125px] bg-white text-black w-full pb-20">
        {/* Responsive Hero Header */}
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-5xl py-12 sm:py-16 md:py-20">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] break-words text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              MAKE AN APPOINTMENT
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
              CRAFTING TRADITION. WEAVING HERITAGE.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="max-w-5xl mx-auto mt-10 px-6 lg:px-12">
          <form
            onSubmit={handleSubmit}
            className="bg-[#f2f2f2] p-6 md:p-8 rounded-2xl shadow-lg space-y-7"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Full Name"
                className="p-3 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30"
                required
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email Address"
                className="p-3 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30"
                required
              />
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                type="text"
                placeholder="City"
                className="p-3 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30"
                required
              />
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                type="text"
                placeholder="Country"
                className="p-3 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30"
                required
              />
              <input
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                type="tel"
                placeholder="Mobile Number"
                className="p-3 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30"
                required
              />
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="p-3 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30"
                required
              >
                <option value="">Select Timezone</option>
                <option value="IST">IST (India Standard Time)</option>
                <option value="EST">EST (Eastern Standard Time)</option>
                <option value="PST">PST (Pacific Standard Time)</option>
                <option value="GMT">GMT (Greenwich Mean Time)</option>
                <option value="CET">CET (Central European Time)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="date"
                value={formData.date}
                onChange={handleChange}
                type="date"
                className="p-3 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30"
                required
              />
              <input
                name="time"
                value={formData.time}
                onChange={handleChange}
                type="time"
                className="p-3 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30"
                required
              />
              <div className="flex items-center text-sm gap-2">
                <FaVideo className="text-[#742402]" />
                <i>Web conferencing details will be provided upon confirmation</i>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-[#742402] hover:bg-[#5c1c01] transition text-white py-3 uppercase font-semibold tracking-wide rounded-xl"
            >
              Book Appointment
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}
