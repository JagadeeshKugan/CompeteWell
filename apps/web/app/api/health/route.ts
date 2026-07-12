import { NextResponse } from "next/server";
import { APIHealthStatus } from "@competewell/shared";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  let apiStatus: "ok" | "error" = "ok";
  let apiResponse: { services?: Record<string, string> } | null = null;

  // Next.js client-facing or build env fallback
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  try {
    const res = await fetch(`${apiUrl}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      apiResponse = await res.json();
    } else {
      apiStatus = "error";
    }
  } catch {
    apiStatus = "error";
  }

  const healthResponse: APIHealthStatus = {
    status: apiStatus === "ok" ? "ok" : "error",
    environment: process.env.ENVIRONMENT || "development",
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.floor((Date.now() - start) / 1000),
    services: {
      database: apiResponse?.services?.database || "not_implemented",
      redis: apiResponse?.services?.redis || "not_implemented",
      worker: apiResponse?.services?.worker || "not_implemented",
    },
  };

  return NextResponse.json(healthResponse, {
    status: apiStatus === "ok" ? 200 : 503,
  });
}
