import { FastifyReply, FastifyRequest } from "fastify";
import { ChatRepositoryImp } from "../../../infrastructure/repositories/chatRepo";
import { GetChatConversationUseCase } from "../../../application/useCase/chat/getChatConversationUseCase";
import { GetChatByIdUseCase } from "../../../application/useCase/chat/getChatByIdUseCase";
import { GetOrCreateChatBetweenUsersUseCase } from "../../../application/useCase/chat/getOrCreateChatBetweenUsersUseCase";
import { EditMessageUseCase } from "../../../application/useCase/chat/editMessageUseCase";
import { DeleteMessageUseCase } from "../../../application/useCase/chat/deleteMessageUseCase";
import { GetGroupsUseCase } from "../../../application/useCase/chat/getGroupsUseCase";
import { GetGroupByIdUseCase } from "../../../application/useCase/chat/getGroupByIdUseCase";
import { GetGroupChatConversationUseCase } from "../../../application/useCase/chat/getGroupChatConversationUseCase";
import { CreateGroupUseCase } from "../../../application/useCase/chat/createGroupUseCase";
import { GetImageToMediaUseCase } from "../../../application/useCase/chat/getImageToMediaUseCase";


export const getChatConversationController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { chatId } = request.params as { chatId: string };
    const chatRepository = new ChatRepositoryImp();
    const getChatConversationUseCase = new GetChatConversationUseCase(chatRepository);
    const conversation = await getChatConversationUseCase.execute(chatId);
    
    reply.code(200).send({ message: "Chat conversation retrieved successfully", data: conversation });
  } catch (error) {
    console.error("Error in getChatConversationController:", error);
    reply.code(500).send({ error: "Failed to retrieve chat conversation" });
  }
};

export const getChatByIdController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { chatId } = request.params as { chatId: string };
    const chatRepository = new ChatRepositoryImp();
    const getChatByIdUseCase = new GetChatByIdUseCase(chatRepository);
    const chat = await getChatByIdUseCase.execute(chatId);
    
    if (!chat) {
      return reply.code(404).send({ error: "Chat not found" });
    }
    
    reply.code(200).send({ message: "Chat retrieved successfully", data: chat });
  } catch (error) {
    console.error("Error in getChatByIdController:", error);
    reply.code(500).send({ error: "Failed to retrieve chat" });
  }
};

export const getOrCreateChatBetweenUsersController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userReq = request.user as { id: string };
    const { friendId } = request.params as { friendId: string };
    
    const chatRepository = new ChatRepositoryImp();
    const getOrCreateChatUseCase = new GetOrCreateChatBetweenUsersUseCase(chatRepository);
    const result = await getOrCreateChatUseCase.execute(userReq.id, friendId);

    const conversation = await chatRepository.getChatConversation(result.chat.id);
    
    reply.code(200).send({ 
      message: result.isNew ? "New chat created" : "Existing chat found",
      data: {
        chat: result.chat,
        conversation: conversation,
        isNew: result.isNew
      }
    });
  } catch (error) {
    console.error("Error in getOrCreateChatBetweenUsersController:", error);
    reply.code(500).send({ error: "Failed to get or create chat" });
  }
};



export const editMessageController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { messageId, textMessage } = request.body as {
      messageId: string;
      textMessage: string;
    };
    
    const chatRepository = new ChatRepositoryImp();
    const editMessageUseCase = new EditMessageUseCase(chatRepository);
    const updatedMessage = await editMessageUseCase.execute(messageId, textMessage);
    
    reply.code(200).send({ message: "Message edited successfully", data: updatedMessage });
  } catch (error) {
    console.error("Error in editMessageController:", error);
    reply.code(500).send({ error: "Failed to edit message" });
  }
};

export const deleteMessageController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { messageId } = request.params as { messageId: string };
    const chatRepository = new ChatRepositoryImp();
    const deleteMessageUseCase = new DeleteMessageUseCase(chatRepository);
    const deletedMessage = await deleteMessageUseCase.execute(messageId);
    
    reply.code(200).send({ message: "Message deleted successfully", data: deletedMessage });
  } catch (error) {
    console.error("Error in deleteMessageController:", error);
    reply.code(500).send({ error: "Failed to delete message" });
  }
};

// Group Chat Controllers
export const getGroupsController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userReq = request.user as { id: string };
    const chatRepository = new ChatRepositoryImp();
    const getGroupsUseCase = new GetGroupsUseCase(chatRepository);
    const groups = await getGroupsUseCase.execute(userReq.id);
    
    reply.code(200).send({ message: "Groups retrieved successfully", data: groups });
  } catch (error) {
    console.error("Error in getGroupsController:", error);
    reply.code(500).send({ error: "Failed to retrieve groups" });
  }
};

export const getGroupByIdController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { groupId } = request.params as { groupId: string };
    const chatRepository = new ChatRepositoryImp();
    const getGroupByIdUseCase = new GetGroupByIdUseCase(chatRepository);
    const group = await getGroupByIdUseCase.execute(groupId);
    
    if (!group) {
      return reply.code(404).send({ error: "Group not found" });
    }
    
    reply.code(200).send({ message: "Group retrieved successfully", data: group });
  } catch (error) {
    console.error("Error in getGroupByIdController:", error);
    reply.code(500).send({ error: "Failed to retrieve group" });
  }
};

export const getGroupChatConversationController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { groupId } = request.params as { groupId: string };
    const chatRepository = new ChatRepositoryImp();
    const getGroupChatConversationUseCase = new GetGroupChatConversationUseCase(chatRepository);
    const conversation = await getGroupChatConversationUseCase.execute(groupId);
    
    reply.code(200).send({ message: "Group chat conversation retrieved successfully", data: conversation });
  } catch (error) {
    console.error("Error in getGroupChatConversationController:", error);
    reply.code(500).send({ error: "Failed to retrieve group chat conversation" });
  }
};

export const createGroupController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userReq = request.user as { id: string };
    const { friendIds, groupName } = request.body as {
      friendIds: string[];
      groupName: string;
    };
    
    const chatRepository = new ChatRepositoryImp();
    const createGroupUseCase = new CreateGroupUseCase(chatRepository);
    const group = await createGroupUseCase.execute(friendIds, groupName, userReq.id);
    
    reply.code(201).send({ message: "Group created successfully", data: group });
  } catch (error) {
    console.error("Error in createGroupController:", error);
    reply.code(500).send({ error: "Failed to create group" });
  }
};



export const getImageToMediaController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { chatId } = request.params as { chatId: string };
    const chatRepository = new ChatRepositoryImp();
    const getImageToMediaUseCase = new GetImageToMediaUseCase(chatRepository);
    const mediaLinks = await getImageToMediaUseCase.execute(chatId);
    
    reply.code(200).send({ message: "Media links retrieved successfully", data: mediaLinks });
  } catch (error) {
    console.error("Error in getImageToMediaController:", error);
    reply.code(500).send({ error: "Failed to retrieve media links" });
  }
}; 