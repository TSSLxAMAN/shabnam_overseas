"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type User = {
  _id: string;
  email: string;
  name?: string;
  token: string;
  role:string;
};

type Admin = {
  _id: string;
  email: string;
  name?: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  admin: Admin | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  admin: null,
  login: async () => {},
  logout: () => {},
  adminLogin: async () => {},
  adminLogout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    // Check for admin first
    const adminStored = localStorage.getItem("adminInfo");
    if (adminStored) {
      try {
        const adminParsed = JSON.parse(adminStored);
        setAdmin(adminParsed);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${adminParsed.token}`;
        return; // If admin is logged in, don't check for user
      } catch (error) {
        console.error("Error parsing admin data:", error);
        localStorage.removeItem("adminInfo");
      }
    }

    // Check for user if no admin
    const userStored = localStorage.getItem("userInfo");
    if (userStored) {
      try {
        const userParsed = JSON.parse(userStored);
        setUser(userParsed);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${userParsed.token}`;
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("userInfo");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await axios.post("https://www.shabnamoverseas.com/api/users/login", {
      email,
      password,
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data);
    setAdmin(null); // Clear admin if user logs in
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const adminLogin = async (email: string, password: string) => {
    const { data } = await axios.post("https://www.shabnamoverseas.com/api/admin/login", {
      email,
      password,
    });
    // console.log("admin logged in",data)
    localStorage.setItem("adminInfo", JSON.stringify(data));
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setAdmin(data);
    setUser(null);
  };

  const adminLogout = () => {
    localStorage.removeItem("adminInfo");
    delete axios.defaults.headers.common["Authorization"];
    setAdmin(null);
  };

  // console.log("AuthProvider - User:", user, "Admin:", admin);

  return (
    <AuthContext.Provider
      value={{ user, admin, login, logout, adminLogin, adminLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
