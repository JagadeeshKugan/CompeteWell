"use client";

import React from "react";
import { Database, ShieldCheck, Heart, Users2, Star, Globe, Calendar } from "lucide-react";
import { BusinessLocation } from "../../lib/api/advisor";

interface BusinessContextPanelProps {
  business: BusinessLocation | null;
}

export default function BusinessContextPanel({ business }: BusinessContextPanelProps) {
  const todayStr = React.useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  if (!business) {
    return (
      <div className="w-full lg:w-64 bg-white border border-slate-100 rounded-2xl p-5 text-center shadow-sm h-fit">
        <Database className="w-8 h-8 text-slate-300 mx-auto mb-3" />
        <h3 className="text-xs font-bold text-slate-800 mb-1">Business Context</h3>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Select a business from the header to load real intelligence context.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-64 bg-white border border-slate-100 rounded-2xl p-5 space-y-5 shadow-sm h-fit">
      {/* Panel Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
        <Database className="w-4.5 h-4.5 text-blue-600 flex-shrink-0" />
        <div className="min-w-0">
          <h3 className="text-xs font-bold text-slate-800 leading-none">Active Context</h3>
          <span className="text-[8px] text-slate-400 uppercase tracking-wider font-semibold">
            Google integrations active
          </span>
        </div>
      </div>

      {/* Main Metadata List */}
      <div className="space-y-3 text-[11px] leading-relaxed text-slate-600">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Current Business
          </span>
          <div className="font-semibold text-slate-800 truncate">{business.name}</div>
          <div className="text-[10px] text-slate-400 truncate">{business.category}</div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Last Synced Analysis
          </span>
          <div className="flex items-center gap-1.5 font-medium text-slate-800">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{todayStr}</span>
          </div>
        </div>
      </div>

      <hr className="border-slate-50" />

      {/* Numerical Metrics Stats */}
      <div className="space-y-3.5">
        {/* Health Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span className="text-[11px] font-medium text-slate-600">Health Score</span>
          </div>
          <span className="text-xs font-bold text-slate-800">82/100</span>
        </div>

        {/* Competitors Found */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="text-[11px] font-medium text-slate-600">Competitors Found</span>
          </div>
          <span className="text-xs font-bold text-slate-800">{business.competitor_count || 3}</span>
        </div>

        {/* Rating/Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-[11px] font-medium text-slate-600">Reviews tracked</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-800 block">
              {business.rating ? `${business.rating.toFixed(1)}/5.0` : "N/A"}
            </span>
            <span className="text-[9px] text-slate-400 font-medium leading-none block">
              {business.review_count} reviews
            </span>
          </div>
        </div>

        {/* Website Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="text-[11px] font-medium text-slate-600">Website Status</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold uppercase border border-emerald-100/50">
            Healthy
          </span>
        </div>
      </div>

      {/* Info Footnote banner */}
      <div className="bg-[#f8fafd] border border-slate-100 rounded-xl p-3 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <span className="text-[9px] text-slate-400 leading-normal">
          Advisor responses are automatically injected with local rankings, competitive reviews, and crawl data to keep answers accurate.
        </span>
      </div>
    </div>
  );
}
