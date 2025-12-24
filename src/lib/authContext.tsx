import React, { createContext, useContext, useState, useEffect } from "react";
import { UserDummy } from "../app/constant/user_dummy";

export interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate authentication (replace with real API call)
    if (!email || !password) {
      throw new Error("Email dan password harus diisi");
    }

    const userData: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
    };

    const emailChecker = UserDummy.email === email;
    if (!emailChecker) {
      throw new Error("Email tidak ditemukan");
    }

    const passwordChecker = UserDummy.password === password;
    if (!passwordChecker) {
      throw new Error("Password salah");
    }

    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("loginTimestamp", new Date().toISOString());
    localStorage.setItem("loginEmail", email);

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("loginTimestamp");
    localStorage.removeItem("loginEmail");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
