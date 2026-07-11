"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  LineChart,
  Users2,
  FileText,
  Sparkles,
  Settings,
  TrendingUp,
} from "lucide-react";
import { useAppState } from "../../hooks/useAppState";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isSidebarCollapsed: isCollapsed } = useAppState();

  // Derive active tab from pathname
  const activeTab = React.useMemo(() => {
    if (pathname.startsWith("/dashboard")) return "dashboard";
    if (pathname.startsWith("/businesses")) return "businesses";
    if (pathname.startsWith("/analysis")) return "analysis";
    if (pathname.startsWith("/competitors")) return "competitors";
    if (pathname.startsWith("/reports")) return "reports";
    if (pathname.startsWith("/ai")) return "ai-assistant";
    if (pathname.startsWith("/settings")) return "settings";
    return "dashboard";
  }, [pathname]);

  const workspaceItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, route: "/dashboard" },
    { id: "businesses", label: "Businesses", icon: Building2, route: "/businesses" },
    { id: "analysis", label: "Analysis", icon: LineChart, route: "/analysis" },
    { id: "competitors", label: "Competitors", icon: Users2, route: "/competitors" },
    { id: "reports", label: "Reports", icon: FileText, route: "/reports" },
  ];

  const toolsItems = [
    { id: "ai-assistant", label: "AI Assistant", icon: Sparkles, route: "/ai" },
    { id: "settings", label: "Settings", icon: Settings, route: "/settings" },
  ];

  const renderNavItems = (items: typeof workspaceItems) => {
    return items.map((item) => {
      const Icon = item.icon;
      const isActive = activeTab === item.id;

      return (
        <button
          key={item.id}
          onClick={() => router.push(item.route)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative cursor-pointer ${
            isActive
              ? "bg-slate-100 text-slate-900 font-medium"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
          }`}
          title={isCollapsed ? item.label : undefined}
        >
          <Icon
            className={`w-4.5 h-4.5 transition-colors ${
              isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
            }`}
          />
          {!isCollapsed && <span className="truncate">{item.label}</span>}
          
          {/* Tooltip for collapsed mode */}
          {isCollapsed && (
            <span className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap shadow-md">
              {item.label}
            </span>
          )}
        </button>
      );
    });
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-100 flex flex-col justify-between transition-all duration-300 z-40 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div>
        <div
          className={`h-16 flex items-center border-b border-slate-100 px-4 gap-3 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-slate-800 text-sm tracking-tight leading-none mb-1">
                CompeteWell
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Market Intelligence
              </span>
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <div className="p-3 space-y-6">
          {/* Workspace Nav Group */}
          <div>
            {!isCollapsed && (
              <h5 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Workspace
              </h5>
            )}
            <nav className="space-y-1">{renderNavItems(workspaceItems)}</nav>
          </div>

          {/* Tools Nav Group */}
          <div>
            {!isCollapsed && (
              <h5 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Tools
              </h5>
            )}
            <nav className="space-y-1">{renderNavItems(toolsItems)}</nav>
          </div>
        </div>
      </div>

      {/* Profile Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div
          className={`flex items-center gap-3 ${
            isCollapsed ? "justify-center" : "px-2 py-1.5"
          } relative group`}
        >
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs flex-shrink-0">
            AM
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-medium text-slate-800 text-xs">Alex Morgan</span>
              <span className="text-[10px] text-slate-400 truncate">alex@company.com</span>
            </div>
          )}
          
          {/* Tooltip for profile in collapsed mode */}
          {isCollapsed && (
            <div className="absolute left-full ml-3 p-2 bg-slate-900 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-md">
              <div className="text-xs font-semibold">Alex Morgan</div>
              <div className="text-[10px] text-slate-400">alex@company.com</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

