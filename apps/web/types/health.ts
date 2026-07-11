export interface WebHealthData {
  environment: string;
  timestamp: string;
}

export interface ApiHealthData {
  version: string;
  services: {
    database: string;
    redis: string;
    worker: string;
  };
}

export interface HealthState<T> {
  status: string;
  data: T | null;
  loading: boolean;
  error: string | null;
}
