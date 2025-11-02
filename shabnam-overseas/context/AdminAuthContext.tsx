"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "@/lib/userAxios";
import { useRouter } from "next/navigation";

type AdminInfo = {
  name: string;
  email: string;
  role: string;
};

type ContextType = {
  admin: AdminInfo | null;
  logout: () => void;
};

const AdminAuthContext = createContext<ContextType | undefined>(undefined);

export const AdminAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const { data } = await axios.get("/admin/profile");
        setAdmin(data);
      } catch {
        setAdmin(null);
      }
    };

    const token =
      typeof window !== "undefined" && localStorage.getItem("adminInfo");
    if (token) fetchAdmin();
  }, []);

  const logout = () => {
    localStorage.removeItem("adminInfo");
    setAdmin(null);
    router.push("/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ admin, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context)
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return context;
};
