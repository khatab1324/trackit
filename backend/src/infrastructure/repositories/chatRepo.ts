import { ChatRepository } from "../../domain/repositories/chatRepository";
import { Chat, ChatMessage, GroupChat, GroupChatMessage } from "../../domain/entities/chat";
import { prisma } from "../db/prisma";
import { db } from "../db/connection";
import { users } from "../db/schema/userSchema";
import { eq, inArray } from "drizzle-orm";

export class ChatRepositoryImp implements ChatRepository {

  async getChatById(chatId: string): Promise<Chat | null> {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        participants: true,
      },
    });

    if (!chat) return null;

    return chat as any; // TODO: Fix type mapping
  }

  async getOrCreateChatBetweenUsers(userId1: string, userId2: string): Promise<{ chat: Chat; isNew: boolean }> {
    const existingChat = await prisma.chat.findFirst({
      where: {
        participants: {
          every: {
            user_id: {
              in: [userId1, userId2]
            }
          }
        }
      },
      include: {
        participants: true,
      }
    });

    if (existingChat) {
      return { chat: existingChat as any, isNew: false };
    }

    // If no chat exists, create a new one
    const newChat = await prisma.chat.create({
      data: {},
      include: {
        participants: true,
      }
    });

    // Add both users as participants
    await prisma.chatParticipant.createMany({
      data: [
        { chat_id: newChat.id, user_id: userId1 },
        { chat_id: newChat.id, user_id: userId2 }
      ]
    });

    // Fetch the created chat with participants
    const createdChat = await prisma.chat.findUnique({
      where: { id: newChat.id },
      include: {
        participants: true,
      }
    });

    return { chat: createdChat as any, isNew: true };
  }

  async getChatConversation(chatId: string): Promise<ChatMessage[]> {
    const chatMessages = await prisma.chatMessage.findMany({
      where: { chat_id: chatId },
    });

    return chatMessages as any; // TODO: Fix type mapping
  }

  async addMessageToChat(
    message: string,
    sender_id: string,
    chat_id: string,
    media_link?: string
  ): Promise<ChatMessage> {
    try {
      const addMessage = await prisma.chatMessage.create({
        data: { message, sender_id, chat_id, media_link },
      });
      return addMessage as any; // TODO: Fix type mapping
    } catch (error) {
      console.log(error);
      throw new Error("Failed to add message to chat");
    }
  }

  async editChatMessage(messageId: string, textMessage: string): Promise<ChatMessage> {
    const updateMessage = await prisma.chatMessage.update({
      where: { id: messageId },
      data: { message: textMessage },
    });
    return updateMessage as any; // TODO: Fix type mapping
  }

  async deleteChatMessage(messageId: string): Promise<ChatMessage> {
    const deleteMessage = await prisma.chatMessage.delete({
      where: { id: messageId },
    });
    return deleteMessage as any; // TODO: Fix type mapping
  }

  async getGroups(userId: string): Promise<GroupChat[]> {
    const groupParticipantIds = await prisma.groupParticipant.findMany({
      where: { user_id: userId },
      select: { group_id: true },
    });

    const groupIds = groupParticipantIds.map(
      (participant) => participant.group_id
    );

    const groupChats = await prisma.groupChat.findMany({
      where: {
        id: { in: groupIds },
      },
      include: {
        participants: true,
      },
    });

    // Get all user IDs from group participants
    const allUserIds = groupChats.flatMap(groupChat => 
      groupChat.participants.map(p => p.user_id)
    );

    // Get user details from Drizzle database
    const userDetails = await db
      .select({
        id: users.id,
        username: users.username,
        profile_image: users.profile_image,
      })
      .from(users)
      .where(inArray(users.id, allUserIds));

    const userMap = new Map(userDetails.map(user => [user.id, user]));

    const result = groupChats.map((groupChat) => {
      const friends = groupChat.participants.map((participant) => {
        const user = userMap.get(participant.user_id);
        return {
          friendId: participant.user_id,
          friendName: user?.username || `User ${participant.user_id}`,
          friendImage: user?.profile_image || null,
        };
      });

      return {
        role: "GROUP",
        chatId: groupChat.id,
        chatName: groupChat.group_name,
        friends: friends,
        chatImage: groupChat.img_url,
      };
    });

    return result as any; // TODO: Fix type mapping
  }

  async getGroupById(groupId: string): Promise<GroupChat | null> {
    const chat = await prisma.groupChat.findUnique({
      where: { id: groupId },
      include: {
        participants: true,
      },
    });

    if (!chat) return null;

    return chat as any; // TODO: Fix type mapping
  }

  async getGroupChatConversation(groupId: string): Promise<GroupChatMessage[]> {
    const chatMessages = await prisma.groupChatMessage.findMany({
      where: { group_id: groupId },
    });

    return chatMessages.map((chatMessage) => ({
      id: chatMessage.id,
      message: chatMessage.message,
      sender_id: chatMessage.sender_id,
      create_at: chatMessage.create_at,
      media_link: chatMessage.media_link,
      chat_id: chatMessage.group_id,
    })) as any; // TODO: Fix type mapping
  }

  async createGroup(
    friendIds: string[],
    groupName: string,
    creatorId: string
  ): Promise<GroupChat> {
    try {
      const createGroupInTheDatabase = await prisma.groupChat.create({
        data: {
          group_name: groupName,
          creator_id: creatorId,
        },
      });

      // Add participants to the group
      for (const friendId of friendIds) {
        // Check if user exists in Drizzle database
        const userExists = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.id, friendId))
          .limit(1);

        if (userExists.length > 0) {
          await prisma.groupParticipant.create({
            data: {
              user_id: friendId,
              group_id: createGroupInTheDatabase.id,
            },
          });
        }
      }

      return createGroupInTheDatabase as any; // TODO: Fix type mapping
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create group");
    }
  }

  async addMessageToGroup(
    message: string,
    sender_id: string,
    group_chat_id: string,
    media_link?: string
  ): Promise<GroupChatMessage> {
    try {
      const addMessage = await prisma.groupChatMessage.create({
        data: { message, sender_id, group_id: group_chat_id, media_link },
      });
      return addMessage as any; // TODO: Fix type mapping
    } catch (error) {
      console.log(error);
      throw new Error("Failed to add message to group");
    }
  }

  async editGroupMessage(messageId: string, textMessage: string): Promise<GroupChatMessage> {
    const updateMessage = await prisma.groupChatMessage.update({
      where: { id: messageId },
      data: { message: textMessage },
    });
    return updateMessage as any; // TODO: Fix type mapping
  }

  async deleteGroupMessage(messageId: string): Promise<GroupChatMessage> {
    const deleteMessage = await prisma.groupChatMessage.delete({
      where: { id: messageId },
    });
    return deleteMessage as any; // TODO: Fix type mapping
  }

  async getImageToMediaInChatInfo(chatId: string): Promise<{ media_link: string | null }[]> {
    const mediaLink = await prisma.chatMessage.findMany({
      where: {
        chat_id: chatId,
        media_link: { not: null },
      },
      select: { media_link: true },
    });

    return mediaLink;
  }
} 