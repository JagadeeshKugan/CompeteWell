export interface AnalysisItem {
  business: string;
  analysis: string;
  status: "Completed" | "Running" | "Queued";
  when: string;
}
