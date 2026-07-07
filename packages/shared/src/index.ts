// Shared constants and types for AI SaaS Monorepo

export interface APIHealthStatus {
  status: "ok" | "error";
  environment: string;
  timestamp: string;
  uptime_seconds?: number;
  services?: {
    database?: string;
    redis?: string;
    worker?: string;
  };
}

export type AIServiceProvider = "openai" | "google" | "anthropic";

export interface AIModelConfig {
  id: string;
  name: string;
  provider: AIServiceProvider;
  contextWindow: number;
  enabled: boolean;
}

export const SUPPORTED_MODELS: AIModelConfig[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    contextWindow: 128000,
    enabled: true,
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "google",
    contextWindow: 1000000,
    enabled: true,
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    contextWindow: 200000,
    enabled: true,
  },
];

export interface UserSubscription {
  tier: "free" | "pro" | "enterprise";
  status: "active" | "canceled" | "past_due";
  expiresAt: string;
}
