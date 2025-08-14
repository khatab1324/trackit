import { ChatMessage } from "../../../domain/entities/chat";
import { ChatRepository } from "../../../domain/repositories/chatRepository";

export class GetChatConversationUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(chatId: string): Promise<ChatMessage[]> {
    try {
      const chatMessages = await this.chatRepository.getChatConversation(chatId);
      return chatMessages;
    } catch (error) {
      console.error("Error in GetChatConversationUseCase:", error);
      throw new Error("Failed to get chat conversation");
    }
  }
}
