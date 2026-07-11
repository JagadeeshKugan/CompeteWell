"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { WebHealthData, ApiHealthData, HealthState } from "../types/health";
import { HealthService } from "../services/health.service";

interface AppContextType {
  selectedBusiness: string;
  setSelectedBusiness: (biz: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showAnalyzeModal: boolean;
  setShowAnalyzeModal: (show: boolean) => void;
  webHealth: HealthState<WebHealthData>;
  apiHealth: HealthState<ApiHealthData>;
  checkHealthStatus: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedBusiness, setSelectedBusiness] = useState("Downtown Coffee Co.");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);

  const [webHealth, setWebHealth] = useState<HealthState<WebHealthData>>({
    status: "unknown",
    data: null,
    loading: false,
    error: null,
  });

  const [apiHealth, setApiHealth] = useState<HealthState<ApiHealthData>>({
    status: "unknown",
    data: null,
    loading: false,
    error: null,
  });

  const checkHealthStatus = async () => {
    // Next.js Web Health Check
    setWebHealth((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await HealthService.getWebHealth();
      setWebHealth({
        status: "healthy",
        data,
        loading: false,
        error: null,
      });
    } catch (err) {
      setWebHealth({
        status: "offline",
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to reach health endpoint",
      });
    }

    // Backend FastAPI Health Check
    setApiHealth((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await HealthService.getApiHealth();
      setApiHealth({
        status: "healthy",
        data,
        loading: false,
        error: null,
      });
    } catch (err) {
      setApiHealth({
        status: "offline",
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : "Connection refused (is apps/api running?)",
      });
    }
  };

  useEffect(() => {
    checkHealthStatus();
  }, []);

  return (
    <AppContext.Provider
      value={{
        selectedBusiness,
        setSelectedBusiness,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        searchQuery,
        setSearchQuery,
        showAnalyzeModal,
        setShowAnalyzeModal,
        webHealth,
        apiHealth,
        checkHealthStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
