import { io as createIo } from "socket.io-client";

export const socket = createIo(process.env.NEXT_PUBLIC_BACKEND_URL!, {
  transports: ["websocket"],
  autoConnect: false,
});
