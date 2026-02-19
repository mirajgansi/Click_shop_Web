"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { socket } from "@/lib/socket"; // ✅ adjust path if different

export default function DriverLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {
  const { setUser } = useAuth();

  // keep your auth user setup
  useEffect(() => {
    if (user?._id) setUser(user);
  }, [user, setUser]);

  // ✅ SOCKET CONNECT + JOIN ROOM
  useEffect(() => {
    if (!user?._id) return;

    // listen first (so you don't miss logs)
    socket.on("connect", () => {
      console.log("✅ SOCKET CONNECTED:", socket.id);
      socket.emit("join", user._id); // join room = userId
    });

    socket.on("connect_error", (err) => {
      console.log("❌ SOCKET CONNECT ERROR:", err.message);
    });

    socket.on("notification", (data) => {
      console.log("🔔 notification:", data);
      // you can trigger toast here later
    });

    // IMPORTANT: because autoConnect:false
    if (!socket.connected) socket.connect();

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("notification");
      // optional: socket.disconnect(); // only if you want disconnect when leaving driver area
    };
  }, [user?._id]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />

      <div className="flex flex-1 w-full">
        <aside className="hidden xl:block w-64 shrink-0 border-r border-black/10 bg-background">
          <Sidebar />
        </aside>

        <main className="flex-1 px-6 py-6 bg-background">{children}</main>
      </div>
    </div>
  );
}
