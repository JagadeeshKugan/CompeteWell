"use client";

import { useState } from "react";
import { Plus, ChevronDown, Check } from "lucide-react";
import MetricCard from "../../../components/dashboard/MetricCard";
import RecentAnalyses from "../../../components/dashboard/RecentAnalyses";
import ReviewVolumeChart from "../../../components/dashboard/ReviewVolumeChart";
import BusinessActivity from "../../../components/dashboard/BusinessActivity";
import RecentReports from "../../../components/reports/RecentReports";
import { useBusiness } from "../../../hooks/useBusiness";
import { useAppState } from "../../../hooks/useAppState";

export default function DashboardPage() {
  const { selectedBusiness, setSelectedBusiness, businesses, setShowAnalyzeModal } = useBusiness();
  const { searchQuery } = useAppState();
  const [showBusinessDropdown, setShowBusinessDropdown] = useState(false);

  return (
    <>
      {/* Dashboard Content Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
            Welcome back, Alex
          </span>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mt-0.5">
            Dashboard
          </h1>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Workspace switcher dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowBusinessDropdown(!showBusinessDropdown)}
              className="h-10 px-4 bg-white border border-slate-100/80 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            >
              <span>{selectedBusiness}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {showBusinessDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-lg p-1.5 z-40">
                {businesses.map((biz) => (
                  <button
                    key={biz}
                    onClick={() => {
                      setSelectedBusiness(biz);
                      setShowBusinessDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-left cursor-pointer"
                  >
                    <span>{biz}</span>
                    {selectedBusiness === biz && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add business modal triggers */}
          <button
            onClick={() => setShowAnalyzeModal(true)}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-sm shadow-blue-500/10 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Analyze Business</span>
          </button>
        </div>
      </div>

      {/* 6 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Business Health Score"
          value="82/100"
          change="+4.2%"
          trend="up"
          changeLabel="vs. last month"
          iconName="heart"
        />
        <MetricCard
          title="Opportunity Score"
          value="76/100"
          change="+8.1%"
          trend="up"
          changeLabel="12 new signals"
          iconName="target"
        />
        <MetricCard
          title="Competition Level"
          value="High"
          change="3 new rivals"
          trend="neutral"
          changeLabel="within 5 mi radius"
          iconName="shield"
        />
        <MetricCard
          title="Review Health"
          value="4.6/5.0"
          change="+0.2"
          trend="up"
          changeLabel="348 reviews tracked"
          iconName="star"
        />
        <MetricCard
          title="Local SEO Score"
          value="68/100"
          change="-1.4%"
          trend="down"
          changeLabel="citations & keywords"
          iconName="search"
          />
        <MetricCard
          title="Monthly Growth"
          value="12.4%"
          change="+2.1 pts"
          trend="up"
          changeLabel="MoM revenue proxy"
          iconName="growth"
        />
      </div>

      {/* Charts, Tables, and Lists layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Recent analyses and chart */}
        <div className="xl:col-span-2 space-y-6">
          <RecentAnalyses searchQuery={searchQuery} />
          <ReviewVolumeChart />
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-6">
          <BusinessActivity />
          <RecentReports />
        </div>
      </div>
    </>
  );
}
