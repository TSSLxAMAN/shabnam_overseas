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
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://api.shabnamoverseas.com/api/users/register",
        form
      );

      // ✅ Store email and show success message
      setUserEmail(form.email);
      setRegistrationSuccess(true);
      toast.success("Registration successful! Please check your email.");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Registration failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Show success screen after registration
  if (registrationSuccess) {
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
                Verify your account to get started.
              </p>
            </div>
          </section>

          <section className="max-w-5xl mx-auto mt-10 px-6 lg:px-12 pb-20">
            <div className="mx-auto w-full max-w-2xl bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-200 text-center">
              {/* Success Icon */}
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
                Registration Successful!
              </h2>

              <p className="text-gray-600 mb-2">
                We've sent a verification email to:
              </p>
              <p className="text-[#742402] font-semibold text-lg mb-6">
                {userEmail}
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
                    setRegistrationSuccess(false);
                    setForm({ name: "", email: "", password: "" });
                  }}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition"
                >
                  Register Another Account
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-6">
                Didn't receive the email? Check your spam folder or{" "}
                <Link
                  href="/resend-verification"
                  className="text-[#742402] hover:underline font-semibold"
                >
                  resend verification email
                </Link>
                .
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  // ✅ Regular registration form
  return (
    <>
      <Navbar forceWhite disableScrollEffect />

      <main className="pt-[170px] bg-white text-black w-full">
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
