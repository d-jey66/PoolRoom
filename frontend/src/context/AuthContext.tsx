/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import type { ReactNode } from "react";

export type UserRole = "user" | "moderator" | "admin";

export interface User {
  _id: string;
  fullname: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (formData: Record<string, unknown>) => Promise<void>;
  login: (formData: Record<string, unknown>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const API_URL = import.meta.env.VITE_API_URL + "/api";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/auto-login`, {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) throw new Error();
        const data: User = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    autoLogin();
  }, []);

  const signup = async (formData: Record<string, unknown>) => {
    const toastId = toast.loading("Creating your account...");
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
  
      toast.update(toastId, {
        render: result.message || "Signup successful 🎉",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
  
      navigate("/login");
    } catch (err: any) {
      toast.update(toastId, {
        render: `Error: ${err.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      throw err;
    }
  };

  const login = async (formData: Record<string, unknown>) => {
    const toastId = toast.loading("Logging in...");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      setUser(result);

      toast.update(toastId, {
        render: "Login successful ✅",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      navigate("/panel");
    } catch (err: any) {
      toast.update(toastId, {
        render: `Error: ${err.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      throw err;
    }
  };

  const logout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("User not logged in!");

      toast.update(toastId, {
        render: "Logged out successfully 👋",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      }); 

      setUser(null);
      navigate("/login");
    } catch (err: any) {
      toast.update(toastId, {
        render: `Error: ${err.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
