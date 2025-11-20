"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data } = await axios.get(
          `https://www.shabnamoverseas.com/api/users/verify-email/${token}`
        );
        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err?.response?.data?.message ||
            "Verification failed. The link may be invalid or expired."
        );
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <>
      <Navbar forceWhite disableScrollEffect />

      <main className="pt-[170px] bg-white text-black w-full min-h-screen">
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-5xl py-12 sm:py-16 md:py-20">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] break-words text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Email Verification
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
              Confirming your account
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto mt-10 px-6 lg:px-12 pb-20">
          <div className="mx-auto w-full max-w-2xl bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-200 text-center">
            {status === "loading" && (
              <>
                {/* Loading Spinner */}
                <div className="w-20 h-20 border-4 border-gray-200 border-t-[#742402] rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Verifying Your Email...
                </h2>
                <p className="text-gray-600">
                  Please wait while we confirm your email address.
                </p>
              </>
            )}

            {status === "success" && (
              <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Email Verified Successfully!
                </h2>

                <p className="text-gray-600 mb-8">{message}</p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Your account is now active!
                  </h3>
                  <p className="text-gray-700 text-sm">
                    You can now log in and start exploring our products. Thank
                    you for joining Shabnam Overseas!
                  </p>
                </div>

                <Link
                  href="/login"
                  className="inline-block px-8 py-3 bg-[#742402] hover:bg-[#5c1c01] text-white rounded-lg font-semibold transition"
                >
                  Proceed to Login
                </Link>
              </>
            )}

            {status === "error" && (
              <>
                {/* Error Icon */}
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Verification Failed
                </h2>

                <p className="text-gray-600 mb-8">{message}</p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    What can you do?
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                    <li>
                      Check if the verification link has expired (24 hours)
                    </li>
                    <li>Try registering again with the same email</li>
                    <li>Contact support if you continue to have issues</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/register"
                    className="px-6 py-3 bg-[#742402] hover:bg-[#5c1c01] text-white rounded-lg font-semibold transition"
                  >
                    Register Again
                  </Link>
                  <Link
                    href="/login"
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition"
                  >
                    Try Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
