import axios from "axios";

const userAxios = axios.create({
  baseURL: "https://www.shabnamoverseas.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

userAxios.interceptors.request.use(
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

export default userAxios;
