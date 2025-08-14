import { User } from "./User";

export interface Chat {
  id: string;
  create_at: Date;
  messages: ChatMessage[];
  participants: ChatParticipant[];
}

export interface ChatMessage {
  id: string;
  message: string;
  sender_id: string;
  create_at: Date;
  media_link?: string | null;
  chat_id: string;
  chat?: Chat;
  sender?: User;
}

export interface GroupChat {
  id: string;
  group_name: string;
  img_url?: string | null;
  creator_id: string;
  create_at: Date;
  messages: GroupChatMessage[];
  participants: GroupParticipant[];
}

export interface GroupChatMessage {
  id: string;
  message: string;
  sender_id: string;
  create_at: Date;
  media_link?: string | null;
  group_id: string;
  group?: GroupChat;
  sender?: User;
}

export interface ChatParticipant {
  id: string;
  chat_id: string;
  user_id: string;
  chat?: Chat;
  user?: User;
}

export interface GroupParticipant {
  id: string;
  user_id: string;
  joined_at: Date;
  group_id: string;
  user?: User;
  group?: GroupChat;
}
