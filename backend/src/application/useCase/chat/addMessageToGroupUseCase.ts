import { GroupChatMessage } from "../../../domain/entities/chat";
import { ChatRepository } from "../../../domain/repositories/chatRepository";

export class AddMessageToGroupUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(
    message: string,
    sender_id: string,
    group_chat_id: string,
    media_link?: string
  ): Promise<GroupChatMessage> {
    try {
      const groupMessage = await this.chatRepository.addMessageToGroup(
        message,
        sender_id,
        group_chat_id,
        media_link
      );
      return groupMessage;
    } catch (error) {
      console.error("Error in AddMessageToGroupUseCase:", error);
      throw new Error("Failed to add message to group");
    }
  }
}
