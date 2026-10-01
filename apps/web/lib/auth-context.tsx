"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const hydrateMockUser = (mockData: any) => {
  return {
    ...mockData.user,
    role: "FOUNDER",
    getIdToken: async () => mockData.accessToken,
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const isDemo =
    !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "dummy_key";

  useEffect(() => {
    if (isDemo) {
      const saved = localStorage.getItem("demo_user_v2");
      if (saved) setUser(hydrateMockUser(JSON.parse(saved)));
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemo]);

  const login = async (email: string, password: string) => {
    if (isDemo) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      localStorage.setItem("demo_user_v2", JSON.stringify(data));
      setUser(hydrateMockUser(data));
      return;
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (isDemo) {
      localStorage.removeItem("demo_user_v2");
      setUser(null);
      return;
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      loading: false,
      login: async () => {},
      logout: async () => {},
    };
  }
  return ctx;
}
