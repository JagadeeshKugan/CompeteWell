export interface ReportItem {
  id: string;
  title: string;
  type: "pdf" | "csv";
  size: string;
  date: string;
}
