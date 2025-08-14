import { GroupChatMessage } from "../../../domain/entities/chat";
import { ChatRepository } from "../../../domain/repositories/chatRepository";

export class GetGroupChatConversationUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(groupId: string): Promise<GroupChatMessage[]> {
    try {
      const groupMessages = await this.chatRepository.getGroupChatConversation(groupId);
      return groupMessages;
    } catch (error) {
      console.error("Error in GetGroupChatConversationUseCase:", error);
      throw new Error("Failed to get group chat conversation");
    }
  }
}
