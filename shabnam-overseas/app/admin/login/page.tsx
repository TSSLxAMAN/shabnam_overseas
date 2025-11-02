// "use client";

// import { useState, useContext } from "react";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import axios from "@/lib/axios"; // ✅ Using shared axios instance
// import { AuthContext } from "@/app/context/UserAuthContext";
// import { useAuth } from "@/app/context/UserAuthContext";
// import { openAsBlob } from "fs";

// export default function AdminLoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { adminLogin } = useContext(AuthContext);
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       adminLogin(email,password)
//       toast.success("Admin login successful");
//       router.push("/admin/dashboard");
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 text-gray-700">
//       <div className="max-w-md w-full p-6 rounded-2xl shadow-md bg-white">
//         <h2 className="text-2xl font-semibold mb-6 text-center text-navy">
//           Admin Login
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block mb-1 text-sm font-medium">Email</label>
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
//             />
//           </div>
//           <div>
//             <label className="block mb-1 text-sm font-medium">Password</label>
//             <input
//               type="password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-2 px-4 bg-navy text-white rounded hover:bg-navy/90 transition duration-200 bg-blue-500"
//           >
//             {loading ? "Logging in..." : "Login as Admin"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }











"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AuthContext } from "@/app/context/UserAuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(email, password);
      toast.success("Admin login successful");
      router.push("/admin/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Force navbar white; no scroll/hover animation */}
      <Navbar forceWhite={true} disableScrollEffect={true} />

      <main className="pt-[170px] bg-white text-black min-h-screen">
        {/* Brand hero */}
        <section className="text-center bg-[#f5dfd6] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-5xl py-10 sm:py-14 md:py-16">
            <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-2 leading-[0.95] break-words text-3xl sm:text-5xl md:text-6xl">
              Admin Login
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Secure access to your dashboard.
            </p>
          </div>
        </section>

        {/* Form card */}
        <section className="px-6 lg:px-12">
          <form
            onSubmit={handleSubmit}
            className="bg-white border shadow-lg rounded-2xl w-full max-w-md mx-auto mt-10 p-6 sm:p-8 space-y-4"
          >
            <label className="block">
              <span className="block text-sm font-medium mb-1">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full border px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#742402]/30"
                placeholder="admin@example.com"
              />
            </label>

            <label className="block">
              <span className="block text-sm font-medium mb-1">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full border px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#742402]/30"
                placeholder="••••••••"
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
              {loading ? "Logging in…" : "Login as Admin"}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}
