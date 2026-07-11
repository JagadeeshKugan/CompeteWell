import { fetchWebHealth, fetchApiHealth } from "../lib/api/health";
import { WebHealthData, ApiHealthData } from "../types/health";

export const HealthService = {
  async getWebHealth(): Promise<WebHealthData> {
    return fetchWebHealth();
  },

  async getApiHealth(): Promise<ApiHealthData> {
    return fetchApiHealth();
  },
};
