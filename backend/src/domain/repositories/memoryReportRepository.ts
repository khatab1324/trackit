import { MemoryReportInput, MemoryReportResponse } from "../../application/DTO/memoryReportDTO";

export interface MemoryReportRepository {
  reportMemory(input: MemoryReportInput): Promise<MemoryReportResponse>;
}