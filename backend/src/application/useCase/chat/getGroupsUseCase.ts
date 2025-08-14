import { GroupChat } from "../../../domain/entities/chat";
import { ChatRepository } from "../../../domain/repositories/chatRepository";

export class GetGroupsUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(userId: string): Promise<GroupChat[]> {
    try {
      const groups = await this.chatRepository.getGroups(userId);
      return groups;
    } catch (error) {
      console.error("Error in GetGroupsUseCase:", error);
      throw new Error("Failed to get groups");
    }
  }
}
