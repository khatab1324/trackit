import { MemoryReportInput, MemoryReportResponse } from "../../application/DTO/memoryReportDTO";
import { MemoryReportRepository } from "../../domain/repositories/memoryReportRepository";
import { db } from "../db/connection";
import { reportMemories } from "../db/schema/ReportMemorySchema";

export class MemoryReportRepositoryImp implements MemoryReportRepository {
  async reportMemory(input: MemoryReportInput): Promise<MemoryReportResponse> {
    try {
      await db.insert(reportMemories).values({
        reporter_id: input.user_id,
        memory_id: input.memory_id,
        reason: input.reason,
        report_category: input.report_category,
      });
      return {
        success: true,
        message: "Memory reported successfully",
      };
    } catch (error) {
      console.error("Error reporting memory:", error);
      throw new Error("Failed to report memory");
    }
  }
}