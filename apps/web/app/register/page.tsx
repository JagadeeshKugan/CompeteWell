"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, Mail, Lock, User, AlertCircle } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirm_password: z.string().min(1, "Please confirm your password"),
    accept_terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type RegisterSchemaType = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
      accept_terms: false,
    },
  });

  async function onSubmit(values: RegisterSchemaType) {
    setSubmitError(null);
    try {
      await registerUser({
        full_name: values.full_name,
        email: values.email,
        password: values.password,
      });
    } catch (err: unknown) {
      const error = err as Error;
      setSubmitError(error.message || "Registration failed. Please check your inputs.");
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start monitoring and benchmarking your competitors."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {submitError && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs animate-in fade-in duration-200">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
            <span className="font-medium">{submitError}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="full_name">Full Name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <Input
              id="full_name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              {...register("full_name")}
              aria-invalid={!!errors.full_name}
              className={`pl-10.5 ${errors.full_name ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : ""}`}
            />
          </div>
          {errors.full_name ? (
            <p className="text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
              {errors.full_name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              {...register("email")}
              aria-invalid={!!errors.email}
              className={`pl-10.5 ${errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : ""}`}
            />
          </div>
          {errors.email ? (
            <p className="text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <Input
              id="password"
              type={showPwd ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a secure password"
              {...register("password")}
              aria-invalid={!!errors.password}
              className={`pl-10.5 pr-10.5 ${errors.password ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
          {errors.password ? (
            <p className="text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm_password">Confirm Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <Input
              id="confirm_password"
              type={showConfirmPwd ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your password"
              {...register("confirm_password")}
              aria-invalid={!!errors.confirm_password}
              className={`pl-10.5 pr-10.5 ${errors.confirm_password ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPwd((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
              aria-label={showConfirmPwd ? "Hide password" : "Show password"}
            >
              {showConfirmPwd ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
          {errors.confirm_password ? (
            <p className="text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
              {errors.confirm_password.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-start gap-2.5">
            <Checkbox id="accept_terms" {...register("accept_terms")} />
            <label htmlFor="accept_terms" className="cursor-pointer text-xs text-slate-500 leading-normal select-none">
              I accept the{" "}
              <Link href="/login" className="underline hover:text-slate-600">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/login" className="underline hover:text-slate-600">
                Privacy Policy
              </Link>
              .
            </label>
          </div>
          {errors.accept_terms ? (
            <p className="text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
              {errors.accept_terms.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" /> Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">OR</span>
          <Separator className="flex-1" />
        </div>

        <Button type="button" variant="outline" className="w-full">
          <GoogleIcon className="h-4.5 w-4.5" /> Continue with Google
        </Button>
      </form>
    </AuthLayout>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.68-.06-1.36-.18-2H12v3.79h5.42a4.63 4.63 0 0 1-2.01 3.04v2.52h3.25c1.9-1.75 2.99-4.33 2.99-7.35Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.63-2.42l-3.25-2.52c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.6A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.9a6.02 6.02 0 0 1 0-3.8V7.5H3.06a10 10 0 0 0 0 9l3.35-2.6Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.88c1.47 0 2.79.5 3.83 1.5l2.87-2.87A10 10 0 0 0 3.06 7.5l3.35 2.6C7.2 7.64 9.4 5.88 12 5.88Z"
      />
    </svg>
  );
}
