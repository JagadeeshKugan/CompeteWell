"use client";

import React from "react";
import { Heart, Star, Target, Shield, Search, TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  changeLabel: string;
  iconName: "heart" | "star" | "target" | "shield" | "search" | "growth";
}

const iconsMap = {
  heart: Heart,
  star: Star,
  target: Target,
  shield: Shield,
  search: Search,
  growth: TrendingUp,
};

export default function MetricCard({
  title,
  value,
  change,
  trend,
  changeLabel,
  iconName,
}: MetricCardProps) {
  const IconComponent = iconsMap[iconName] || Target;

  return (
    <div className="bg-white border border-slate-100/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-[156px] relative group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
            {title}
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
            <IconComponent className="w-4.5 h-4.5" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-800 tracking-tight leading-none mb-3">
          {value}
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 text-xs">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold ${
            trend === "up"
              ? "bg-emerald-50 text-emerald-600"
              : trend === "down"
              ? "bg-rose-50 text-rose-600"
              : "bg-slate-50 text-slate-600"
          }`}
        >
          {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"} {change}
        </span>
        <span className="text-slate-400 font-medium truncate">{changeLabel}</span>
      </div>
    </div>
  );
}
