// 'use client';

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// export default function ForgotPasswordPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
//     setError('');

//     try {
//       const res = await axios.post('https://api.shabnamoverseas.com/api/users/forgot-password', { email });

//       setMessage(res.data.message || 'Reset link sent to your email.');
//     } catch (err: any) {
//       setError(err?.response?.data?.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

//         {message && <div className="text-green-600 text-sm text-center mb-4">{message}</div>}
//         {error && <div className="text-red-600 text-sm text-center mb-4">{error}</div>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               Enter your email
//             </label>
//             <input
//               id="email"
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="you@example.com"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
//           >
//             {loading ? 'Sending...' : 'Send Reset Link'}
//           </button>
//         </form>

//         <p className="text-sm mt-6 text-center">
//           Remembered your password?{' '}
//           <a href="/login" className="text-blue-500 hover:underline">
//             Go back to Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

// app/forgot-password/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEmailValid = useMemo(() => {
    if (!email) return true; // show neutral until typing starts
    // simple client-side check (doesn't replace backend validation)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "https://api.shabnamoverseas.com/api/users/forgot-password",
        { email }
      );
      setMessage(res.data?.message || "Reset link sent to your email.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* always-white navbar, no scroll effect */}
      <Navbar forceWhite disableScrollEffect />

      <main className="pt-[125px] bg-white text-black w-full">
        {/* hero header (matches your appointment page) */}
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-5xl py-12 sm:py-16 md:py-20">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] break-words text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Forgot Password
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
              We’ll email you a secure reset link.
            </p>
          </div>
        </section>

        {/* card */}
        <section className="max-w-5xl mx-auto mt-10 px-6 lg:px-12 pb-12">
          <div className="mx-auto w-full max-w-md bg-[#f2f2f2] p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
            {/* banners */}
            {message && (
              <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-800"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={[
                    "w-full p-3 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30",
                    !isEmailValid ? "border-red-300" : "",
                  ].join(" ")}
                />
                {!isEmailValid && (
                  <p className="mt-1 text-xs text-red-600">
                    Please enter a valid email address.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isEmailValid}
                className="w-full bg-[#742402] hover:bg-[#5c1c01] transition text-white py-3 rounded-xl uppercase font-semibold tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <p className="text-center text-sm text-gray-600">
                Remembered your password?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#742402] underline-offset-2 hover:underline"
                >
                  Go back to Login
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
