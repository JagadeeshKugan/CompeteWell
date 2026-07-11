"use client";

import React, { useState } from "react";
import { Search, Bell, Menu, Activity, Database, RefreshCw, X } from "lucide-react";

import { useAppState } from "../../hooks/useAppState";

export default function Topbar() {
  const {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    searchQuery,
    setSearchQuery,
    webHealth,
    apiHealth,
    checkHealthStatus,
  } = useAppState();

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const [showHealthPopover, setShowHealthPopover] = useState(false);

  const isHealthy = webHealth.status === "healthy" && apiHealth.status === "healthy";

  return (
    <header className="sticky top-0 right-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6">
      {/* Search & Collapse Toggle */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search businesses, competitors, reports..."
            className="w-full h-10 pl-10 pr-4 bg-[#f8fafd] border border-slate-100 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Side: Health Checks & Notifications */}
      <div className="flex items-center gap-4">
        {/* System Health Check Button */}
        <div className="relative">
          <button
            onClick={() => setShowHealthPopover(!showHealthPopover)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 active:scale-95 ${
              isHealthy
                ? "bg-emerald-50/50 text-emerald-700 border-emerald-100 hover:bg-emerald-50"
                : "bg-amber-50/50 text-amber-700 border-amber-100 hover:bg-amber-50"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isHealthy ? "bg-emerald-500 animate-pulse" : "bg-amber-500 animate-bounce"
              }`}
            />
            <span className="hidden sm:inline">System Status</span>
          </button>

          {/* Health Details Popover */}
          {showHealthPopover && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-150 rounded-xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <span className="font-semibold text-slate-800 text-sm">System Health Monitor</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={checkHealthStatus}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    title="Refresh status"
                    disabled={webHealth.loading || apiHealth.loading}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${webHealth.loading || apiHealth.loading ? "animate-spin" : ""}`} />
                  </button>
                  <button
                    onClick={() => setShowHealthPopover(false)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Web service health */}
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-semibold text-slate-700">Next.js Web (apps/web)</span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        webHealth.status === "healthy"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {webHealth.status}
                    </span>
                  </div>
                  {webHealth.data && (
                    <div className="text-[10px] text-slate-400 space-y-0.5 font-mono">
                      <div>Env: {webHealth.data.environment}</div>
                      <div>Timestamp: {new Date(webHealth.data.timestamp).toLocaleTimeString()}</div>
                    </div>
                  )}
                  {webHealth.error && (
                    <div className="text-[10px] text-rose-500 font-mono mt-1">{webHealth.error}</div>
                  )}
                </div>

                {/* API service health */}
                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-violet-500" />
                      <span className="text-xs font-semibold text-slate-700">FastAPI API (apps/api)</span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        apiHealth.status === "healthy"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {apiHealth.status}
                    </span>
                  </div>
                  {apiHealth.data && (
                    <div className="text-[10px] text-slate-400 space-y-0.5 font-mono">
                      <div>Version: {apiHealth.data.version}</div>
                      <div>DB Status: {apiHealth.data.services.database}</div>
                      <div>Redis Status: {apiHealth.data.services.redis}</div>
                    </div>
                  )}
                  {apiHealth.error && (
                    <div className="text-[10px] text-rose-500 font-mono mt-1">{apiHealth.error}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white" />
        </button>
      </div>
    </header>
  );
}
