import { MemoryReportInput } from "../../DTO/memoryReportDTO";
import { MemoryReportRepository } from "../../../domain/repositories/memoryReportRepository";

export class MemoryReportUseCase {
  constructor(private memoryReportRepository: MemoryReportRepository) {}

  async execute(input: MemoryReportInput) {
    return this.memoryReportRepository.reportMemory(input);
  }
}