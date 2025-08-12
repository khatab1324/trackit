import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
// import {
//   addMessageToChat,
//   addMessageToGroup,
//   deleteChatMessageFromDatabase,
//   deleteGroupMessageFromDatabase,
//   edit1GroupMessageFromDatabase,
//   editChatMessageFromDatabase,
// } from "./lib/action/Message";
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = express();
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.on("connection", async (socket) => {
    let ids: string;

    console.log("New client connected");
    socket.emit("welcome", { d: "Welcome to the server!" });

    socket.on("join-chat", (id: string) => {
      console.log("id:==================", id);
      socket.join(id);
    });

    socket.on(
      "room message",
      async ({ chat_id, sender_id, message, media_link }) => {
        try {
          console.log(chat_id, "user id", sender_id);
          // const addmessaeg = await addMessageToChat(
          //   message,
          //   sender_id,
          //   chat_id,
          //   media_link
          // );
          // console.log("addmessaeg", addmessaeg);
          
          // Mock response for testing without database
          const mockMessage = {
            id: Date.now().toString(),
            message,
            sender_id,
            chat_id,
            media_link,
            timestamp: new Date().toISOString()
          };

          io.to(chat_id).emit("room message", mockMessage);
        } catch (error) {
          io.to(chat_id).emit("room message", { error });
          console.error("Error handling room message:", error);
        }
      }
    );
    socket.on(
      "group message",
      async ({ group_chat_id, sender_id, message, media_link }) => {
        try {
          console.log(group_chat_id, "user id", sender_id);
          console.log("helooooooooooooo in groupppppppp");
          // const addmessage = await addMessageToGroup(
          //   message,
          //   sender_id,
          //   group_chat_id,
          //   media_link
          // );
          // console.log("====================================");
          // console.log("addmessage", addmessage);
          // console.log("====================================");
          
          // Mock response for testing without database
          const mockMessage = {
            id: Date.now().toString(),
            message,
            sender_id,
            group_chat_id,
            media_link,
            timestamp: new Date().toISOString()
          };
          
          io.to(group_chat_id).emit("room message", mockMessage);
        } catch (error) {
          io.to(group_chat_id).emit("room message", { error });
          console.error("Error handling room message:", error);
        }
      }
    );
    socket.on("room deleteMessage", async ({ chatId, messageId }) => {
      try {
        if (chatId && messageId) {
          // const deleteMessage = await deleteChatMessageFromDatabase(messageId);
          // io.to(chatId).emit("room deleteMessage", deleteMessage);
          
          // Mock response for testing without database
          const mockDeleteResponse = {
            id: messageId,
            deleted: true,
            timestamp: new Date().toISOString()
          };
          io.to(chatId).emit("room deleteMessage", mockDeleteResponse);
        } else {
          io.to(chatId).emit("room message", {
            error: "chat id or message id is null",
          });
          console.error(
            "Error handling room message:",
            "group id or message id is null"
          );
        }
      } catch (error) {
        io.to(chatId).emit("room message", { error });
        console.error("Error handling room message:", error);
      }
    });
    socket.on("group deleteMessage", async ({ groupChatId, messageId }) => {
      try {
        if (groupChatId && messageId) {
          // const deleteMessage = await deleteGroupMessageFromDatabase(messageId);
          // io.to(groupChatId).emit("room deleteMessage", deleteMessage);
          
          // Mock response for testing without database
          const mockDeleteResponse = {
            id: messageId,
            deleted: true,
            timestamp: new Date().toISOString()
          };
          io.to(groupChatId).emit("room deleteMessage", mockDeleteResponse);
        } else {
          io.to(groupChatId).emit("room message", {
            error: "group id or message id is null",
          });
          console.error(
            "Error handling room message:",
            "group id or message id is null"
          );
        }
      } catch (error) {
        io.to(groupChatId).emit("room message", { error });
        console.error("Error handling room message:", error);
      }
    });
    socket.on(
      "room editMessage",
      async ({ chatId, messageId, textMessage }) => {
        try {
          if (chatId && messageId) {
            // const deleteMessage = await editChatMessageFromDatabase(
            //   messageId,
            //   textMessage
            // );
            // io.to(chatId).emit("room editMessage", deleteMessage);
            
            // Mock response for testing without database
            const mockEditResponse = {
              id: messageId,
              message: textMessage,
              edited: true,
              timestamp: new Date().toISOString()
            };
            io.to(chatId).emit("room editMessage", mockEditResponse);
          } else {
            io.to(chatId).emit("room message", {
              error: "chat id or message id is null",
            });
            console.error(
              "Error handling room message:",
              "chat id or message id is null"
            );
          }
        } catch (error) {
          // io.to(groupChatId).emit("room message", { error });
          // console.error("Error handling room message:", error);
        }
      }
    );

    socket.on(
      "group editMessage",
      async ({ groupChatId, messageId, textMessage }) => {
        try {
          if (groupChatId && messageId) {
            // const deleteMessage = await edit1GroupMessageFromDatabase(
            //   messageId,
            //   textMessage
            // );
            // io.to(groupChatId).emit("room editMessage", deleteMessage);
            
            // Mock response for testing without database
            const mockEditResponse = {
              id: messageId,
              message: textMessage,
              edited: true,
              timestamp: new Date().toISOString()
            };
            io.to(groupChatId).emit("room editMessage", mockEditResponse);
          } else {
            io.to(groupChatId).emit("room message", {
              error: "group id or message id is null",
            });
            console.error(
              "Error handling room message:",
              "group id or message id is null"
            );
          }
        } catch (error) {
          io.to(groupChatId).emit("room message", { error });
          console.error("Error handling room message:", error);
        }
      }
    );
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
