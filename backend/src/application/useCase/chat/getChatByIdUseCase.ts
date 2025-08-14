import { Chat } from "../../../domain/entities/chat";
import { ChatRepository } from "../../../domain/repositories/chatRepository";

export class GetChatByIdUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(chatId: string): Promise<Chat | null> {
    try {
      const chat = await this.chatRepository.getChatById(chatId);
      return chat;
    } catch (error) {
      console.error("Error in GetChatByIdUseCase:", error);
      throw new Error("Failed to get chat by ID");
    }
  }
}
