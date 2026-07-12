"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Building2, Globe, Loader2, AlertCircle } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const onboardingSchema = z.object({
  business_name: z
    .string()
    .min(1, "Business name is required")
    .max(100, "Business name is too long"),
  website_url: z
    .string()
    .optional()
    .refine((val) => !val || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(val), {
      message: "Please enter a valid website URL",
    }),
});

type OnboardingSchemaType = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const { onboard } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingSchemaType>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      business_name: "",
      website_url: "",
    },
  });

  async function onSubmit(values: OnboardingSchemaType) {
    setSubmitError(null);
    try {
      await onboard({
        business_name: values.business_name,
        website_url: values.website_url || undefined,
      });
    } catch (err: unknown) {
      const error = err as Error;
      setSubmitError(error.message || "Failed to complete onboarding. Please try again.");
    }
  }

  return (
    <AuthLayout
      title="Set up your workspace"
      subtitle="Register your first business to initiate competitor tracking."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {submitError && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs animate-in fade-in duration-200">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
            <span className="font-medium">{submitError}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="business_name">Business Name</Label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <Input
              id="business_name"
              type="text"
              placeholder="e.g. Downtown Coffee Co."
              {...register("business_name")}
              aria-invalid={!!errors.business_name}
              className={`pl-10.5 ${errors.business_name ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : ""}`}
            />
          </div>
          {errors.business_name ? (
            <p className="text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
              {errors.business_name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="website_url">Website URL (Optional)</Label>
          <div className="relative">
            <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <Input
              id="website_url"
              type="text"
              placeholder="e.g. https://downtowncoffee.com"
              {...register("website_url")}
              aria-invalid={!!errors.website_url}
              className={`pl-10.5 ${errors.website_url ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : ""}`}
            />
          </div>
          {errors.website_url ? (
            <p className="text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
              {errors.website_url.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" /> Starting scan…
            </>
          ) : (
            "Complete Onboarding"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
