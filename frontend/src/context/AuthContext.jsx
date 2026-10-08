import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

const DEMO_USERS = {
  "admin@ownstakex.com": { id: 1, name: "Platform Admin", email: "admin@ownstakex.com", role: "admin" },
  "investor@ownstakex.com": { id: 2, name: "Demo Investor", email: "investor@ownstakex.com", role: "investor" },
};
const DEMO_PASSWORD = "password";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("ownstakex_token");
    const u = localStorage.getItem("ownstakex_user");
    if (t && u) {
      setToken(t);
      try {
        setUser(JSON.parse(u));
      } catch {
        localStorage.removeItem("ownstakex_user");
      }
    }
    setLoading(false);
  }, []);

  const persist = (t, u) => {
    setToken(t);
    setUser(u);
    localStorage.setItem("ownstakex_token", t);
    localStorage.setItem("ownstakex_user", JSON.stringify(u));
  };

  const clear = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("ownstakex_token");
    localStorage.removeItem("ownstakex_user");
  };

  // Try the Laravel API first; fall back to built-in demo accounts when the
  // backend is unreachable so the UI stays usable during development.
  const login = async (email, password) => {
    const normalized = email.trim().toLowerCase();
    try {
      const { data } = await client.post("/auth/login", { email: normalized, password });
      persist(data.token, data.user);
      return { user: data.user, demo: false };
    } catch (err) {
      const unreachable = !err.response;
      const demoUser = DEMO_USERS[normalized];
      if (unreachable && demoUser && password === DEMO_PASSWORD) {
        persist("demo-token-" + demoUser.role, demoUser);
        return { user: demoUser, demo: true };
      }
      const message =
        err.response?.data?.message ||
        (unreachable
          ? "Could not reach the API. Please try again shortly."
          : "Invalid email or password.");
      throw new Error(message);
    }
  };

  const register = async (name, email, password) => {
    const { data } = await client.post("/auth/register", {
      name,
      email: email.trim().toLowerCase(),
      password,
      password_confirmation: password,
    });
    persist(data.token, data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await client.post("/auth/logout");
    } catch {
      /* best effort — local session is cleared regardless */
    }
    clear();
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isInvestor: user?.role === "investor",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
