"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AdminLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {
  const { setUser } = useAuth();

  useEffect(() => {
    if (user?._id) setUser(user);
  }, [user, setUser]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />

      <div className="flex flex-1 w-full">
        <aside className="hidden xl:block w-64 shrink-0 border-r border-black/10 bg-background">
          <Sidebar />
        </aside>

        <main className="flex-1 px-6 py-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
