"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle } from "lucide-react";

import { AuthService } from "@/services/auth.service";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
});

type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordSchemaType) {
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await AuthService.forgotPassword(values.email);
      setSubmitSuccess("If this email exists, a password reset code has been sent.");
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
      }, 1500);
    } catch (err: unknown) {
      const error = err as Error;
      setSubmitError(error.message || "Failed to trigger password reset code request.");
    }
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="No worries, enter your email and we will send you a reset code."
      footer={
        <>
          Remembered your password?{" "}
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

        {submitSuccess && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs animate-in fade-in duration-200">
            <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-500 mt-0.5" />
            <span className="font-medium">{submitSuccess}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <Input
              id="email"
              type="email"
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" /> Sending Code…
            </>
          ) : (
            "Send Code"
          )}
        </Button>

        <div className="text-center pt-2">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
