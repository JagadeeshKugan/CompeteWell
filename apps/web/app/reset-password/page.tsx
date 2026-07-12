"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, Lock, KeyRound, AlertCircle, CheckCircle } from "lucide-react";

import { AuthService } from "@/services/auth.service";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .min(1, "Verification code is required")
      .length(6, "Verification code must be exactly 6 digits"),
    new_password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      new_password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(values: ResetPasswordSchemaType) {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!email) {
      setSubmitError("Email context is missing. Please request a new code.");
      return;
    }

    try {
      await AuthService.resetPassword({
        email,
        otp: values.otp,
        new_password: values.new_password,
      });
      setSubmitSuccess("Password has been reset successfully. Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: unknown) {
      const error = err as Error;
      setSubmitError(error.message || "Failed to reset password.");
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={email ? `Enter the code we sent to ${email} and create a new password.` : "Enter the verification code and create a new password."}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {submitError && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs animate-in fade-in duration-200">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
            <span className="font-medium">{submitError}</span>
          </div>
        )}

        {submitSuccess && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs animate-in fade-in duration-200">
            <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-500 mt-0.5" />
            <span className="font-medium">{submitSuccess}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="otp">Reset Code (OTP)</Label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <Input
              id="otp"
              type="text"
              placeholder="123456"
              maxLength={6}
              {...register("otp")}
              aria-invalid={!!errors.otp}
              className={`pl-10.5 ${errors.otp ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : ""}`}
            />
          </div>
          {errors.otp ? (
            <p className="text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
              {errors.otp.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="new_password">New Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <Input
              id="new_password"
              type={showPwd ? "text" : "password"}
              placeholder="Enter new password"
              {...register("new_password")}
              aria-invalid={!!errors.new_password}
              className={`pl-10.5 pr-10.5 ${errors.new_password ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPwd ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
          {errors.new_password ? (
            <p className="text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
              {errors.new_password.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm_password">Confirm New Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <Input
              id="confirm_password"
              type={showConfirmPwd ? "text" : "password"}
              placeholder="Confirm new password"
              {...register("confirm_password")}
              aria-invalid={!!errors.confirm_password}
              className={`pl-10.5 pr-10.5 ${errors.confirm_password ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPwd((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" /> Resetting password…
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fcfdfe]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-500">Loading page...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
