import { ChatMessage } from "../../../domain/entities/chat";
import { ChatRepository } from "../../../domain/repositories/chatRepository";

export class DeleteMessageUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(messageId: string): Promise<ChatMessage> {
    try {
      const deletedMessage = await this.chatRepository.deleteChatMessage(messageId);
      return deletedMessage;
    } catch (error) {
      console.error("Error in DeleteMessageUseCase:", error);
      throw new Error("Failed to delete message");
    }
  }
}
