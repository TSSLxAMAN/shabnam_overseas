"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "@/app/context/UserAuthContext";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationError, setVerificationError] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setVerificationError(false);

    try {
      await login(email, password);
      toast.success("Login successful");
      router.push("/");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Login failed";

      // ✅ Check if error is due to email not verified
      if (
        errorMessage.toLowerCase().includes("verify your email") ||
        errorMessage.toLowerCase().includes("email before logging")
      ) {
        setVerificationError(true);
        toast.error("Please verify your email first");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Force navbar white with no animation */}
      <Navbar forceWhite={true} disableScrollEffect={true} />

      <main className="pt-[125px] bg-white text-black min-h-screen">
        {/* Hero Section */}
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-5xl py-10 sm:py-14 md:py-16">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-2 leading-[0.95] break-words text-3xl sm:text-5xl md:text-6xl">
              User Login
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Welcome back — sign in to continue.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="px-6 lg:px-12 pb-12">
          <form
            onSubmit={handleLogin}
            className="bg-white border shadow-lg rounded-2xl w-full max-w-md mx-auto mt-10 p-6 sm:p-8 space-y-4"
          >
            {/* ✅ Email Verification Alert */}
            {verificationError && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 text-sm">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">
                      Email Not Verified
                    </h4>
                    <p className="text-yellow-700 mb-2">
                      Please check your inbox for the verification email and
                      click the link to verify your account.
                    </p>
                    <p className="text-xs text-yellow-600">
                      Can't find it? Check your spam folder or{" "}
                      <Link
                        href="/resend-verification"
                        className="underline font-semibold"
                      >
                        resend verification email
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>
            )}

            <label className="block">
              <span className="block text-sm font-medium mb-1">Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#742402]/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="block text-sm font-medium mb-1">Password</span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#742402]/30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white uppercase font-semibold tracking-wide transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#742402] hover:bg-[#5c1c01]"
              }`}
            >
              {loading ? "Logging in…" : "Login"}
            </button>

            <div className="flex justify-between mt-2 text-sm">
              <Link href="/register" className="text-[#742402] hover:underline">
                New here? Register
              </Link>
              <Link
                href="/forgot-password"
                className="text-[#742402] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <p className="text-sm mt-4 text-center">
              Are you an admin?{" "}
              <Link
                href="/admin/login"
                className="text-red-500 hover:underline"
              >
                Login here
              </Link>
            </p>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}
