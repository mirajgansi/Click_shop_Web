"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

import AvatarMenu from "@/app/_componets/AvatarMenu";
import NotificationBell from "@/app/_componets/Notification";

function formatTime(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

export default function Header() {
  const { user, loading } = useAuth();

  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const displayName = user?.userName || user?.name || user?.email || "Admin";

  // ✅ show nothing while loading / not logged in
  if (loading || !user?._id) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/70">
      <nav className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 md:h-18 items-center justify-between">
          {/* LEFT */}
          <Link href="/admin" className="flex items-center gap-3 sm:gap-4">
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 overflow-hidden rounded-full ring-1 ring-black/10">
              <Image
                src="/cookie.jpg"
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>

            <div className="leading-tight">
              <div className="text-base sm:text-lg md:text-xl font-bold text-black">
                Click Shop
              </div>
              <div className="text-[10px] sm:text-[11px] md:text-xs font-medium text-gray-500">
                {formatTime(now)} <span className="mx-1">•</span> {formatDate(now)}
              </div>
            </div>
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:block text-right leading-tight">
              <div className="text-sm font-semibold text-gray-900">
                {displayName}
              </div>
              <div className="text-xs text-gray-500">
                {user.role?.toUpperCase?.() ?? "ADMIN"}
              </div>
            </div>

            <div className="flex justify-center xl:justify-end">
              <NotificationBell userId={user._id} role={user.role} />
            </div>

            <AvatarMenu
              displayName={displayName}
              profileHref="/admin/profile"
              roleLabel="Admin"
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
