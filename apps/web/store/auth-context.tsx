"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AuthService,
} from "../services/auth.service";
import {
  UserProfile,
  LoginPayload,
  RegisterPayload,
  VerifyEmailPayload,
  OnboardPayload,
} from "../lib/api/auth";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  verifyEmail: (payload: VerifyEmailPayload) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  onboard: (payload: OnboardPayload) => Promise<void>;
  logout: () => Promise<void>;
  checkMe: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const checkMe = async (): Promise<UserProfile | null> => {
    try {
      const profile = await AuthService.getMe();
      setUser(profile);
      return profile;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkMe();
  }, []);

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const res = await AuthService.login(payload);
      setUser(res.user);
      router.push(res.redirectTo || "/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const res = await AuthService.register(payload);
      router.push(res.redirectTo);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (payload: VerifyEmailPayload) => {
    setLoading(true);
    try {
      await AuthService.verifyEmail(payload);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email: string) => {
    await AuthService.resendOtp(email);
  };

  const onboard = async (payload: OnboardPayload) => {
    setLoading(true);
    try {
      const profile = await AuthService.onboard(payload);
      setUser(profile);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
    } finally {
      setUser(null);
      setLoading(false);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        verifyEmail,
        resendOtp,
        onboard,
        logout,
        checkMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
