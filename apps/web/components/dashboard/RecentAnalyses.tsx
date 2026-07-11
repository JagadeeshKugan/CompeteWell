"use client";

import React from "react";

import { AnalysisItem } from "../../types/analysis";

interface RecentAnalysesProps {
  searchQuery: string;
}

const initialAnalyses: AnalysisItem[] = [
  {
    business: "Downtown Coffee Co.",
    analysis: "Full Market Scan",
    status: "Completed",
    when: "2h ago",
  },
  {
    business: "Bella Vista Salon",
    analysis: "Competitor Deep Dive",
    status: "Completed",
    when: "6h ago",
  },
  {
    business: "Green Leaf Dental",
    analysis: "Review Sentiment",
    status: "Running",
    when: "just now",
  },
  {
    business: "Urban Fitness Club",
    analysis: "Local SEO Audit",
    status: "Completed",
    when: "1d ago",
  },
  {
    business: "Riverside Bakery",
    analysis: "Full Market Scan",
    status: "Queued",
    when: "1d ago",
  },
];

export default function RecentAnalyses({ searchQuery }: RecentAnalysesProps) {
  const filteredAnalyses = initialAnalyses.filter(
    (item) =>
      item.business.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.analysis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-100/80 rounded-2xl shadow-sm overflow-hidden flex-1">
      <div className="p-5 border-b border-slate-50 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-sm tracking-tight">Recent Analyses</h3>
        <span className="text-xs text-slate-400 font-medium">Latest AI runs across your businesses</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50 text-[10px] uppercase tracking-wider text-slate-400 font-semibold bg-slate-50/50">
              <th className="py-3 px-6">Business</th>
              <th className="py-3 px-6">Analysis</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6 text-right">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {filteredAnalyses.length > 0 ? (
              filteredAnalyses.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-800">{item.business}</td>
                  <td className="py-4 px-6 text-slate-500">{item.analysis}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        item.status === "Completed"
                          ? "bg-emerald-50 text-emerald-600"
                          : item.status === "Running"
                          ? "bg-blue-50 text-blue-600 animate-pulse"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 text-right font-medium">{item.when}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                  No analyses matched your query
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
