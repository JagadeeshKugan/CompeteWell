"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
  FileText
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Custom type definitions for the wizard
interface Step {
  id: number;
  title: string;
  subtitle: string;
}

const STEPS: Step[] = [
  { id: 1, title: "Business Info", subtitle: "Basic details" },
  { id: 2, title: "Location", subtitle: "Verify presence" },
  { id: 3, title: "Preferences", subtitle: "Analysis setup" },
  { id: 4, title: "Confirm", subtitle: "Review & launch" },
];

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

interface GoogleBusinessResult {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  verified: boolean;
  description: string;
}

export default function OnboardingPage() {
  const { onboard, logout, user } = useAuth();
  
  // Wizard Navigation
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Step 1 State: Business Info
  const [businessName, setBusinessName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [country, setCountry] = useState<string>("US");
  const [zipCode, setZipCode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [step1Errors, setStep1Errors] = useState<{ businessName?: string; category?: string; zipCode?: string }>({});

  // Category Searchable Select State
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>("");
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Step 2 State: Location & Google Business Search
  const [googleSearchQuery, setGoogleSearchQuery] = useState<string>("");
  const [isSearchingGoogle, setIsSearchingGoogle] = useState<boolean>(false);
  const [googleSearchResults, setGoogleSearchResults] = useState<GoogleBusinessResult[]>([]);
  const [hasSearchedGoogle, setHasSearchedGoogle] = useState<boolean>(false);
  const [selectedGoogleId, setSelectedGoogleId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [step2Errors, setStep2Errors] = useState<{ address?: string; phone?: string }>({});

  // Step 3 State: Preferences (Pre-populated matching design screenshots)
  const [radius, setRadius] = useState<string>("5 miles");
  const [competitorCount, setCompetitorCount] = useState<string>("10");
  const [focusAreas, setFocusAreas] = useState<string[]>(["Reviews", "Competitors"]);

  // --- Helpers & Handlers ---

  // Auto-fill City from ZIP
  useEffect(() => {
    if (zipCode.trim().length >= 3) {
      // Simulate API lookup
      const mockZipToCity: Record<string, string> = {
        "94103": "San Francisco",
        "10001": "New York",
        "90210": "Beverly Hills",
        "98101": "Seattle",
        "60601": "Chicago",
        "30301": "Atlanta",
        "02101": "Boston",
        "90001": "Los Angeles"
      };
      
      const foundCity = mockZipToCity[zipCode.trim()];
      if (foundCity) {
        setCity(foundCity);
      } else {
        // Fallback placeholder lookup logic for simulation
        setCity("San Francisco"); 
      }
    } else {
      setCity("");
    }
  }, [zipCode]);

  // Click outside listener for category select dropdown
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
    if (!googleSearchQuery && businessName) {
      setGoogleSearchQuery(businessName);
    }
  }, [businessName, googleSearchQuery]);

  // Handle category selection
  const handleSelectCategory = (cat: string) => {
    setCategory(cat);
    setIsCategoryDropdownOpen(false);
    setCategorySearchQuery("");
    if (step1Errors.category) {
      setStep1Errors(prev => ({ ...prev, category: undefined }));
    }
  };

  // Filtered categories
  const filteredCategories = CATEGORIES.filter(cat =>
    cat.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  // Simulate Google Business Search
  const handleSearchGoogleBusiness = () => {
    if (!googleSearchQuery.trim()) return;
    
    setIsSearchingGoogle(true);
    // Simulate short premium network delay
    setTimeout(() => {
      const bizName = googleSearchQuery.trim();
      const mockResults: GoogleBusinessResult[] = [
        {
          id: "biz-1",
          name: `${bizName} - Downtown`,
          address: "123 Main St, San Francisco, CA 94103",
          phone: "+1 (415) 555-0142",
          website: `www.${bizName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
          verified: true,
          description: "Cozy neighborhood establishment serving the local community with premium quality and friendly service since 2018."
        },
        {
          id: "biz-2",
          name: `${bizName} - Mission District`,
          address: "456 Valencia St, San Francisco, CA 94110",
          phone: "+1 (415) 555-9876",
          website: `www.${bizName.toLowerCase().replace(/[^a-z0-9]/g, "")}mission.com`,
          verified: true,
          description: "Modern storefront featuring specialty items, premium seating, and dedicated service."
        },
        {
          id: "biz-3",
          name: bizName.toLowerCase().includes("cafe") || bizName.toLowerCase().includes("coffee") 
            ? `${bizName}` 
            : `${bizName} Cafe`,
          address: "789 Oak St, San Francisco, CA 94102",
          phone: "+1 (415) 555-3456",
          website: `www.${bizName.toLowerCase().replace(/[^a-z0-9]/g, "")}cafesf.com`,
          verified: false,
          description: "Local dining option serving great items and fresh drinks in a relaxed atmosphere."
        }
      ];
      
      setGoogleSearchResults(mockResults);
      setIsSearchingGoogle(false);
      setHasSearchedGoogle(true);
    }, 800);
  };

  // Handle selecting a Google search result
  const handleSelectGoogleResult = (result: GoogleBusinessResult) => {
    setSelectedGoogleId(result.id);
    setIsVerified(result.verified);
    
    // Auto-fill form fields
    setAddress(result.address);
    setPhone(result.phone);
    setWebsite(result.website);
    setDescription(result.description);
    
    // Clear validation errors
    setStep2Errors({});
  };

  // Toggle multi-select focus areas
  const handleToggleFocusArea = (area: string) => {
    if (focusAreas.includes(area)) {
      setFocusAreas(prev => prev.filter(a => a !== area));
    } else {
      setFocusAreas(prev => [...prev, area]);
    }
  };

  // Validation routines
  const validateStep1 = (): boolean => {
    const errors: { businessName?: string; category?: string; zipCode?: string } = {};
    if (!businessName.trim()) {
      errors.businessName = "Business name is required";
    }
    if (!category) {
      errors.category = "Please select a business category";
    }
    if (!zipCode.trim()) {
      errors.zipCode = "ZIP / Postal Code is required";
    }
    setStep1Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: { address?: string; phone?: string } = {};
    if (!address.trim()) {
      errors.address = "Business address is required";
    }
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    }
    setStep2Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigation logic
  const handleContinue = () => {
    setSubmitError(null);
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    setSubmitError(null);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Final submit triggering onboard logic
  const handleStartAnalysis = async () => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      // Plug and play with backend structure. 
      // Additional preferences are defined here as comments showing how easily this page is scaled 
      // when developers expand their onboarding api endpoint.
      /*
      const fullPayload = {
        business_name: businessName,
        website_url: website || undefined,
        // Scalable variables ready to plug-in:
        category,
        country,
        zip_code: zipCode,
        city,
        address,
        phone,
        description,
        is_verified: isVerified,
        preferences: {
          radius: radius,
          competitor_count: parseInt(competitorCount, 10),
          focus_areas: focusAreas
        }
      };
      */
      
      await onboard({
        business_name: businessName,
        website_url: website || undefined,
      });
    } catch (err: unknown) {
      const error = err as Error;
      setSubmitError(error.message || "Failed to complete onboarding. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafd] text-slate-800 selection:bg-blue-100 selection:text-blue-800">
      
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
      <main className="flex-1 flex flex-col items-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-[860px] space-y-8 animate-in fade-in duration-300">
          
          {/* Header Title Section */}
          <div className="text-left space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Add Business</h1>
            <p className="text-sm text-slate-500">
              {"Let's gather a few details before we analyze your market."}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-5 md:p-6 shadow-sm overflow-x-auto">
            <div className="flex items-center justify-between min-w-[640px] px-2">
              {STEPS.map((step, idx) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                
                return (
                  <React.Fragment key={step.id}>
                    {/* Step item */}
                    <div className="flex items-center gap-3">
                      <div 
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 ${
                          isCompleted
                            ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20"
                            : isActive
                            ? "border-blue-600 text-blue-600 bg-white ring-4 ring-blue-500/10 scale-105"
                            : "border-slate-200 text-slate-400 bg-white"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4 stroke-[3]" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <div className="text-left">
                        <p className={`text-xs font-bold tracking-wide transition-colors ${
                          isActive || isCompleted ? "text-slate-800" : "text-slate-400"
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {step.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Connecting line */}
                    {idx < STEPS.length - 1 && (
                      <div className="flex-1 mx-4 h-0.5 min-w-[20px] bg-slate-100 rounded-full overflow-hidden">
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
                <p className="font-bold mb-0.5">Onboarding Error</p>
                <p className="text-rose-600">{submitError}</p>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 1: Business Information Card
              ======================================================== */}
          {currentStep === 1 && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Building2 className="h-5 w-5" />
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
                    value={businessName}
                    onChange={(e) => {
                      setBusinessName(e.target.value);
                      if (step1Errors.businessName) {
                        setStep1Errors(prev => ({ ...prev, businessName: undefined }));
                      }
                    }}
                    placeholder="e.g. Bluebird Coffee House"
                    className={step1Errors.businessName ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10" : ""}
                  />
                  {step1Errors.businessName && (
                    <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 animate-in fade-in duration-100">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {step1Errors.businessName}
                    </p>
                  )}
                </div>

                {/* Business Category (Searchable Select) */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Business Category
                  </Label>
                  <div className="relative" ref={categoryDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsCategoryDropdownOpen(prev => !prev)}
                      className={`flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all duration-150 cursor-pointer ${
                        step1Errors.category 
                          ? "border-rose-300 ring-rose-500/10" 
                          : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      }`}
                    >
                      <span className={category ? "text-slate-800" : "text-slate-400"}>
                        {category || "Search categories..."}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isCategoryDropdownOpen && (
                      <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                        {/* Search Input */}
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

                        {/* List Items */}
                        <div className="max-h-[220px] overflow-y-auto py-1">
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => handleSelectCategory(cat)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                                  category === cat ? "bg-blue-50/50 text-blue-700 font-bold" : "text-slate-600"
                                }`}
                              >
                                <span>{cat}</span>
                                {category === cat && <Check className="h-3.5 w-3.5 text-blue-600" />}
                              </button>
                            ))
                          ) : (
                            <p className="text-[11px] text-slate-400 text-center py-4 font-medium">No categories matching search</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {step1Errors.category && (
                    <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 animate-in fade-in duration-100">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {step1Errors.category}
                    </p>
                  )}
                </div>

                {/* Country and ZIP / Postal Code Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="country" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Country
                    </Label>
                    <div className="relative">
                      <select
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
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
                      value={zipCode}
                      onChange={(e) => {
                        setZipCode(e.target.value);
                        if (step1Errors.zipCode) {
                          setStep1Errors(prev => ({ ...prev, zipCode: undefined }));
                        }
                      }}
                      placeholder="94103"
                      className={step1Errors.zipCode ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10" : ""}
                    />
                    {step1Errors.zipCode && (
                      <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 animate-in fade-in duration-100">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {step1Errors.zipCode}
                      </p>
                    )}
                  </div>
                </div>

                {/* City (Auto-filled) */}
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    City
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    value={city}
                    disabled
                    placeholder="Auto-filled from ZIP (e.g. San Francisco)"
                    className="bg-slate-50 border-slate-100 text-slate-500 cursor-not-allowed select-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 2: Business Location Card
              ======================================================== */}
          {currentStep === 2 && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Business Location</h2>
                  <p className="text-[11px] text-slate-400">Verify your address and online details using Google Search.</p>
                </div>
              </div>

              {/* Google Business Search Container */}
              <div className="border border-dashed border-slate-200 rounded-xl p-4 md:p-5 bg-slate-50/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-700">Find your business on Google</h3>
                    <p className="text-[10px] text-slate-400">{"We'll pre-fill your address and verified details."}</p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={googleSearchQuery}
                      onChange={(e) => setGoogleSearchQuery(e.target.value)}
                      placeholder="e.g. Bluebird Coffee House"
                      className="h-9 text-xs max-w-[200px] sm:max-w-[240px] bg-white border-slate-200"
                    />
                    <Button 
                      type="button" 
                      onClick={handleSearchGoogleBusiness} 
                      disabled={isSearchingGoogle || !googleSearchQuery.trim()}
                      className="h-9 px-3 text-xs flex items-center gap-1.5"
                    >
                      {isSearchingGoogle ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Search className="h-3 w-3" />
                      )}
                      Search Google Business
                    </Button>
                  </div>
                </div>

                {/* Search Results Area */}
                <div className="border border-slate-100 rounded-lg bg-white overflow-hidden min-h-[120px] flex flex-col justify-center">
                  {!hasSearchedGoogle && !isSearchingGoogle ? (
                    <div className="text-center py-6 px-4 space-y-1">
                      <div className="h-9 w-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto">
                        <Search className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">No results yet</p>
                      <p className="text-[10px] text-slate-400">{'Click "Search Google Business" to find your listing.'}</p>
                    </div>
                  ) : isSearchingGoogle ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500 mx-auto mb-2" />
                      <p className="text-[11px] text-slate-400 font-medium">Scanning Google listings...</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {googleSearchResults.map((result) => {
                        const isSelected = selectedGoogleId === result.id;
                        return (
                          <div 
                            key={result.id}
                            onClick={() => handleSelectGoogleResult(result)}
                            className={`p-3.5 flex items-start gap-3 hover:bg-slate-50/50 transition-colors cursor-pointer ${
                              isSelected ? "bg-blue-50/30 border-l-2 border-blue-600" : ""
                            }`}
                          >
                            <div className="mt-0.5 h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                              <Building className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0 space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="text-xs font-bold text-slate-800">{result.name}</h4>
                                {result.verified && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/50 uppercase tracking-wider">
                                    <Check className="h-2 w-2 stroke-[4]" /> Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 truncate">{result.address}</p>
                            </div>
                            <div className="h-5 w-5 rounded-full border border-slate-200 flex items-center justify-center bg-white shrink-0 self-center">
                              {isSelected && <Check className="h-3 w-3 text-blue-600 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Location Fields Form */}
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Business Address
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (step2Errors.address) {
                        setStep2Errors(prev => ({ ...prev, address: undefined }));
                      }
                    }}
                    placeholder="Street, City, State"
                    className={step2Errors.address ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10" : ""}
                  />
                  {step2Errors.address && (
                    <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 animate-in fade-in duration-100">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {step2Errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <Input
                        id="phone"
                        type="text"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (step2Errors.phone) {
                            setStep2Errors(prev => ({ ...prev, phone: undefined }));
                          }
                        }}
                        placeholder="+1 (415) 555-0142"
                        className={`pl-10.5 ${step2Errors.phone ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10" : ""}`}
                      />
                    </div>
                    {step2Errors.phone && (
                      <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 animate-in fade-in duration-100">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {step2Errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="website" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Website <span className="text-slate-400 font-normal lowercase">(optional)</span>
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <Input
                        id="website"
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="www.example.com"
                        className="pl-10.5"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Business Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </Label>
                  <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Cozy neighborhood coffee shop serving artisanal espresso, fresh pastries, and community vibes since 2018."
                    className="flex w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 resize-y"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 3: Analysis Preferences Card
              ======================================================== */}
          {currentStep === 3 && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Analysis Preferences</h2>
                  <p className="text-[11px] text-slate-400">Configure target metrics and prioritize scanning focus.</p>
                </div>
              </div>

              {/* Radius preferences */}
              <div className="space-y-2">
                <div>
                  <Label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Radius
                  </Label>
                  <p className="text-[11px] text-slate-400">How far around your location should we analyze?</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {["1 mile", "3 miles", "5 miles", "10 miles"].map((item) => {
                    const isSelected = radius === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setRadius(item)}
                        className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                          isSelected
                            ? "bg-blue-50/50 border-blue-600 text-blue-700 shadow-sm"
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Competitor Count */}
              <div className="space-y-2">
                <div>
                  <Label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Competitor Count
                  </Label>
                  <p className="text-[11px] text-slate-400">Number of competitors to track and benchmark against.</p>
                </div>
                <div className="grid grid-cols-3 gap-3 max-w-lg">
                  {["5", "10", "20"].map((count) => {
                    const isSelected = competitorCount === count;
                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setCompetitorCount(count)}
                        className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                          isSelected
                            ? "bg-blue-50/50 border-blue-600 text-blue-700 shadow-sm"
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        {count}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Focus Areas */}
              <div className="space-y-2">
                <div>
                  <Label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Focus Areas
                  </Label>
                  <p className="text-[11px] text-slate-400">Select one or more areas for the AI to prioritize.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Reviews", "SEO", "Competitors", "Website", "Local Presence", "Pricing"].map((area) => {
                    const isSelected = focusAreas.includes(area);
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => handleToggleFocusArea(area)}
                        className={`p-3.5 border rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-50/50 border-blue-600 text-blue-700 shadow-sm"
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <span>{area}</span>
                        {isSelected && <Check className="h-4 w-4 text-blue-600 stroke-[3] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 4: Confirmation Card
              ======================================================== */}
          {currentStep === 4 && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Confirm & Launch</h2>
                  <p className="text-[11px] text-slate-400">Review your profile details before kicking off AI scanning.</p>
                </div>
              </div>

              {/* Confirmation Details Summary */}
              <div className="bg-slate-50/40 border border-slate-100 rounded-xl p-5 md:p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100/50">
                  <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Building className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-slate-800 truncate">{businessName || "Your Business"}</h3>
                      {isVerified && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white shadow-sm uppercase tracking-wider">
                          <Check className="h-2 w-2 stroke-[4]" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{category || "Uncategorized"}</p>
                  </div>
                </div>

                {/* Grid attributes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</span>
                    <p className="font-semibold text-slate-700">{address || "—"}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Website</span>
                    <p className="font-semibold text-slate-700">{website || "—"}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Radius</span>
                    <p className="font-semibold text-slate-700">{radius}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Competitors</span>
                    <p className="font-semibold text-slate-700">{competitorCount} target business(es)</p>
                  </div>
                </div>

                {/* Focus Areas pills */}
                <div className="space-y-2 pt-2 border-t border-slate-100/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Selected Analysis</span>
                  <div className="flex flex-wrap gap-1.5">
                    {focusAreas.length > 0 ? (
                      focusAreas.map(area => (
                        <span 
                          key={area}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200/40"
                        >
                          {area}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No analysis areas selected</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Estimated analysis time notice */}
              <div className="bg-amber-50/40 border border-amber-100/60 rounded-xl p-4 flex gap-3 items-center">
                <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Estimated Analysis Time</h4>
                  <p className="text-[10px] text-slate-500 leading-snug">
                    Approximately 3–5 minutes to generate your first report.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              Footer Buttons
              ======================================================== */}
          <div className="flex items-center justify-between pt-4">
            {/* Back Button */}
            <div>
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBack} 
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 hover:bg-slate-100 border-slate-200 text-slate-600 h-10 px-4 text-xs font-bold"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </Button>
              )}
            </div>

            {/* Continue or Start AI Analysis Button */}
            <div>
              {currentStep < 4 ? (
                <Button 
                  type="button" 
                  onClick={handleContinue}
                  className="flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 h-10 px-5 text-xs font-bold shadow-md shadow-blue-500/10"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={handleStartAnalysis}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 h-10 px-5 text-xs font-bold shadow-md shadow-blue-500/10"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Launching Scan…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" /> Start AI Analysis
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
