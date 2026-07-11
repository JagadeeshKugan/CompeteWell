"use client";

import React from "react";
import { FileText, FileSpreadsheet, ArrowUpRight } from "lucide-react";
import { ReportItem } from "../../types/report";

const reports: ReportItem[] = [
  {
    id: "rep-1",
    title: "Q3 Competitor Landscape",
    type: "pdf",
    size: "2.1 MB",
    date: "Aug 12",
  },
  {
    id: "rep-2",
    title: "Review Sentiment — August",
    type: "csv",
    size: "184 KB",
    date: "Aug 09",
  },
  {
    id: "rep-3",
    title: "Local SEO Audit — Downtown Coffee",
    type: "pdf",
    size: "3.4 MB",
    date: "Aug 05",
  },
];

export default function RecentReports() {
  return (
    <div className="bg-white border border-slate-100/80 rounded-2xl shadow-sm overflow-hidden w-full md:w-[360px] flex flex-col h-[280px]">
      <div className="p-5 border-b border-slate-50 flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="font-bold text-slate-800 text-sm tracking-tight mb-0.5">
            Recent Reports
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">
            Exports ready to share
          </span>
        </div>
        <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer">
          View all
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-3.5">
        {reports.map((report) => (
          <div key={report.id} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8.5 h-8.5 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors flex-shrink-0">
                {report.type === "pdf" ? (
                  <FileText className="w-4 h-4" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-slate-700 truncate group-hover:text-blue-600 transition-colors">
                  {report.title}
                </h4>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  <span className="uppercase">{report.type}</span> &middot; {report.size} &middot; {report.date}
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
