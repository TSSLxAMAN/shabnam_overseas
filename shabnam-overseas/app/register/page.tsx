// // app/register/page.tsx
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// export default function RegisterPage() {
//   const router = useRouter();
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       const { data } = await axios.post('https://www.shabnamoverseas.com/api/users/register', form);
//       localStorage.setItem('userToken', data.token); // optional, based on your flow
//       router.push('/'); // or redirect to login
//       toast.success("registered Success")
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl text-black">
//       <h2 className="text-2xl font-bold mb-4 text-center">Create an Account</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           className="w-full border px-4 py-2 rounded-md"
//           value={form.name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           className="w-full border px-4 py-2 rounded-md"
//           value={form.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           className="w-full border px-4 py-2 rounded-md"
//           value={form.password}
//           onChange={handleChange}
//           required
//         />
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
//         >
//           {loading ? 'Registering...' : 'Register'}
//         </button>
//       </form>
//     </div>
//   );
// }













// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://www.shabnamoverseas.com/api/users/register",
        form
      );
      localStorage.setItem("userToken", data.token); // keep your flow
      toast.success("Registered successfully");
      router.push("/"); // or /login if you prefer
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Registration failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* navbar stays white; no scroll effect */}
      <Navbar forceWhite disableScrollEffect />

      <main className="pt-[170px] bg-white text-black w-full">
        {/* Hero header (matches your appointment page) */}
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-5xl py-12 sm:py-16 md:py-20">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] break-words text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Create an Account
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
              Join us to craft your perfect space.
            </p>
          </div>
        </section>

        {/* Form card */}
        <section className="max-w-5xl mx-auto mt-10 px-6 lg:px-12 pb-20">
          <div className="mx-auto w-full max-w-md bg-[#f2f2f2] p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-gray-800"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full p-3 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-800"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full p-3 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-gray-800"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    className="w-full p-3 pr-24 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 6 characters recommended.
                </p>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#742402] hover:bg-[#5c1c01] transition text-white py-3 rounded-xl uppercase font-semibold tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Register"}
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#742402] underline-offset-2 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
