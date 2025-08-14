import { GroupChat } from "../../../domain/entities/chat";
import { ChatRepository } from "../../../domain/repositories/chatRepository";

export class GetGroupByIdUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(groupId: string): Promise<GroupChat | null> {
    try {
      const group = await this.chatRepository.getGroupById(groupId);
      return group;
    } catch (error) {
      console.error("Error in GetGroupByIdUseCase:", error);
      throw new Error("Failed to get group by ID");
    }
  }
}
