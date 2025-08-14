import { Chat, ChatMessage, GroupChat, GroupChatMessage } from "../entities/chat";

export interface ChatRepository {
  // Chat operations
  getChatById(chatId: string): Promise<Chat | null>;
  getChatConversation(chatId: string): Promise<ChatMessage[]>;
  getOrCreateChatBetweenUsers(userId1: string, userId2: string): Promise<{ chat: Chat; isNew: boolean }>;
  addMessageToChat(message: string, sender_id: string, chat_id: string, media_link?: string): Promise<ChatMessage>;
  editChatMessage(messageId: string, textMessage: string): Promise<ChatMessage>;
  deleteChatMessage(messageId: string): Promise<ChatMessage>;
  
  // Group chat operations
  getGroups(userId: string): Promise<GroupChat[]>;
  getGroupById(groupId: string): Promise<GroupChat | null>;
  getGroupChatConversation(groupId: string): Promise<GroupChatMessage[]>;
  createGroup(friendIds: string[], groupName: string, creatorId: string): Promise<GroupChat>;
  addMessageToGroup(message: string, sender_id: string, group_chat_id: string, media_link?: string): Promise<GroupChatMessage>;
  editGroupMessage(messageId: string, textMessage: string): Promise<GroupChatMessage>;
  deleteGroupMessage(messageId: string): Promise<GroupChatMessage>;
  
  // Media operations
  getImageToMediaInChatInfo(chatId: string): Promise<{ media_link: string | null }[]>;
} 