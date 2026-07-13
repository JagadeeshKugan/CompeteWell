"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Star,
  CheckCircle2,
  ExternalLink,
  Phone,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  LineChart,
  MessageSquare,
  Globe,
  Building2,
  X,
  Check,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock business database
interface Business {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  address: string;
  zipCode: string;
  distance: string;
  isOpen: boolean;
  isVerified: boolean;
  website?: string;
  phone?: string;
  initials: string;
  color: string;
}

const MOCK_BUSINESSES: Business[] = [
  {
    id: "biz_1",
    name: "Bluebird Coffee",
    category: "Cafe",
    rating: 4.8,
    reviewsCount: 142,
    address: "104 E 7th St, Austin, TX 78701",
    zipCode: "78701",
    distance: "0.2 mi",
    isOpen: true,
    isVerified: true,
    website: "https://bluebirdcoffee.com",
    phone: "(512) 555-0192",
    initials: "BC",
    color: "bg-blue-100 text-blue-700"
  },
  {
    id: "biz_2",
    name: "The Grindhouse Austin",
    category: "Coffee Shop",
    rating: 4.5,
    reviewsCount: 89,
    address: "801 Congress Ave, Austin, TX 78701",
    zipCode: "78701",
    distance: "0.5 mi",
    isOpen: true,
    isVerified: true,
    website: "https://grindhouseaustin.com",
    phone: "(512) 555-0143",
    initials: "GH",
    color: "bg-amber-100 text-amber-700"
  },
  {
    id: "biz_3",
    name: "La Patisserie",
    category: "Bakery",
    rating: 4.7,
    reviewsCount: 215,
    address: "602 W Annie St, Austin, TX 78704",
    zipCode: "78704",
    distance: "1.8 mi",
    isOpen: false,
    isVerified: true,
    website: "https://lapatisserie.com",
    phone: "(512) 555-0167",
    initials: "LP",
    color: "bg-pink-100 text-pink-700"
  },
  {
    id: "biz_4",
    name: "Pecan Street Cafe",
    category: "Restaurant",
    rating: 4.2,
    reviewsCount: 63,
    address: "310 E 6th St, Austin, TX 78701",
    zipCode: "78701",
    distance: "0.3 mi",
    isOpen: true,
    isVerified: false,
    website: "",
    phone: "(512) 555-0188",
    initials: "PS",
    color: "bg-emerald-100 text-emerald-700"
  },
  {
    id: "biz_5",
    name: "Capital One Cafe",
    category: "Cafe",
    rating: 4.1,
    reviewsCount: 104,
    address: "106 E 6th St, Austin, TX 78701",
    zipCode: "78701",
    distance: "0.1 mi",
    isOpen: true,
    isVerified: true,
    website: "https://capitalone.com/cafe",
    phone: "(512) 555-0110",
    initials: "CO",
    color: "bg-indigo-100 text-indigo-700"
  }
];

export default function BusinessLookupPage() {
  const [businessName, setBusinessName] = useState("");
  const [zipCode, setZipCode] = useState("78701");
  const [category, setCategory] = useState("");
  
  // App States: 'empty', 'loading', 'results', 'no-results'
  const [state, setState] = useState<"empty" | "loading" | "results" | "no-results">("empty");
  const [results, setResults] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [detailsBusiness, setDetailsBusiness] = useState<Business | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Trigger search
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSelectedBusiness(null);
    setState("loading");

    setTimeout(() => {
      // Filter logic
      const filtered = MOCK_BUSINESSES.filter((biz) => {
        const matchesName =
          !businessName ||
          biz.name.toLowerCase().includes(businessName.toLowerCase());
        const matchesZip = !zipCode || biz.zipCode === zipCode;
        const matchesCategory = !category || biz.category === category;
        return matchesName && matchesZip && matchesCategory;
      });

      if (filtered.length > 0) {
        setResults(filtered);
        setState("results");
      } else {
        setResults([]);
        setState("no-results");
      }
    }, 1500); // Simulated delay
  };

  const handleReset = () => {
    setBusinessName("");
    setZipCode("78701");
    setCategory("");
    setSelectedBusiness(null);
    setState("empty");
  };

  const handleConfirmVerification = () => {
    setShowSuccessModal(true);
  };

  return (
    <div className="relative pb-24">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Find Your Business
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Search your business on Google to verify ownership and start generating AI insights.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side Section: Search Form and Dynamic Results */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Search Card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Business Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="biz-name" className="text-xs font-semibold text-slate-500">
                    Business name
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <Input
                      id="biz-name"
                      type="text"
                      placeholder="e.g. Bluebird Coffee"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="pl-10 h-10 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                {/* ZIP Code */}
                <div className="space-y-1.5">
                  <Label htmlFor="zip" className="text-xs font-semibold text-slate-500">
                    ZIP code
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <Input
                      id="zip"
                      type="text"
                      placeholder="78701"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="pl-10 h-10 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-xs font-semibold text-slate-500">
                    Category
                  </Label>
                  <div className="relative">
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 appearance-none cursor-pointer"
                    >
                      <option value="">Select category</option>
                      <option value="Cafe">Cafe</option>
                      <option value="Coffee Shop">Coffee Shop</option>
                      <option value="Bakery">Bakery</option>
                      <option value="Restaurant">Restaurant</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <span className="text-xs text-slate-400">
                  We'll search Google Business Profile and nearby listings.
                </span>
                
                <div className="flex gap-2">
                  {(businessName || category || zipCode !== "78701") && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="h-10 text-xs gap-1 rounded-xl cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="h-10 px-6 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* DYNAMIC CARD VIEWPORTS */}

          {/* 1. EMPTY STATE */}
          {state === "empty" && (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 shadow-sm text-center flex flex-col items-center justify-center animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Search for your business
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1">
                Enter your business information to find your official Google Business Profile.
              </p>
            </div>
          )}

          {/* 2. LOADING STATE (SKELETONS WITH PULSING EFFECT) */}
          {state === "loading" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50/50 border border-blue-100/50 rounded-xl p-3.5 animate-pulse">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                <span>Searching Google Business listings...</span>
              </div>
              
              {/* Loading Skeletons */}
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex gap-4">
                    <div className="w-11 h-11 rounded-full bg-slate-100 shrink-0" />
                    <div className="space-y-2.5 flex-1 py-1">
                      <div className="h-4 bg-slate-100 rounded w-1/3" />
                      <div className="h-3 bg-slate-100 rounded w-1/4" />
                      <div className="h-3 bg-slate-100 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. NO RESULTS STATE */}
          {state === "no-results" && (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 shadow-sm text-center flex flex-col items-center justify-center animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                No matching businesses found
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
                Try another business name, ZIP code or category.
              </p>
              <Button
                onClick={handleReset}
                variant="outline"
                className="h-10 text-xs px-6 rounded-xl cursor-pointer"
              >
                Search Again
              </Button>
            </div>
          )}

          {/* 4. SEARCH RESULTS STATE */}
          {state === "results" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Found {results.length} results matching your search</span>
              </div>
              
              <div className="space-y-3">
                {results.map((biz) => {
                  const isSelected = selectedBusiness?.id === biz.id;
                  return (
                    <div
                      key={biz.id}
                      onClick={() => setSelectedBusiness(biz)}
                      className={`bg-white border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-md cursor-pointer ${
                        isSelected 
                          ? "border-blue-600 ring-2 ring-blue-500/10 shadow-blue-500/5 bg-blue-50/5" 
                          : "border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      {/* Logo and Metadata */}
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${biz.color}`}>
                          {biz.initials}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-slate-800 text-sm">{biz.name}</h4>
                            
                            {/* Badges */}
                            {biz.isVerified && (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-blue-50 text-[10px] font-semibold text-blue-600 border border-blue-100/50">
                                <CheckCircle2 className="w-3 h-3 text-blue-500" />
                                Google Verified
                              </span>
                            )}
                            {biz.isOpen ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-semibold text-emerald-600 border border-emerald-100/50">
                                Open
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[10px] font-semibold text-rose-600 border border-rose-100/50">
                                Closed
                              </span>
                            )}
                          </div>
                          
                          {/* Subtitles: Rating and Categories */}
                          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                            <span className="font-semibold text-slate-700">{biz.category}</span>
                            <span className="text-slate-300">•</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="font-bold text-slate-700">{biz.rating}</span>
                              <span className="text-slate-400">({biz.reviewsCount} reviews)</span>
                            </div>
                            <span className="text-slate-300">•</span>
                            <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 text-[10px]">{biz.distance}</span>
                          </div>

                          {/* Address */}
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {biz.address}
                          </p>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBusiness(biz);
                          }}
                          variant={isSelected ? "default" : "outline"}
                          className={`h-9 px-4 text-xs font-bold w-full sm:w-28 rounded-xl cursor-pointer ${
                            isSelected ? "bg-blue-600 text-white" : ""
                          }`}
                        >
                          {isSelected ? (
                            <span className="flex items-center gap-1 justify-center">
                              <Check className="w-3.5 h-3.5" /> Selected
                            </span>
                          ) : (
                            "Select Business"
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailsBusiness(biz);
                          }}
                          className="h-9 px-4 text-xs w-full sm:w-28 border border-transparent hover:border-slate-100 rounded-xl cursor-pointer"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Side Panel: Sticky Trust Panel (Desktop Only) */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm sticky top-24 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Why verify your business?
                </h3>
              </div>
            </div>

            {/* Trust points */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50/50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                  <LineChart className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-800">Accurate competitor analysis</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Map nearby businesses within your category and track share of local search.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50/50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-800">Review sentiment analysis</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Understand what your Google reviews say and get comparative analysis.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50/50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                  <Globe className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-800">Local SEO insights</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Audit citations and discover keywords that drive foot traffic to your store.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-50/50 flex items-center justify-center text-pink-600 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-800">Personalized AI recommendations</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Receive daily tasks, prompts, and insights custom-tailored for your category.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-50 pt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block leading-tight font-medium">Estimated setup time</span>
                <span className="text-xs font-bold text-slate-700 leading-tight">Approximately 2 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM ACTION BAR */}
      {selectedBusiness && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl z-30 animate-in slide-in-from-bottom duration-300">
          {/* Selected business metadata summary */}
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${selectedBusiness.color}`}>
              {selectedBusiness.initials}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800 text-xs">{selectedBusiness.name}</span>
                <span className="inline-flex items-center gap-0.5 text-[9px] bg-blue-50 text-blue-600 font-semibold px-1.5 py-0.5 rounded-full border border-blue-100/50">
                  <Star className="w-2.5 h-2.5 fill-blue-500 text-blue-500" /> {selectedBusiness.rating}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block max-w-md truncate">{selectedBusiness.address}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={handleReset}
              variant="outline"
              className="h-10 text-xs px-5 w-1/2 sm:w-auto rounded-xl cursor-pointer"
            >
              Search Again
            </Button>
            <Button
              onClick={handleConfirmVerification}
              className="h-10 text-xs px-6 bg-blue-600 hover:bg-blue-700 text-white w-1/2 sm:w-auto rounded-xl flex items-center justify-center gap-1 cursor-pointer font-bold"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailsBusiness && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${detailsBusiness.color}`}>
                  {detailsBusiness.initials}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm leading-none mb-1">{detailsBusiness.name}</h3>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{detailsBusiness.category}</span>
                </div>
              </div>
              <button
                onClick={() => setDetailsBusiness(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Address */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location Address</span>
                <p className="text-xs text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {detailsBusiness.address}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Distance & ZIP */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Distance</span>
                  <p className="text-xs text-slate-700 font-semibold">{detailsBusiness.distance} from ZIP {detailsBusiness.zipCode}</p>
                </div>

                {/* Rating summary */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Google rating</span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= Math.floor(detailsBusiness.rating) 
                              ? "fill-amber-400" 
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700">{detailsBusiness.rating} ({detailsBusiness.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 pt-2 border-t border-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Information</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-600">{detailsBusiness.phone || "No phone number available"}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    {detailsBusiness.website ? (
                      <a
                        href={detailsBusiness.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-0.5"
                      >
                        Visit website <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">No website available</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDetailsBusiness(null)}
                className="h-10 text-xs px-4 rounded-xl cursor-pointer"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setSelectedBusiness(detailsBusiness);
                  setDetailsBusiness(null);
                }}
                className="h-10 text-xs px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer font-bold"
              >
                Select Business
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS CONFIRMATION MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-800">
              Ownership Verified!
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-2 mb-6">
              You've successfully verified your ownership of <strong className="text-slate-700 font-semibold">{selectedBusiness?.name}</strong>. We are importing Google Business Profile metrics and kicking off background AI scans.
            </p>
            
            <div className="space-y-2">
              <Button
                onClick={() => {
                  setShowSuccessModal(false);
                  handleReset();
                }}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
