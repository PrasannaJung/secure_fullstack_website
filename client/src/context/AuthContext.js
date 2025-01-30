"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = decodeToken(token);
    setUser(decoded);
    // autoLogout(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
