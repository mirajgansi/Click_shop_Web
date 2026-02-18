"use client";
import { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function SocketBridge({ userId }: { userId: string }) {
  useEffect(() => {
    if (!userId) return;

    socket.connect();
    socket.emit("join", userId);

    console.log("✅ socket connect + join:", userId);

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return null;
}
