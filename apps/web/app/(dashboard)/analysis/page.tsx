"use client";

import { SUPPORTED_MODELS } from "@competewell/shared";

export default function AnalysisPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">AI Model & Workspace Analysis</h2>
        <p className="text-slate-500 text-sm mb-6">Inspect model configurations loaded from the shared workspace package.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SUPPORTED_MODELS.map((model) => (
            <div key={model.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-800 font-semibold text-sm">{model.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase font-bold">
                  {model.provider}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 space-y-1">
                <div>Context Window: <span className="font-semibold text-slate-700">{model.contextWindow.toLocaleString()} tokens</span></div>
                <div>Status: <span className="text-emerald-600 font-semibold">Active</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
