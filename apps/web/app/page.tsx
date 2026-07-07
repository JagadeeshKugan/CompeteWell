"use client";

import { useState, useEffect } from "react";
import { SUPPORTED_MODELS, AIModelConfig } from "../../../packages/shared/src/";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"architecture" | "models" | "health">("architecture");
  const [webHealth, setWebHealth] = useState<{ status: string; data: any; loading: boolean; error: string | null }>({
    status: "unknown",
    data: null,
    loading: false,
    error: null,
  });
  const [apiHealth, setApiHealth] = useState<{ status: string; data: any; loading: boolean; error: string | null }>({
    status: "unknown",
    data: null,
    loading: false,
    error: null,
  });

  const checkHealthStatus = async () => {
    // Check Next.js Web Health
    setWebHealth((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setWebHealth({
        status: res.ok ? "healthy" : "degraded",
        data,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setWebHealth({
        status: "offline",
        data: null,
        loading: false,
        error: err.message || "Failed to reach health endpoint",
      });
    }

    // Check FastAPI Backend Health
    setApiHealth((prev) => ({ ...prev, loading: true, error: null }));
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    try {
      const res = await fetch(`${apiUrl}/health`);
      const data = await res.json();
      setApiHealth({
        status: res.ok ? "healthy" : "degraded",
        data,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setApiHealth({
        status: "offline",
        data: null,
        loading: false,
        error: err.message || "Connection refused (is apps/api running?)",
      });
    }
  };

  useEffect(() => {
    checkHealthStatus();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-900/20 via-violet-900/10 to-transparent pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] left-[5%] w-[400px] h-[400px] bg-indigo-500/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/75 border-b border-slate-900 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-lg text-white shadow-md shadow-indigo-500/20">
              A
            </div>
            <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              AI SaaS Monorepo
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              API Docs
            </a>
            <button
              onClick={checkHealthStatus}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all active:scale-95"
            >
              <span
                className={`w-2 h-2 rounded-full ${webHealth.status === "healthy" && apiHealth.status === "healthy"
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-amber-500"
                  }`}
              />
              System Check
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
            🚀 Production-Ready Monorepo Boilerplate
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-none">
            Clean Architecture <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              for AI Applications
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            A robust foundation integrating **Next.js 15 App Router** and **FastAPI**.
            Engineered with strict TypeScript workspaces, formatting standards, and full Docker compose configuration.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#console"
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-95"
            >
              Inspect Core Services
            </a>
            <a
              href="https://github.com/JagadeeshKugan/CompeteWell"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-sm transition-all active:scale-95"
            >
              View Repository
            </a>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-900 backdrop-blur-sm hover:border-slate-800 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold mb-4">
              N15
            </div>
            <h3 className="font-semibold text-lg text-white mb-2">apps/web (Next.js 15)</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              TypeScript-based frontend with Tailwind CSS, App Router, ESLint, and Prettier integration.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-900 backdrop-blur-sm hover:border-slate-800 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold mb-4">
              ⚡
            </div>
            <h3 className="font-semibold text-lg text-white mb-2">apps/api (FastAPI)</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Python 3.13 backend structured on clean architecture. Configured with Ruff, Black, and mypy.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-900 backdrop-blur-sm hover:border-slate-800 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold mb-4">
              📦
            </div>
            <h3 className="font-semibold text-lg text-white mb-2">packages/shared</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Workspace-shared typescript package containing data models, schemas, and configurations.
            </p>
          </div>
        </section>

        {/* Tab Container Section */}
        <section id="console" className="rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-md overflow-hidden">
          {/* Tabs header */}
          <div className="flex border-b border-slate-900 bg-slate-950/50">
            <button
              onClick={() => setActiveTab("architecture")}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === "architecture" ? "text-white bg-slate-900/40" : "text-slate-400 hover:text-slate-200"
                }`}
            >
              Monorepo Architecture
              {activeTab === "architecture" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("models")}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === "models" ? "text-white bg-slate-900/40" : "text-slate-400 hover:text-slate-200"
                }`}
            >
              Shared Code Inspection (@saas/shared)
              {activeTab === "models" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("health")}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === "health" ? "text-white bg-slate-900/40" : "text-slate-400 hover:text-slate-200"
                }`}
            >
              Live Health Monitor
              {activeTab === "health" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
          </div>

          {/* Tab content */}
          <div className="p-8">
            {/* Tab: Architecture */}
            {activeTab === "architecture" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Clean Core & Boundaries</h3>
                  <p className="text-slate-400 text-sm">
                    This workspace separates visual components from backend logic, connecting them via REST APIs.
                    Infrastructure components (Redis, Worker) are stubbed out and ready to activate in docker configurations.
                  </p>
                </div>

                {/* Architecture Visual Layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center py-6 bg-slate-950/40 rounded-xl border border-slate-900 p-6">
                  {/* Web client */}
                  <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/10 text-center">
                    <h4 className="text-indigo-400 font-semibold text-sm mb-1">Web Client</h4>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-indigo-900/30 text-indigo-300 rounded border border-indigo-500/20">
                      apps/web
                    </span>
                    <p className="text-xs text-slate-500 mt-2">Next.js Web / Tailwind</p>
                  </div>

                  {/* Flow Arrow */}
                  <div className="hidden md:flex flex-col items-center justify-center text-slate-600 font-mono text-xs">
                    <span>API Requests</span>
                    <span>───────▶</span>
                  </div>

                  {/* API Service */}
                  <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-950/10 text-center">
                    <h4 className="text-violet-400 font-semibold text-sm mb-1">API Backend</h4>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-violet-900/30 text-violet-300 rounded border border-violet-500/20">
                      apps/api
                    </span>
                    <p className="text-xs text-slate-500 mt-2">FastAPI / Python 3.13</p>
                  </div>

                  {/* Infra block */}
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/10 border-dashed text-center">
                    <h4 className="text-slate-500 font-semibold text-sm mb-1">Async Processing</h4>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-950 text-slate-600 rounded border border-slate-800">
                      future infra
                    </span>
                    <p className="text-xs text-slate-600 mt-2">Redis + Celery Workers</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800 text-xs font-mono text-slate-400">
                  ⚡ Run development monorepo command: <span className="text-indigo-400">docker-compose up --build</span>
                </div>
              </div>
            )}

            {/* Tab: Models */}
            {activeTab === "models" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Imported Workspace Constants</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    The models displayed below are imported directly from <code className="text-slate-300 bg-slate-950 font-mono px-1 py-0.5 rounded">@saas/shared</code>,
                    demonstrating strict compile-time resource sharing across packages.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SUPPORTED_MODELS.map((model: AIModelConfig) => (
                    <div key={model.id} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold text-sm">{model.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-900 text-slate-400 rounded uppercase">
                          {model.provider}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1">
                        <div>Context: <span className="font-mono text-indigo-400">{model.contextWindow.toLocaleString()} tokens</span></div>
                        <div>Status: <span className="text-emerald-500">Active</span></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs font-mono text-slate-500 bg-slate-950/50 p-4 rounded-lg border border-slate-900">
                  <span className="text-slate-400">// Import statement in app/page.tsx:</span><br />
                  <span className="text-pink-500">import</span> {"{"} SUPPORTED_MODELS, AIModelConfig {"}"} <span className="text-pink-500">from</span> <span className="text-emerald-400">"@saas/shared"</span>;
                </div>
              </div>
            )}

            {/* Tab: Health */}
            {activeTab === "health" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Endpoints Check</h3>
                    <p className="text-slate-400 text-sm">
                      Inspect and query the Next.js API route and FastAPI backend live.
                    </p>
                  </div>
                  <button
                    onClick={checkHealthStatus}
                    disabled={webHealth.loading || apiHealth.loading}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-all active:scale-95 disabled:opacity-50"
                  >
                    {webHealth.loading || apiHealth.loading ? "Checking..." : "Re-Check Status"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Web Health Card */}
                  <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold text-sm text-slate-200">Next.js Endpoint (/api/health)</span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase ${webHealth.status === "healthy"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : webHealth.status === "offline"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : "bg-slate-800 text-slate-400"
                          }`}
                      >
                        {webHealth.status}
                      </span>
                    </div>
                    {webHealth.loading ? (
                      <div className="h-28 flex items-center justify-center text-slate-500 text-xs">Loading...</div>
                    ) : webHealth.error ? (
                      <div className="h-28 text-rose-400 text-xs p-3 bg-rose-950/10 border border-rose-950/20 rounded-lg overflow-auto font-mono">
                        {webHealth.error}
                      </div>
                    ) : webHealth.data ? (
                      <pre className="text-[11px] font-mono text-slate-400 p-3 bg-slate-950 rounded-lg border border-slate-900 overflow-auto max-h-[140px]">
                        {JSON.stringify(webHealth.data, null, 2)}
                      </pre>
                    ) : (
                      <div className="h-28 flex items-center justify-center text-slate-600 text-xs font-mono">No data</div>
                    )}
                  </div>

                  {/* API Health Card */}
                  <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold text-sm text-slate-200">FastAPI Endpoint (/health)</span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase ${apiHealth.status === "healthy"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : apiHealth.status === "offline"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : "bg-slate-800 text-slate-400"
                          }`}
                      >
                        {apiHealth.status}
                      </span>
                    </div>
                    {apiHealth.loading ? (
                      <div className="h-28 flex items-center justify-center text-slate-500 text-xs">Loading...</div>
                    ) : apiHealth.error ? (
                      <div className="h-28 text-rose-400 text-xs p-3 bg-rose-950/10 border border-rose-950/20 rounded-lg overflow-auto font-mono">
                        {apiHealth.error}
                      </div>
                    ) : apiHealth.data ? (
                      <pre className="text-[11px] font-mono text-slate-400 p-3 bg-slate-950 rounded-lg border border-slate-900 overflow-auto max-h-[140px]">
                        {JSON.stringify(apiHealth.data, null, 2)}
                      </pre>
                    ) : (
                      <div className="h-28 flex items-center justify-center text-slate-600 text-xs font-mono">No data</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-8 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} AI SaaS Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <span>Next.js 15</span>
            <span>&bull;</span>
            <span>FastAPI (Python 3.13)</span>
            <span>&bull;</span>
            <span>Docker</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
