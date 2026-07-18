"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface GoogleBusinessResult {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  address: string;
  verified: boolean;
  website: string;
  phone: string;
}

export interface OnboardingState {
  currentStep: number;
  maxCompletedStep: number;
  organization: {
    name: string;
  };
  businessInfo: {
    name: string;
    category: string;
    zipCode: string;
    country: string;
    website: string;
    phone: string;
  };
  selectedBusiness: GoogleBusinessResult | null;
  analysisPreferences: {
    radius: string;          // "3 km", "5 km", "10 km"
    competitorCount: string;  // "5", "10", "20"
    depth: string;            // "Quick", "Standard", "Deep"
  };
}

const DEFAULT_STATE: OnboardingState = {
  currentStep: 1,
  maxCompletedStep: 0,
  organization: {
    name: "",
  },
  businessInfo: {
    name: "",
    category: "",
    zipCode: "",
    country: "US",
    website: "",
    phone: "",
  },
  selectedBusiness: null,
  analysisPreferences: {
    radius: "5 km",
    competitorCount: "10",
    depth: "Standard",
  },
};

const LOCAL_STORAGE_KEY = "competewell_onboarding_state_v1";

interface OnboardingContextType {
  state: OnboardingState;
  setStep: (step: number) => void;
  updateOrganization: (org: Partial<OnboardingState["organization"]>) => void;
  updateBusinessInfo: (info: Partial<OnboardingState["businessInfo"]>) => void;
  updateSelectedBusiness: (biz: GoogleBusinessResult | null) => void;
  updateAnalysisPreferences: (pref: Partial<OnboardingState["analysisPreferences"]>) => void;
  completeStep: (step: number) => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as OnboardingState;
          
          // Ensure validation limits are safe
          setState({
            ...DEFAULT_STATE,
            ...parsed,
            // Fallback defaults for deep objects
            organization: { ...DEFAULT_STATE.organization, ...parsed.organization },
            businessInfo: { ...DEFAULT_STATE.businessInfo, ...parsed.businessInfo },
            analysisPreferences: { ...DEFAULT_STATE.analysisPreferences, ...parsed.analysisPreferences },
          });
        }
      } catch (err) {
        console.error("Failed to load onboarding state from localStorage", err);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      } catch (err) {
        console.error("Failed to save onboarding state to localStorage", err);
      }
    }
  }, [state, isLoaded]);

  const setStep = (step: number) => {
    // Only allow navigating to step 1, or steps up to maxCompletedStep + 1
    if (step === 1 || step <= state.maxCompletedStep + 1) {
      setState((prev) => ({ ...prev, currentStep: step }));
    }
  };

  const updateOrganization = (org: Partial<OnboardingState["organization"]>) => {
    setState((prev) => ({
      ...prev,
      organization: { ...prev.organization, ...org },
    }));
  };

  const updateBusinessInfo = (info: Partial<OnboardingState["businessInfo"]>) => {
    setState((prev) => ({
      ...prev,
      businessInfo: { ...prev.businessInfo, ...info },
    }));
  };

  const updateSelectedBusiness = (biz: GoogleBusinessResult | null) => {
    setState((prev) => ({
      ...prev,
      selectedBusiness: biz,
    }));
  };

  const updateAnalysisPreferences = (pref: Partial<OnboardingState["analysisPreferences"]>) => {
    setState((prev) => ({
      ...prev,
      analysisPreferences: { ...prev.analysisPreferences, ...pref },
    }));
  };

  const completeStep = (step: number) => {
    setState((prev) => {
      const nextMax = Math.max(prev.maxCompletedStep, step);
      const nextStep = Math.min(step + 1, 7);
      return {
        ...prev,
        maxCompletedStep: nextMax,
        currentStep: nextStep,
      };
    });
  };

  const resetOnboarding = () => {
    setState(DEFAULT_STATE);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (err) {
        console.error("Failed to remove onboarding state", err);
      }
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        state,
        setStep,
        updateOrganization,
        updateBusinessInfo,
        updateSelectedBusiness,
        updateAnalysisPreferences,
        completeStep,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
