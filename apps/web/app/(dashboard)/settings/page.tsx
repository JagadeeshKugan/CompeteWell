"use client";

import { Terminal } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Configuration & Settings</h2>
        <p className="text-slate-400 text-xs">Configure environment, core models, and system integrations.</p>
      </div>

      {/* System details */}
      <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-slate-50/50">
        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-slate-500" />
          <span>Developer Environment Variables</span>
        </h4>
        <div className="text-[11px] font-mono text-slate-500 space-y-2">
          <div>ENVIRONMENT = <span className="text-slate-700 font-semibold">{process.env.NODE_ENV || "development"}</span></div>
          <div>NEXT_PUBLIC_API_URL = <span className="text-slate-700 font-semibold">{process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}</span></div>
        </div>
      </div>
    </div>
  );
}
