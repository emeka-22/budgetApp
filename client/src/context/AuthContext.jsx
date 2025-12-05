import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper to decode JWT and check expiration
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    return true; // If token is invalid, consider it expired
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      // Check if token is expired
      if (isTokenExpired(storedToken)) {
        // Token expired, clear storage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      } else {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  // Auto-logout when token expires
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const checkTokenExpiration = () => {
      if (isTokenExpired(token)) {
        logout();
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
