"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { verifyEmail, resendOtp } = useAuth();

  // OTP inputs state: 6 digits
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Submitting states
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Resend code countdown timer
  const [cooldown, setCooldown] = useState(30);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Focus the first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    // Only allow single digit input
    const char = value.slice(-1);
    if (char && !/^\d$/.test(char)) return;

    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);
    setError(null);

    // If input is filled, shift focus forward
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current box is empty, focus previous box and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
        setError(null);
      } else {
        // Just clear current box
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        setError(null);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return; // verify standard 6 digits

    const digits = pastedData.split("");
    setOtp(digits);
    setError(null);

    // Focus the last input box
    inputRefs.current[5]?.focus();
  };

  const handleResend = async () => {
    if (cooldown > 0 || !email) return;
    
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      await resendOtp(email);
      setCooldown(30);
      setSuccess("A new 6-digit code has been sent to your email.");
      setOtp(Array(6).fill(""));
      
      // Autofocus first input box
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 50);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to resend verification code.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    if (!email) {
      setError("Email address is missing. Please register again.");
      return;
    }

    setSubmitting(true);

    try {
      await verifyEmail({ email, otp: otpCode });
      setSuccess("Success! Redirecting to login...");
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Verification failed. Please check your code.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper check if code is complete to visually prompt submit
  const isCodeComplete = otp.every((digit) => digit !== "");

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={email ? `Enter the 6-digit code we just sent to ${email}.` : "Enter the 6-digit code we just sent to your email."}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        {/* Messages */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs animate-in fade-in duration-200">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs animate-in fade-in duration-200">
            <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-500 mt-0.5" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* Info callout banner box */}
        <div className="flex items-center gap-3.5 p-4.5 rounded-2xl bg-[#f5f8ff] border border-blue-100/50">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Mail className="h-5 w-5 stroke-[2]" />
          </div>
          <p className="text-[13px] leading-snug text-slate-600 font-medium">
            Check your inbox — and spam folder. The code expires in <span className="font-semibold text-slate-800">10 minutes</span>.
          </p>
        </div>

        {/* OTP Input Groups (Split 3 and 3 by a hyphen) */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex gap-2.5">
            {[0, 1, 2].map((idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                value={otp[idx]}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-xl font-bold text-slate-800 bg-[#f8fafd] border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-150"
              />
            ))}
          </div>

          <span className="text-xl font-medium text-slate-400 select-none px-0.5">—</span>

          <div className="flex gap-2.5">
            {[3, 4, 5].map((idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                value={otp[idx]}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-xl font-bold text-slate-800 bg-[#f8fafd] border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-150"
              />
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={submitting || (!isCodeComplete && !submitting)}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" /> Verifying…
            </>
          ) : (
            "Verify & continue"
          )}
        </Button>

        {/* Resend Cooldown indicator */}
        <div className="text-center">
          {cooldown > 0 ? (
            <p className="text-sm text-slate-500 font-medium select-none">
              Didn&apos;t get a code? Resend in <span className="font-semibold text-slate-800">{cooldown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 rounded px-1.5 py-0.5"
            >
              Didn&apos;t get a code? Resend code
            </button>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link 
            href="/register" 
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 rounded px-1.5 py-0.5"
          >
            <ArrowLeft className="h-4 w-4" /> Use a different email
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fcfdfe]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-500">Loading verification page...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
