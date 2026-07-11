"use client";

import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { AppProvider, useAppStore } from "../../store/app-context";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const {
    isSidebarCollapsed,
    showAnalyzeModal,
    setShowAnalyzeModal,
    setSelectedBusiness,
  } = useAppStore();

  const [newBusinessName, setNewBusinessName] = useState("");
  const [newBusinessUrl, setNewBusinessUrl] = useState("");

  return (
    <div className="min-h-screen bg-[#f8fafd] text-slate-800 font-sans flex overflow-x-hidden">
      {/* Sidebar Layout */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? "pl-16" : "pl-64"
        }`}
      >
        {/* Topbar Layout */}
        <Topbar />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-6 space-y-6">
          {children}
        </main>
      </div>

      {/* Reusable Production Modal: Analyze New Business */}
      {showAnalyzeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Analyze New Business</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Kickoff background scans and monitor competitive indexes.</p>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newBusinessName) return;
                setSelectedBusiness(newBusinessName);
                setShowAnalyzeModal(false);
                setNewBusinessName("");
                setNewBusinessUrl("");
              }}
              className="p-5 space-y-4"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Business Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Downtown Coffee Co."
                  value={newBusinessName}
                  onChange={(e) => setNewBusinessName(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Website URL (Optional)</label>
                <input
                  type="url"
                  placeholder="e.g. https://downtowncoffee.com"
                  value={newBusinessUrl}
                  onChange={(e) => setNewBusinessUrl(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAnalyzeModal(false)}
                  className="px-4 py-2 border border-slate-100 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Start Scan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </AppProvider>
  );
}
