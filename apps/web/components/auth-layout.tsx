import React from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footer?: React.ReactNode;
}

export function AuthLayout({ children, title, subtitle, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfe] text-slate-900 selection:bg-blue-100 selection:text-blue-800">
      {/* Top Header Navigation */}
      <header className="px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4.5 w-4.5"
            >
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">CompeteWell</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-[420px] space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header section */}
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="text-sm text-slate-500">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          <div className="bg-white p-1 sm:p-0 rounded-2xl">
            {children}
          </div>

          {/* Footer content */}
          {footer && (
            <div className="text-center text-sm text-slate-500 pt-2 border-t border-slate-100">
              {footer}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
