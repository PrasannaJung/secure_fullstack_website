import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/api";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Decode the JWT token
  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      return payload;
    } catch (error) {
      return null;
    }
  };

  // Auto-logout when the token expires
  const autoLogout = (token) => {
    const decoded = decodeToken(token);
    if (decoded && decoded.exp) {
      const expiresIn = decoded.exp * 1000 - Date.now();
      if (expiresIn > 0) {
        setTimeout(() => {
          logout();
        }, expiresIn);
      } else {
        logout();
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUser(decoded);
        // autoLogout(token);
      }
    }
  }, []);

  // Login function
  const login = async (phone, password) => {
    try {
      const response = await api.post("/auth/login", { phone, password });
      console.log("Full response:", response); // Debug log

      if (response.data.success && response.data.data.token) {
        const token = response.data.data.token;
        console.log("THE TOKEN IS ", token);
        localStorage.setItem("token", token);
        const decoded = decodeToken(token);
        console.log("Decoded token:", decoded); // Debug log

        setUser(decoded);
        localStorage.setItem("user", JSON.stringify(decoded));
        // autoLogout(token);

        // Make sure the navigation happens after state updates
        setTimeout(() => {
          router.push("/");
        }, 0);

        return true;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth/login");
  };

  return { user, login, logout };
};

export default useAuth;
