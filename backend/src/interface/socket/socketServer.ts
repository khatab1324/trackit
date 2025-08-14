import type { FastifyInstance } from "fastify";
import { Server as IOServer } from "socket.io";
import { ChatRepositoryImp } from "../../infrastructure/repositories/chatRepo";
import { AddMessageToChatUseCase } from "../../application/useCase/chat/addMessageToChatUseCase";
import { AddMessageToGroupUseCase } from "../../application/useCase/chat/addMessageToGroupUseCase";
import { EditMessageUseCase } from "../../application/useCase/chat/editMessageUseCase";
import { DeleteMessageUseCase } from "../../application/useCase/chat/deleteMessageUseCase";

export function attachSocket(app: FastifyInstance) {
  const io = new IOServer(app.server, {
    cors: { origin: true, methods: ["GET", "POST"] },
    transports: ["websocket"], // better for mobile
  });


  io.on("connection", (socket) => {
    app.log.info({ sid: socket.id }, "socket connected");
    console.log("socket connected");
    socket.on("join-chat", (roomId: string) => {
      socket.join(roomId);
      app.log.info({ roomId }, "joined chat room");
    });
    
    socket.on("authenticate", (userId: string) => {
      console.log("Authenticating user:", userId);
      (socket as any).userId = userId;
    });
  

    socket.on(
      "room message",
      async (
        payload: { chat_id: string; message: string; media_link?: string | null; isGroup?: boolean },
        ack?: (res: any) => void
      ) => {
        try {
          const { chat_id, message, media_link, isGroup } = payload;
          const sender_id = (socket as any).userId; 
          console.log("sender_id", sender_id);
          if (!sender_id) {
            ack?.({ ok: false, error: "User not authenticated" });
            return;
          }
          console.log("sender_id", sender_id, "chat_id", chat_id, "message", message, "media_link", media_link, "isGroup", isGroup);
          let saved;
          if (isGroup) {
            const chatRepository = new ChatRepositoryImp();
            const addMessageToGroupUseCase = new AddMessageToGroupUseCase(chatRepository);
            saved = await addMessageToGroupUseCase.execute(message, sender_id, chat_id, media_link);
          } else {
            const chatRepository = new ChatRepositoryImp();
            const addMessageToChatUseCase = new AddMessageToChatUseCase(chatRepository);
            saved = await addMessageToChatUseCase.execute(message, sender_id, chat_id, media_link);
          }

          io.to(chat_id).emit("room message", saved);
          ack?.({ ok: true, id: saved.id, ts: saved.create_at });
        } catch (e: any) {
          ack?.({ ok: false, error: e?.message || "Failed to send" });
        }
      }
    );

    socket.on("room editMessage", async ({ chatId, messageId, textMessage }) => {
      try {
        const chatRepository = new ChatRepositoryImp();
        const editMessageUseCase = new EditMessageUseCase(chatRepository);
        const updated = await editMessageUseCase.execute(messageId, textMessage);
        io.to(chatId).emit("room editMessage", updated);
      } catch (error) {
        console.error("Error editing message:", error);
      }
    });

    socket.on("room deleteMessage", async ({ chatId, messageId }) => {
      try {
        const chatRepository = new ChatRepositoryImp();
        const deleteMessageUseCase = new DeleteMessageUseCase(chatRepository);
        const deleted = await deleteMessageUseCase.execute(messageId);
        io.to(chatId).emit("room deleteMessage", { id: messageId, deleted: true, data: deleted });
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    });

    socket.on("disconnect", (reason) => {
      app.log.info({ sid: socket.id, reason }, "socket disconnected");
    });
  });

  (app as any).io = io;
}
