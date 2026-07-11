"use client";

import React from "react";
import { Zap, Radar, MessageSquare, Download, Activity } from "lucide-react";

import { ActivityItem } from "../../types/business";

const activityItems: ActivityItem[] = [
  {
    id: "act-1",
    title: "AI market scan finished",
    detail: "Downtown Coffee Co. - 24 signals",
    when: "2h ago",
    type: "scan",
  },
  {
    id: "act-2",
    title: "New competitor detected",
    detail: "Roast & Co. opened at 214 Main St.",
    when: "5h ago",
    type: "competitor",
  },
  {
    id: "act-3",
    title: "Review sentiment shift",
    detail: "Bella Vista Salon +6% positive week ov...",
    when: "9h ago",
    type: "sentiment",
  },
  {
    id: "act-4",
    title: "Report exported",
    detail: "Q3 Local SEO — PDF, 12 pages",
    when: "1d ago",
    type: "report",
  },
  {
    id: "act-5",
    title: "Weekly digest generated",
    detail: "3 businesses · 7 recommendations",
    when: "2d ago",
    type: "digest",
  },
];

const iconsMap = {
  scan: Zap,
  competitor: Radar,
  sentiment: MessageSquare,
  report: Download,
  digest: Activity,
};

export default function BusinessActivity() {
  return (
    <div className="bg-white border border-slate-100/80 rounded-2xl shadow-sm overflow-hidden w-full md:w-[360px] flex flex-col h-full">
      <div className="p-5 border-b border-slate-50 flex flex-col">
        <h3 className="font-bold text-slate-800 text-sm tracking-tight mb-0.5">
          Business Activity
        </h3>
        <span className="text-[11px] text-slate-400 font-medium">
          Recent events across your workspace
        </span>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        {activityItems.map((item) => {
          const Icon = iconsMap[item.type] || Activity;
          return (
            <div key={item.id} className="flex gap-3 items-start group">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 flex-shrink-0 transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-slate-700 truncate group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap font-medium">
                    {item.when}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium truncate">
                  {item.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
