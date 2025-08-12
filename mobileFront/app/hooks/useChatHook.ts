import { useEffect, useRef, useCallback } from "react";
import { connectSocket } from "../services/socket";

export type ChatMessage = {
  id: string;
  chat_id: string;
  sender_id: string;
  message: string;
  media_link?: string | null;
  created_at: string;
  pending?: boolean;
  error?: string;
};

export function useChatSocket({
  baseURL,
  token,
  chatId,
  onIncoming,
}: {
  baseURL: string;
  token?: string;
  chatId: string;
  onIncoming: (m: ChatMessage) => void;
}) {
  const mounted = useRef(false);

  useEffect(() => {
    const s = connectSocket(baseURL, token);

    const handleMessage = (m: ChatMessage) => {
      if (m.chat_id === chatId) onIncoming(m);
    };

    if (!mounted.current) {
      s.emit("join-chat", chatId);
      s.on("room message", handleMessage);
      mounted.current = true;
    }

    return () => {
      if (mounted.current) {
        s.off("room message", handleMessage);
        mounted.current = false;
      }
    };
  }, [baseURL, token, chatId, onIncoming]);
}

export async function sendMessage({
  baseURL,
  token,
  chat_id,
  sender_id,
  message,
  media_link,
}: {
  baseURL: string;
  token?: string;
  chat_id: string;
  sender_id: string;
  message: string;
  media_link?: string | null;
}) {
  const s = connectSocket(baseURL, token);
  return new Promise<{ ok: boolean; id?: string; ts?: string; error?: string }>((resolve) => {
    s.emit("room message", { chat_id, sender_id, message, media_link }, (ack: any) => {
      resolve(ack);
    });
  });
}
