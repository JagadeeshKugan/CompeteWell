export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  when: string;
  type: "scan" | "competitor" | "sentiment" | "report" | "digest";
}
