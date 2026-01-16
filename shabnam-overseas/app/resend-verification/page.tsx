"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        "https://api.shabnamoverseas.com/api/users/resend-verification",
        { email }
      );

      setSuccess(true);
      toast.success("Verification email sent!");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to send verification email";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Navbar forceWhite disableScrollEffect />
        <main className="pt-[170px] bg-white text-black w-full min-h-screen">
          <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
            <div className="w-full max-w-5xl py-12 sm:py-16 md:py-20">
              <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] break-words text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                Check Your Email
              </h1>
              <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
                Verification email sent successfully
              </p>
            </div>
          </section>

          <section className="max-w-5xl mx-auto mt-10 px-6 lg:px-12 pb-20">
            <div className="mx-auto w-full max-w-2xl bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-200 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Verification Email Sent!
              </h2>

              <p className="text-gray-600 mb-2">
                We've sent a new verification email to:
              </p>
              <p className="text-[#742402] font-semibold text-lg mb-6">
                {email}
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Next Steps:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                  <li>Check your inbox for the verification email</li>
                  <li>Click the verification link in the email</li>
                  <li>Return here and log in with your credentials</li>
                </ol>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                The verification link will expire in 24 hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/login"
                  className="px-6 py-3 bg-[#742402] hover:bg-[#5c1c01] text-white rounded-lg font-semibold transition"
                >
                  Go to Login
                </Link>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                  }}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition"
                >
                  Resend Again
                </button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar forceWhite disableScrollEffect />

      <main className="pt-[170px] bg-white text-black w-full min-h-screen">
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-5xl py-12 sm:py-16 md:py-20">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] break-words text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Resend Verification
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
              Get a new verification link
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto mt-10 px-6 lg:px-12 pb-20">
          <div className="mx-auto w-full max-w-md bg-[#f2f2f2] p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="mb-6">
              <p className="text-gray-700 text-sm mb-4">
                Didn't receive the verification email? Enter your email address
                below and we'll send you a new one.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                <strong>Tip:</strong> Check your spam folder first before
                requesting a new email.
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="you@example.com"
                  className="w-full p-3 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#742402] hover:bg-[#5c1c01] transition text-white py-3 rounded-xl uppercase font-semibold tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Verification Email"}
              </button>

              <div className="text-center text-sm text-gray-600">
                <Link
                  href="/login"
                  className="font-semibold text-[#742402] underline-offset-2 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
