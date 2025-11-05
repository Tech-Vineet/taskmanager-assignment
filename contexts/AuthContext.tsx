"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { trpc } from "@/lib/trpc";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = "task-app-current-user";
const USER_ID_KEY = "user-id";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
  const sessionQuery = trpc.auth.getSession.useQuery(undefined, {
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    // Load user from localStorage on mount
    const loadUser = async () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(CURRENT_USER_KEY);
        const userId = localStorage.getItem(USER_ID_KEY);
        
        if (stored && userId) {
          try {
            const userData = JSON.parse(stored);
            setUser(userData);
            setIsLoading(false);
            // Verify session with backend
            try {
              await sessionQuery.refetch();
            } catch {
              // If session is invalid, clear local storage
              localStorage.removeItem(CURRENT_USER_KEY);
              localStorage.removeItem(USER_ID_KEY);
              setUser(null);
            }
          } catch (e) {
            localStorage.removeItem(CURRENT_USER_KEY);
            localStorage.removeItem(USER_ID_KEY);
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      
      setUser(result);
      if (typeof window !== "undefined") {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(result));
        localStorage.setItem(USER_ID_KEY, result.id);
      }
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const result = await registerMutation.mutateAsync({ email, password, name });
      
      setUser(result);
      if (typeof window !== "undefined") {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(result));
        localStorage.setItem(USER_ID_KEY, result.id);
      }
      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem(USER_ID_KEY);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


