// lib/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://www.shabnamoverseas.com/api/admin", // ✅ FIXED!
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const adminInfo = localStorage.getItem("adminInfo");
      if (adminInfo) {
        const parsed = JSON.parse(adminInfo);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
