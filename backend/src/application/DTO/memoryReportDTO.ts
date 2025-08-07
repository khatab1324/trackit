export interface MemoryReportInput {
  user_id: string;
  memory_id: string;
  reason: string;
  report_category?: string;
}

export interface MemoryReportResponse {
  success: boolean;
  message: string;
}