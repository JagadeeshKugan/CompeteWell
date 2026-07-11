"use client";

import { useBusiness } from "../../../hooks/useBusiness";

export default function BusinessesPage() {
  const { businesses } = useBusiness();

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Tracked Businesses</h2>
      <p className="text-slate-500 text-sm mb-6">Manage business profiles and core configurations.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {businesses.map((biz) => (
          <div key={biz} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <h3 className="font-semibold text-slate-800 text-sm mb-1">{biz}</h3>
            <p className="text-[11px] text-slate-400 font-medium">Domain: {biz.toLowerCase().replace(/[\s\.]/g, "")}.com</p>
            <div className="flex gap-2 mt-4">
              <button className="px-2.5 py-1 bg-white border border-slate-100 text-[10px] font-semibold text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer">
                Edit profile
              </button>
              <button className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100/30 text-[10px] font-semibold rounded-lg hover:bg-blue-100/50 cursor-pointer">
                Scan again
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
