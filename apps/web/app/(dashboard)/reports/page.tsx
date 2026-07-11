"use client";

import RecentReports from "../../../components/reports/RecentReports";

export default function ReportsPage() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Workspace Reports</h2>
      <p className="text-slate-500 text-sm mb-4">Download, schedule, and view compiled intelligence reports.</p>
      <RecentReports />
    </div>
  );
}
