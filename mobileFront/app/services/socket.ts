// app/lib/socket.ts
import { io, Socket } from "socket.io-client";
const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL as string;

let socket: Socket | null = null;

export function connectSocket(token?: string) {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: token ? { token } : undefined,
    });

    socket.on("connect", () => {
      console.log("Connected to socket:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });
  }
  return socket;
}

export function getSocket() {
  return socket;
}
