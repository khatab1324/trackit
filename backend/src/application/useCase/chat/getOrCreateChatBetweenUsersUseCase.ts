import { Chat } from "../../../domain/entities/chat";
import { ChatRepository } from "../../../domain/repositories/chatRepository";

export class GetOrCreateChatBetweenUsersUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(userId1: string, userId2: string): Promise<{ chat: Chat; isNew: boolean }> {
    try {
      const result = await this.chatRepository.getOrCreateChatBetweenUsers(userId1, userId2);
      return result;
    } catch (error) {
      console.error("Error in GetOrCreateChatBetweenUsersUseCase:", error);
      throw new Error("Failed to get or create chat between users");
    }
  }
} 