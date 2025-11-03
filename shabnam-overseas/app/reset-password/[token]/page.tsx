'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams, useParams } from "next/navigation";
import toast from 'react-hot-toast';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // token handling (safe even if path used)
  const [token, setToken] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
 const params = useParams();

  // derive simple strength & match state (purely UI)
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score; // 0-5
  }, [password]);

  const match = confirmPassword.length > 0 && password === confirmPassword;

  useEffect(() => {
    // Resolve token from query (?token=) or from the last path segment
    const q = searchParams?.get("token");
    if (q) {
      setToken(q);
      return;
    }

    if (params?.token) {
      setToken(Array.isArray(params.token) ? params.token[0] : params.token);
      return;
    }

    if (typeof window !== "undefined") {
      const last = window.location.pathname.split("/").pop();
      setToken(last || null);
    }
  }, [searchParams, params]);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;
      try {
        await axios.get(
          `https://www.shabnamoverseas.com/api/users/reset-password/${token}`
        );
        setValidToken(true);
      } catch (err) {
        toast.error("Invalid or expired link");
        router.push("/appointment");
      }
    };
    verifyToken();
  }, [token, router]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Missing token");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `https://www.shabnamoverseas.com/api/users/reset-password/${token}`,
        {
          password,
        }
      );
      toast.success("Password reset successful");
      setTimeout(() => {
        router.push("/appointment"); // keep your redirect
      }, 1200);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    // while verifying token, show branded skeleton
    return (
      <>
        <Navbar forceWhite disableScrollEffect />
        <main className="pt-[170px] bg-white text-black w-full">
          <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
            <div className="w-full max-w-5xl py-12 sm:py-16 md:py-20">
              <div className="h-10 w-72 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
              <div className="h-5 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>
          </section>
          <section className="max-w-5xl mx-auto mt-10 px-6 lg:px-12 pb-16">
            <div className="mx-auto w-full max-w-md bg-[#f2f2f2] p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="space-y-4">
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-11 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-11 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-11 w-40 bg-gray-200 rounded animate-pulse" />
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
      {/* ✅ Always-white navbar */}
      <Navbar forceWhite disableScrollEffect />

      <main className="pt-[170px] bg-white text-black w-full">
        {/* Hero header to match appointment page */}
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-5xl py-12 sm:py-16 md:py-20">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] break-words text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Reset Password
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
              Choose a new password for your account.
            </p>
          </div>
        </section>

        {/* Card */}
        <section className="max-w-5xl mx-auto mt-10 px-6 lg:px-12 pb-20">
          <div className="mx-auto w-full max-w-md bg-[#f2f2f2] p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-gray-800"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 pr-24 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Strength bar */}
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-gray-200 rounded">
                    <div
                      className={[
                        "h-1.5 rounded transition-all",
                        strength <= 1
                          ? "w-1/5 bg-red-400"
                          : strength === 2
                          ? "w-2/5 bg-orange-400"
                          : strength === 3
                          ? "w-3/5 bg-yellow-400"
                          : strength === 4
                          ? "w-4/5 bg-lime-400"
                          : "w-full bg-emerald-500",
                      ].join(" ")}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-600">
                    Use at least 8 characters, mixing letters, numbers, and
                    symbols.
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm"
                  className="mb-1 block text-sm font-medium text-gray-800"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={[
                      "w-full p-3 pr-24 rounded border outline-none focus:ring-2 focus:ring-[#742402]/30",
                      confirmPassword.length > 0
                        ? match
                          ? "border-emerald-300"
                          : "border-red-300"
                        : "",
                    ].join(" ")}
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
                {confirmPassword.length > 0 && (
                  <p
                    className={[
                      "mt-1 text-xs",
                      match ? "text-emerald-600" : "text-red-600",
                    ].join(" ")}
                  >
                    {match ? "Passwords match" : "Passwords do not match"}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#742402] hover:bg-[#5c1c01] transition text-white py-3 rounded-xl uppercase font-semibold tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* ✅ Footer */}
      <Footer />
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}