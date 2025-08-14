import { ChatMessage } from "../../../domain/entities/chat";
import { ChatRepository } from "../../../domain/repositories/chatRepository";

export class AddMessageToChatUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(
    message: string,
    sender_id: string,
    chat_id: string,
    media_link?: string
  ): Promise<ChatMessage> {
    try {
      const chatMessage = await this.chatRepository.addMessageToChat(
        message,
        sender_id,
        chat_id,
        media_link
      );
      return chatMessage;
    } catch (error) {
      console.error("Error in AddMessageToChatUseCase:", error);
      throw new Error("Failed to add message to chat");
    }
  }
}
