export type NotificationType =
  | "LIKE"
  | "COMMENT"
  | "FOLLOW_REQUEST"
  | "FOLLOW_ACCEPTED";

export type NotificationItemData = {
  id: string;
  type: NotificationType;
  actor: { user_id: string; username: string; avatar_url?: string };
  memo?: { id: string; content_url?: string };
  comment_text?: string;
  createdAt: string;
  is_read?: boolean;
  request_id?: string;
}; 