import { ChatMessage } from "../../../domain/entities/chat";
import { ChatRepository } from "../../../domain/repositories/chatRepository";

export class EditMessageUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(messageId: string, textMessage: string): Promise<ChatMessage> {
    try {
      const updatedMessage = await this.chatRepository.editChatMessage(
        messageId,
        textMessage
      );
      return updatedMessage;
    } catch (error) {
      console.error("Error in EditMessageUseCase:", error);
      throw new Error("Failed to edit message");
    }
  }
}
