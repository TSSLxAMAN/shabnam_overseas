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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
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
        <section className="px-6 lg:px-12">
          <form
            onSubmit={handleLogin}
            className="bg-white border shadow-lg rounded-2xl w-full max-w-md mx-auto mt-10 p-6 sm:p-8 space-y-4"
          >
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
              <Link href="/admin/login" className="text-red-500 hover:underline">
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
