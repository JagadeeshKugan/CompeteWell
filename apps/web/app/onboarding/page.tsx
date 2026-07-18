"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  Globe, 
  Loader2, 
  AlertCircle, 
  MapPin, 
  Phone, 
  Search, 
  Check, 
  Clock, 
  Sparkles, 
  ChevronDown, 
  ArrowLeft, 
  ArrowRight,
  LogOut,
  Building,
  FileText,
  Star,
  CheckCircle,
  ShieldCheck,
  Compass,
  Zap
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  OnboardingProvider, 
  useOnboarding, 
  GoogleBusinessResult 
} from "@/store/onboarding-context";
import { AuthService } from "@/services/auth.service";

const CATEGORIES = [
  "Cafe / Coffee Shop",
  "Restaurant / Diner",
  "Dentist / Dental Practice",
  "Fitness Center / Gym",
  "Hair Salon / Barber Shop",
  "Bookstore / Library",
  "Boutique / Clothing Store",
  "Day Spa / Massage Therapy",
  "Real Estate Agency",
  "Medical Clinic / Doctor",
  "Auto Repair Shop",
  "Bakery / Donut Shop",
  "Pet Grooming / Vet Clinic",
  "Law Firm / Legal Services",
  "Dry Cleaner / Laundry Service",
  "Gym / Yoga Studio"
];

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IN", name: "India" }
];

const MOCK_BUSINESSES: GoogleBusinessResult[] = [
  {
    id: "mock-biz-1",
    name: "Bluebird Coffee House",
    category: "Cafe / Coffee Shop",
    rating: 4.8,
    reviewCount: 142,
    address: "123 Main St, San Francisco, CA 94103",
    verified: true,
    website: "www.bluebirdcoffee.com",
    phone: "+1 (415) 555-0142",
  },
  {
    id: "mock-biz-2",
    name: "The Daily Grind Cafe",
    category: "Cafe / Coffee Shop",
    rating: 4.5,
    reviewCount: 98,
    address: "456 Valencia St, San Francisco, CA 94110",
    verified: true,
    website: "www.dailygrindcafe.com",
    phone: "+1 (415) 555-9876",
  },
  {
    id: "mock-biz-3",
    name: "Mission Delights Restaurant",
    category: "Restaurant / Diner",
    rating: 4.2,
    reviewCount: 64,
    address: "789 Oak St, San Francisco, CA 94102",
    verified: false,
    website: "www.missiondelights.com",
    phone: "+1 (415) 555-3456",
  },
  {
    id: "mock-biz-4",
    name: "Golden Gate Fitness",
    category: "Fitness Center / Gym",
    rating: 4.9,
    reviewCount: 215,
    address: "101 Pine St, San Francisco, CA 94111",
    verified: true,
    website: "www.goldengatefitness.com",
    phone: "+1 (415) 555-1212",
  },
  {
    id: "mock-biz-5",
    name: "Peak Health Dental",
    category: "Dentist / Dental Practice",
    rating: 4.7,
    reviewCount: 83,
    address: "202 Bush St, San Francisco, CA 94104",
    verified: true,
    website: "www.peakhealthdental.com",
    phone: "+1 (415) 555-4321",
  },
];

const STEPS = [
  { id: 1, label: "Welcome" },
  { id: 2, label: "Organization" },
  { id: 3, label: "Business" },
  { id: 4, label: "Lookup" },
  { id: 5, label: "Verify" },
  { id: 6, label: "Preferences" },
  { id: 7, label: "Complete" },
];

function BusinessCardSkeleton() {
  return (
    <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm flex items-start gap-4 animate-pulse">
      <div className="h-10 w-10 rounded-xl bg-slate-100 shrink-0" />
      <div className="flex-1 space-y-3 min-w-0">
        <div className="flex items-center justify-between">
          <div className="h-4 w-1/3 bg-slate-100 rounded" />
          <div className="h-4 w-16 bg-slate-100 rounded" />
        </div>
        <div className="h-3.5 w-1/4 bg-slate-100 rounded" />
        <div className="space-y-2">
          <div className="h-3 w-3/4 bg-slate-100 rounded" />
          <div className="h-3 w-1/2 bg-slate-100 rounded" />
        </div>
      </div>
    </div>
  );
}

function OnboardingWizard() {
  const { logout, user, checkMe } = useAuth();
  const router = useRouter();

  const {
    state,
    setStep,
    updateOrganization,
    updateBusinessInfo,
    updateSelectedBusiness,
    updateAnalysisPreferences,
    completeStep,
  } = useOnboarding();

  const currentStep = state.currentStep;
  const maxCompletedStep = state.maxCompletedStep;

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Step 2 local errors
  const [orgErrors, setOrgErrors] = useState<{ name?: string }>({});

  // Step 3 local errors
  const [bizInfoErrors, setBizInfoErrors] = useState<{
    name?: string;
    category?: string;
    zipCode?: string;
  }>({});

  // Step 3 Category Searchable Select State
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>(state.businessInfo.category);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Step 4 state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [showDefaults, setShowDefaults] = useState(false);

  // Step 5 verification states
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [verifyErrors, setVerifyErrors] = useState<{
    name?: string;
    address?: string;
    category?: string;
  }>({});

  // Category selection click listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update Google search query when business name changes, if user hasn't typed in search yet
  useEffect(() => {
    if (!searchQuery && state.businessInfo.name) {
      setSearchQuery(state.businessInfo.name);
      setDebouncedQuery(state.businessInfo.name);
    }
  }, [state.businessInfo.name, searchQuery]);

  // Debounce search query to simulate network delay in Step 4
  useEffect(() => {
    if (currentStep === 4 && searchQuery) {
      setIsLoadingResults(true);
      const timer = setTimeout(() => {
        setDebouncedQuery(searchQuery);
        setIsLoadingResults(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, currentStep]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setIsLoadingResults(true);
  };

  // Sync Verification form fields when Step 5 is activated
  useEffect(() => {
    if (currentStep === 5) {
      if (state.selectedBusiness) {
        setEditName(state.selectedBusiness.name);
        setEditAddress(state.selectedBusiness.address);
        setEditWebsite(state.selectedBusiness.website || "");
        setEditPhone(state.selectedBusiness.phone || "");
        setEditCategory(state.selectedBusiness.category);
      } else {
        setEditName(state.businessInfo.name);
        setEditAddress("");
        setEditWebsite(state.businessInfo.website || "");
        setEditPhone(state.businessInfo.phone || "");
        setEditCategory(state.businessInfo.category);
      }
      setVerifyErrors({});
    }
  }, [currentStep, state.selectedBusiness, state.businessInfo]);

  // Handle category select
  const handleSelectCategory = (cat: string) => {
    updateBusinessInfo({ category: cat });
    setIsCategoryDropdownOpen(false);
    setCategorySearchQuery("");
    if (bizInfoErrors.category) {
      setBizInfoErrors(prev => ({ ...prev, category: undefined }));
    }
  };

  const filteredCategories = CATEGORIES.filter(cat =>
    cat.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  // Business lookup filtering
  const filteredBusinesses = MOCK_BUSINESSES.filter(biz =>
    biz.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    biz.category.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    biz.address.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  // Navigation Logic
  const handleContinue = () => {
    setSubmitError(null);

    if (currentStep === 1) {
      completeStep(1);
    } else if (currentStep === 2) {
      if (!state.organization.name.trim()) {
        setOrgErrors({ name: "Organization Name is required" });
        return;
      }
      setOrgErrors({});
      completeStep(2);
    } else if (currentStep === 3) {
      const errors: { name?: string; category?: string; zipCode?: string } = {};
      if (!state.businessInfo.name.trim()) {
        errors.name = "Business Name is required";
      }
      if (!state.businessInfo.category) {
        errors.category = "Business Category is required";
      }
      if (!state.businessInfo.zipCode.trim()) {
        errors.zipCode = "ZIP / Postal Code is required";
      }
      if (Object.keys(errors).length > 0) {
        setBizInfoErrors(errors);
        return;
      }
      setBizInfoErrors({});
      completeStep(3);
    } else if (currentStep === 4) {
      if (!state.selectedBusiness) {
        setSubmitError("Please select a business listing to continue.");
        return;
      }
      completeStep(4);
    } else if (currentStep === 5) {
      const errors: { name?: string; address?: string; category?: string } = {};
      if (!editName.trim()) {
        errors.name = "Business Name is required";
      }
      if (!editAddress.trim()) {
        errors.address = "Address is required";
      }
      if (!editCategory.trim()) {
        errors.category = "Category is required";
      }
      if (Object.keys(errors).length > 0) {
        setVerifyErrors(errors);
        return;
      }
      
      // Save changes to selectedBusiness
      updateSelectedBusiness({
        id: state.selectedBusiness?.id || "manual-entry",
        name: editName,
        address: editAddress,
        website: editWebsite,
        phone: editPhone,
        category: editCategory,
        rating: state.selectedBusiness?.rating || 5.0,
        reviewCount: state.selectedBusiness?.reviewCount || 0,
        verified: state.selectedBusiness?.verified || false
      });
      
      setVerifyErrors({});
      completeStep(5);
    }
  };

  const handleBack = () => {
    setSubmitError(null);
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  };

  const handleFinishSetup = async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const targetBusiness = state.selectedBusiness!;

      // Sync and mark completed in backend
      await AuthService.onboard({
        organization_name: state.organization.name,
        business_name: targetBusiness.name,
        category: targetBusiness.category,
        zip_code: state.businessInfo.zipCode,
        country: state.businessInfo.country,
        website_url: targetBusiness.website || undefined,
        phone: targetBusiness.phone || undefined,
        address: targetBusiness.address,
        is_verified: targetBusiness.verified,
        rating: targetBusiness.rating,
        review_count: targetBusiness.reviewCount,
        radius: state.analysisPreferences.radius,
        competitor_count: parseInt(state.analysisPreferences.competitorCount, 10),
        depth: state.analysisPreferences.depth,
      });

      // Advance to Success Page (Step 7)
      completeStep(6);
    } catch (err: unknown) {
      const error = err as Error;
      setSubmitError(error.message || "Failed to finalize onboarding setup. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToDashboard = async () => {
    setIsSubmitting(true);
    try {
      // Re-fetch user to make sure auth state reflects onboarding completion
      await checkMe();
    } catch {
      router.push("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafd] text-slate-800 selection:bg-blue-100 selection:text-blue-800 pb-24 md:pb-6">
      
      {/* Header bar */}
      <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100 shadow-sm z-30">
        <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4.5 w-4.5"
            >
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">CompeteWell</span>
        </Link>

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-700">{user.full_name}</span>
              <span className="text-[10px] text-slate-400">{user.email}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/60 rounded-xl transition-all cursor-pointer bg-white"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Page Container */}
      <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6">
        <div className="w-full max-w-[900px] space-y-8 animate-in fade-in duration-300">
          
          {/* Header Title Section */}
          <div className="text-left space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Setup CompeteWell</h1>
            <p className="text-xs text-slate-500">
              Configure your workspace, lookup your storefront, and specify tracking parameters.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm overflow-x-auto scrollbar-hide">
            <div className="flex items-center justify-between w-full min-w-[760px] px-2 py-2">
              {STEPS.map((step, idx) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                const isNavigatable = step.id <= maxCompletedStep + 1;
                
                return (
                  <React.Fragment key={step.id}>
                    {/* Step item */}
                    <button
                      type="button"
                      disabled={!isNavigatable || currentStep === 7}
                      onClick={() => setStep(step.id)}
                      className={`flex flex-col items-center gap-1 focus:outline-none transition-all group ${
                        isNavigatable && currentStep < 7 ? "cursor-pointer" : "cursor-not-allowed"
                      }`}
                    >
                      <div 
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 ${
                          isCompleted
                            ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20"
                            : isActive
                            ? "border-blue-600 text-blue-600 bg-white ring-4 ring-blue-500/10 scale-105"
                            : "border-slate-200 text-slate-400 bg-white group-hover:border-slate-300"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4 stroke-[3]" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        isActive || isCompleted ? "text-slate-800" : "text-slate-400 group-hover:text-slate-500"
                      }`}>
                        {step.label}
                      </span>
                    </button>

                    {/* Connecting line */}
                    {idx < STEPS.length - 1 && (
                      <div className="flex-1 mx-2 h-0.5 min-w-[12px] bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-500 ease-out" 
                          style={{ width: isCompleted ? "100%" : "0%" }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Submission Error Banner */}
          {submitError && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 text-xs font-medium animate-in fade-in duration-200">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
              <div>
                <p className="font-bold mb-0.5">Setup Error</p>
                <p className="text-rose-600">{submitError}</p>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 1: Welcome Page
              ======================================================== */}
          {currentStep === 1 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-10 shadow-sm flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                <Building2 className="h-8 w-8" />
              </div>
              <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome to CompeteWell</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Let&apos;s set up your organization and first business location.
                </p>
              </div>

              <div className="flex items-center gap-2 py-2 px-4 bg-slate-50 rounded-full border border-slate-100/50 text-[11px] font-semibold text-slate-500">
                <Clock className="h-3.5 w-3.5 text-blue-600" />
                <span>Estimated setup time: About 2 minutes</span>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 2: Organization Name
              ======================================================== */}
          {currentStep === 2 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Organization Setup</h2>
                  <p className="text-[11px] text-slate-400">Establish your organizational boundary.</p>
                </div>
              </div>

              <div className="space-y-4 max-w-xl">
                <div className="space-y-1.5">
                  <Label htmlFor="org_name" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Organization Name
                  </Label>
                  <Input
                    id="org_name"
                    type="text"
                    value={state.organization.name}
                    onChange={(e) => {
                      updateOrganization({ name: e.target.value });
                      if (orgErrors.name) setOrgErrors({});
                    }}
                    placeholder="e.g. Acme Corp / Bluebird Group"
                    className={orgErrors.name ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10" : ""}
                  />
                  {orgErrors.name && (
                    <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 animate-in fade-in duration-100">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {orgErrors.name}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 leading-normal mt-1">
                    This represents your company and can contain multiple business locations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 3: Business Information Form
              ======================================================== */}
          {currentStep === 3 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Business Information</h2>
                  <p className="text-[11px] text-slate-400">Provide the foundational details for your profile.</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Business Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="business_name" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Business Name
                  </Label>
                  <Input
                    id="business_name"
                    type="text"
                    value={state.businessInfo.name}
                    onChange={(e) => {
                      updateBusinessInfo({ name: e.target.value });
                      if (bizInfoErrors.name) {
                        setBizInfoErrors(prev => ({ ...prev, name: undefined }));
                      }
                    }}
                    placeholder="e.g. Bluebird Coffee House"
                    className={bizInfoErrors.name ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10" : ""}
                  />
                  {bizInfoErrors.name && (
                    <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 animate-in fade-in duration-100">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {bizInfoErrors.name}
                    </p>
                  )}
                </div>

                {/* Business Category Dropdown */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Business Category
                  </Label>
                  <div className="relative" ref={categoryDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsCategoryDropdownOpen(prev => !prev)}
                      className={`flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all duration-150 cursor-pointer ${
                        bizInfoErrors.category 
                          ? "border-rose-300 ring-rose-500/10" 
                          : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      }`}
                    >
                      <span className={state.businessInfo.category ? "text-slate-800" : "text-slate-400"}>
                        {state.businessInfo.category || "Search categories..."}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isCategoryDropdownOpen && (
                      <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="p-2 border-b border-slate-50 bg-slate-50/50 flex items-center gap-2">
                          <Search className="h-4 w-4 text-slate-400 shrink-0 ml-1.5" />
                          <input
                            type="text"
                            placeholder="Search category list..."
                            value={categorySearchQuery}
                            onChange={(e) => setCategorySearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none py-1.5"
                          />
                        </div>

                        <div className="max-h-[200px] overflow-y-auto py-1">
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => handleSelectCategory(cat)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                                  state.businessInfo.category === cat ? "bg-blue-50/50 text-blue-700 font-bold" : "text-slate-600"
                                }`}
                              >
                                <span>{cat}</span>
                                {state.businessInfo.category === cat && <Check className="h-3.5 w-3.5 text-blue-600" />}
                              </button>
                            ))
                          ) : (
                            <p className="text-[11px] text-slate-400 text-center py-4 font-medium">No categories matching search</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {bizInfoErrors.category && (
                    <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 animate-in fade-in duration-100">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {bizInfoErrors.category}
                    </p>
                  )}
                </div>

                {/* Country & ZIP Code Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="country" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Country
                    </Label>
                    <div className="relative">
                      <select
                        id="country"
                        value={state.businessInfo.country}
                        onChange={(e) => updateBusinessInfo({ country: e.target.value })}
                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-150 appearance-none cursor-pointer"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="h-4 w-4 text-slate-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="zip_code" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      ZIP / Postal Code
                    </Label>
                    <Input
                      id="zip_code"
                      type="text"
                      value={state.businessInfo.zipCode}
                      onChange={(e) => {
                        updateBusinessInfo({ zipCode: e.target.value });
                        if (bizInfoErrors.zipCode) {
                          setBizInfoErrors(prev => ({ ...prev, zipCode: undefined }));
                        }
                      }}
                      placeholder="e.g. 94103"
                      className={bizInfoErrors.zipCode ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10" : ""}
                    />
                    {bizInfoErrors.zipCode && (
                      <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 animate-in fade-in duration-100">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {bizInfoErrors.zipCode}
                      </p>
                    )}
                  </div>
                </div>

                {/* Website & Phone optional grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="website" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Website <span className="text-slate-400 font-normal lowercase">(optional)</span>
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <Input
                        id="website"
                        type="text"
                        value={state.businessInfo.website}
                        onChange={(e) => updateBusinessInfo({ website: e.target.value })}
                        placeholder="www.example.com"
                        className="pl-10.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Phone <span className="text-slate-400 font-normal lowercase">(optional)</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <Input
                        id="phone"
                        type="text"
                        value={state.businessInfo.phone}
                        onChange={(e) => updateBusinessInfo({ phone: e.target.value })}
                        placeholder="+1 (415) 555-0142"
                        className="pl-10.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 4: Business Lookup (Search & select mock listing)
              ======================================================== */}
          {currentStep === 4 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Business Lookup</h2>
                  <p className="text-[11px] text-slate-400">Search or select your business listing from Google Maps mock registry.</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Type business name, address or category..."
                  className="pl-10.5 bg-slate-50/50 focus:bg-white transition-colors"
                />
              </div>

              {/* Results Container */}
              <div className="space-y-4">
                {isLoadingResults ? (
                  // Loading State Skeletons
                  <div className="space-y-3">
                    <BusinessCardSkeleton />
                    <BusinessCardSkeleton />
                    <BusinessCardSkeleton />
                  </div>
                ) : !searchQuery && !showDefaults ? (
                  // Empty State
                  <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-4 bg-slate-50/30">
                    <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto">
                      <Compass className="h-6 w-6" />
                    </div>
                    <div className="space-y-1 max-w-sm mx-auto">
                      <h3 className="text-xs font-bold text-slate-700">Search for your business listing</h3>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Type in the search bar above to look up your storefront, or reveal all mock location files instantly.
                      </p>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowDefaults(true)}
                      className="h-9 px-4 text-xs font-bold mx-auto flex items-center gap-1.5"
                    >
                      Scan Nearby Storefronts
                    </Button>
                  </div>
                ) : filteredBusinesses.length === 0 ? (
                  // No Results State
                  <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-4 bg-slate-50/30">
                    <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mx-auto">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div className="space-y-1 max-w-sm mx-auto">
                      <h3 className="text-xs font-bold text-slate-700">No Listings Match &apos;{searchQuery}&apos;</h3>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        We couldn&apos;t find matching storefront records in this ZIP code radius. Try searching for &quot;coffee&quot;, &quot;dental&quot;, or reset filtering.
                      </p>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery("");
                        setDebouncedQuery("");
                        setShowDefaults(true);
                      }}
                      className="h-9 px-4 text-xs font-bold mx-auto"
                    >
                      Reset Search filter
                    </Button>
                  </div>
                ) : (
                  // Business card listings
                  <div className="grid grid-cols-1 gap-3.5">
                    {filteredBusinesses.map((biz) => {
                      const isSelected = state.selectedBusiness?.id === biz.id;
                      return (
                        <div
                          key={biz.id}
                          onClick={() => {
                            updateSelectedBusiness(biz);
                            setSubmitError(null);
                          }}
                          className={`border rounded-2xl p-4.5 bg-white flex items-start gap-4 transition-all duration-200 cursor-pointer shadow-sm relative group hover:border-blue-200 ${
                            isSelected 
                              ? "border-blue-600 ring-2 ring-blue-500/10 bg-blue-50/10 shadow-blue-500/5" 
                              : "border-slate-100 hover:shadow"
                          }`}
                        >
                          <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-500 group-hover:bg-slate-100"
                          }`}>
                            <Building className="h-5 w-5" />
                          </div>

                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs font-extrabold text-slate-800 tracking-tight">{biz.name}</h4>
                              {biz.verified && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/50 uppercase tracking-wider">
                                  <ShieldCheck className="h-3 w-3 stroke-[2.5]" /> Verified
                                </span>
                              )}
                            </div>

                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{biz.category}</p>

                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                              <div className="flex items-center text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-3 w-3 ${i < Math.floor(biz.rating) ? "fill-amber-400 stroke-amber-400" : "stroke-slate-300"}`} 
                                  />
                                ))}
                              </div>
                              <span className="font-bold text-slate-700">{biz.rating}</span>
                              <span className="text-slate-400 font-normal">({biz.reviewCount} reviews)</span>
                            </div>

                            <p className="text-[10px] text-slate-500 leading-snug font-medium flex items-center gap-1.5 pt-0.5">
                              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span>{biz.address}</span>
                            </p>

                            <div className="flex items-center gap-x-4 gap-y-1.5 flex-wrap text-[10px] text-slate-400 pt-1">
                              {biz.website && (
                                <span className="flex items-center gap-1">
                                  <Globe className="h-3 w-3 text-slate-400" />
                                  <span>{biz.website}</span>
                                </span>
                              )}
                              {biz.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-slate-400" />
                                  <span>{biz.phone}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateSelectedBusiness(biz);
                                setSubmitError(null);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-blue-600 text-white shadow-sm"
                                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100"
                              }`}
                            >
                              {isSelected ? "Selected" : "Select Business"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 5: Business Verification (Editable Listing Form)
              ======================================================== */}
          {currentStep === 5 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Verify Business Listing</h2>
                  <p className="text-[11px] text-slate-400">Confirm or update your business profile details before scanning.</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Editable Business Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="v_name" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Business Name
                  </Label>
                  <Input
                    id="v_name"
                    type="text"
                    value={editName}
                    onChange={(e) => {
                      setEditName(e.target.value);
                      if (verifyErrors.name) setVerifyErrors(prev => ({ ...prev, name: undefined }));
                    }}
                    className={verifyErrors.name ? "border-rose-300 focus:border-rose-500" : ""}
                  />
                  {verifyErrors.name && (
                    <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {verifyErrors.name}
                    </p>
                  )}
                </div>

                {/* Editable Category */}
                <div className="space-y-1.5">
                  <Label htmlFor="v_category" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Business Category
                  </Label>
                  <select
                    id="v_category"
                    value={editCategory}
                    onChange={(e) => {
                      setEditCategory(e.target.value);
                      if (verifyErrors.category) setVerifyErrors(prev => ({ ...prev, category: undefined }));
                    }}
                    className={`flex h-11 w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all ${
                      verifyErrors.category ? "border-rose-300" : "border-slate-200"
                    }`}
                  >
                    <option value="">Select Category...</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {verifyErrors.category && (
                    <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {verifyErrors.category}
                    </p>
                  )}
                </div>

                {/* Editable Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="v_address" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Full Physical Address
                  </Label>
                  <Input
                    id="v_address"
                    type="text"
                    value={editAddress}
                    onChange={(e) => {
                      setEditAddress(e.target.value);
                      if (verifyErrors.address) setVerifyErrors(prev => ({ ...prev, address: undefined }));
                    }}
                    placeholder="Street Address, City, State, ZIP"
                    className={verifyErrors.address ? "border-rose-300 focus:border-rose-500" : ""}
                  />
                  {verifyErrors.address && (
                    <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {verifyErrors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Website */}
                  <div className="space-y-1.5">
                    <Label htmlFor="v_website" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Website
                    </Label>
                    <Input
                      id="v_website"
                      type="text"
                      value={editWebsite}
                      onChange={(e) => setEditWebsite(e.target.value)}
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label htmlFor="v_phone" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Phone Number
                    </Label>
                    <Input
                      id="v_phone"
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 6: Analysis Preferences
              ======================================================== */}
          {currentStep === 6 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Scan & Analysis Preferences</h2>
                  <p className="text-[11px] text-slate-400">Configure parameters for local SEO tracking and competitor analysis.</p>
                </div>
              </div>

              {/* Radius Card Grid */}
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Competitor Radius</Label>
                  <p className="text-[11px] text-slate-400">How far around your physical store should we search for rivals?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "3 km", label: "3 km", desc: "Hyper-local search for high density urban walk-ins." },
                    { value: "5 km", label: "5 km", desc: "Balanced radius ideal for mid-sized cities or districts." },
                    { value: "10 km", label: "10 km", desc: "Regional scope best for suburban hubs or motor access." }
                  ].map((opt) => {
                    const isSel = state.analysisPreferences.radius === opt.value;
                    return (
                      <div
                        key={opt.value}
                        onClick={() => updateAnalysisPreferences({ radius: opt.value })}
                        className={`border rounded-2xl p-4.5 cursor-pointer text-left transition-all relative ${
                          isSel 
                            ? "border-blue-600 bg-blue-50/10 ring-2 ring-blue-500/10 shadow-sm" 
                            : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/40"
                        }`}
                      >
                        <h4 className="text-xs font-extrabold text-slate-800 mb-1">{opt.label}</h4>
                        <p className="text-[10px] text-slate-500 leading-snug">{opt.desc}</p>
                        {isSel && <Check className="absolute right-3.5 top-3.5 h-4.5 w-4.5 text-blue-600 stroke-[3]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Count Card Grid */}
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Competitor Count</Label>
                  <p className="text-[11px] text-slate-400">The total number of competitor locations to track on your dashboards.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "5", label: "5 competitors", desc: "Focused target metrics on your immediate primary rivals." },
                    { value: "10", label: "10 competitors", desc: "Industry standard mapping for regional benchmarks." },
                    { value: "20", label: "20 competitors", desc: "Full market scan including distant or minor players." }
                  ].map((opt) => {
                    const isSel = state.analysisPreferences.competitorCount === opt.value;
                    return (
                      <div
                        key={opt.value}
                        onClick={() => updateAnalysisPreferences({ competitorCount: opt.value })}
                        className={`border rounded-2xl p-4.5 cursor-pointer text-left transition-all relative ${
                          isSel 
                            ? "border-blue-600 bg-blue-50/10 ring-2 ring-blue-500/10 shadow-sm" 
                            : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/40"
                        }`}
                      >
                        <h4 className="text-xs font-extrabold text-slate-800 mb-1">{opt.label}</h4>
                        <p className="text-[10px] text-slate-500 leading-snug">{opt.desc}</p>
                        {isSel && <Check className="absolute right-3.5 top-3.5 h-4.5 w-4.5 text-blue-600 stroke-[3]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Depth Card Grid */}
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Analysis Depth</Label>
                  <p className="text-[11px] text-slate-400">Specifies the scan coverage, detailed AI auditing, and processing time.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "Quick", label: "Quick Scan", desc: "Summarized ratings, reviews count, and listing scores. Fast setup." },
                    { value: "Standard", label: "Standard audit", desc: "Detailed review sentiments, SEO keyword ratings, and location indexes." },
                    { value: "Deep", label: "Deep AI Audit", desc: "Full competitive index mapping, reviews NLP audit, pricing plans, and tips." }
                  ].map((opt) => {
                    const isSel = state.analysisPreferences.depth === opt.value;
                    return (
                      <div
                        key={opt.value}
                        onClick={() => updateAnalysisPreferences({ depth: opt.value })}
                        className={`border rounded-2xl p-4.5 cursor-pointer text-left transition-all relative ${
                          isSel 
                            ? "border-blue-600 bg-blue-50/10 ring-2 ring-blue-500/10 shadow-sm" 
                            : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/40"
                        }`}
                      >
                        <h4 className="text-xs font-extrabold text-slate-800 mb-1">{opt.label}</h4>
                        <p className="text-[10px] text-slate-500 leading-snug">{opt.desc}</p>
                        {isSel && <Check className="absolute right-3.5 top-3.5 h-4.5 w-4.5 text-blue-600 stroke-[3]" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 7: Success Page (Complete)
              ======================================================== */}
          {currentStep === 7 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Success Illustration (SVG Graphic) */}
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-xl scale-125 animate-pulse" />
                <div className="relative h-20 w-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-md">
                  <CheckCircle className="h-10 w-10 stroke-[2]" />
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your business is ready.</h2>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  CompeteWell can now analyze your business and nearby competitors. All background scrapers have been dispatched.
                </p>
              </div>

              {/* Confirmation Details Card */}
              <div className="border border-slate-100 bg-slate-50/40 rounded-2xl p-5 max-w-sm w-full text-left space-y-3.5 text-xs text-slate-600 font-semibold shadow-inner">
                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                  <div className="h-6 w-6 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    <Building className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-extrabold text-slate-800 text-xs truncate">
                    {state.selectedBusiness?.name || state.businessInfo.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">ZIP Code</span>
                    <span className="text-slate-700 font-extrabold">{state.businessInfo.zipCode}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Radius</span>
                    <span className="text-slate-700 font-extrabold">{state.analysisPreferences.radius}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Competitors</span>
                    <span className="text-slate-700 font-extrabold">{state.analysisPreferences.competitorCount}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Depth</span>
                    <span className="text-slate-700 font-extrabold">{state.analysisPreferences.depth}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  onClick={handleGoToDashboard}
                  disabled={isSubmitting}
                  className="h-12 px-8 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-sm font-extrabold shadow-lg shadow-blue-500/10"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" /> Finalizing...
                    </>
                  ) : (
                    <>
                      Go to Dashboard <ArrowRight className="h-4.5 w-4.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================
              Footer Buttons (Desktop/Tablet)
              ======================================================== */}
          {currentStep < 7 && (
            <div className="hidden md:flex items-center justify-between pt-6 border-t border-slate-100">
              {currentStep > 1 ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBack} 
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 hover:bg-slate-100 border-slate-200 text-slate-600 h-10 px-4 text-xs font-bold"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </Button>
              ) : <div />}

              {currentStep < 6 ? (
                <Button 
                  type="button" 
                  onClick={handleContinue}
                  className="flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 h-10 px-5 text-xs font-bold shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={handleFinishSetup}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 h-10 px-5 text-xs font-bold shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Setup finishing...
                    </>
                  ) : (
                    <>
                      Finish Setup <Sparkles className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* ========================================================
              Sticky Footer Buttons (Mobile Screen)
              ======================================================== */}
          {currentStep < 7 && (
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100/80 p-4 z-40 flex items-center justify-between shadow-2xl">
              {currentStep > 1 ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBack} 
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 h-11 px-4 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              ) : <div />}

              {currentStep < 6 ? (
                <Button 
                  type="button" 
                  onClick={handleContinue}
                  className="flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 h-11 px-6 text-xs font-bold shadow-md cursor-pointer"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={handleFinishSetup}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 h-11 px-6 text-xs font-bold shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Launching Setup...
                    </>
                  ) : (
                    <>
                      Finish Setup <Sparkles className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingWizard />
    </OnboardingProvider>
  );
}
