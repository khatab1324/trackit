import { GroupChat } from "../../../domain/entities/chat";
import { ChatRepository } from "../../../domain/repositories/chatRepository";

export class CreateGroupUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(
    friendIds: string[],
    groupName: string,
    creatorId: string
  ): Promise<GroupChat> {
    try {
      const group = await this.chatRepository.createGroup(
        friendIds,
        groupName,
        creatorId
      );
      return group;
    } catch (error) {
      console.error("Error in CreateGroupUseCase:", error);
      throw new Error("Failed to create group");
    }
  }
}
