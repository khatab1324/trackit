import { ChatRepository } from "../../../domain/repositories/chatRepository";

export class GetImageToMediaUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(chatId: string): Promise<{ media_link: string | null }[]> {
    try {
      const mediaLinks = await this.chatRepository.getImageToMediaInChatInfo(chatId);
      return mediaLinks;
    } catch (error) {
      console.error("Error in GetImageToMediaUseCase:", error);
      throw new Error("Failed to get media from chat");
    }
  }
}
