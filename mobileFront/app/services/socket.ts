import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(baseURL: string, token?: string) {
  if (!socket) {
    socket = io(baseURL, {
      autoConnect: false,
      transports: ["websocket"],
      auth: token ? { token } : undefined,
    });

    socket.on("connect", () => console.log("socket connected", socket?.id));
    socket.on("disconnect", (reason) => console.log("socket disconnected", reason));
    socket.on("connect_error", (err) => console.log("connect_error", err.message));
  }
  return socket;
}

export function connectSocket(baseURL: string, token?: string) {
  const s = getSocket(baseURL, token);
  if (token) (s as any).auth = { token };
  if (!s.connected) s.connect();
  return s;
}

export function disconnectSocket() {
  socket?.disconnect();
}
