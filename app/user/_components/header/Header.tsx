'use client';

import Nav from './Nav';
import Actions from './Actions';
import { useAuth } from '@/context/AuthContext';
import { socket } from '@/lib/socket';
import { useEffect } from 'react';

export default function Header({
  
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
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
<div className="text-xl font-bold text-green-600">
            Click Shop</div>
                    <Nav />
        <Actions />
      </div>
    </header>
  );
}
