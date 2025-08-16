// app/lib/socket.ts
import { io, Socket } from "socket.io-client";
const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL as string;

// Create a centralized socket instance
export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false, // Don't connect automatically, let the app control when to connect
});

// Initialize socket event listeners
socket.on("connect", () => {
  console.log("Connected to socket:", socket?.id);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.log("Socket connection error:", error);
});

export function connectSocket(token?: string) {
  if (token) {
    socket.auth = { token };
  }
  
  if (!socket.connected) {
    socket.connect();
  }
  
  return socket;
}

export function getSocket() {
  return socket;
}

// Function to disconnect the socket
export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}

// Function to check if socket is connected
export function isSocketConnected() {
  return socket.connected;
}
