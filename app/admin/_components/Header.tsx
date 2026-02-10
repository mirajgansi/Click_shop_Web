"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const { logout, user } = useAuth();

  const [now, setNow] = React.useState(() => new Date());
  const [menuValue, setMenuValue] = React.useState<string>("");

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const onMenuChange = (val: string) => {
    setMenuValue(val);
    if (val === "logout") logout();
    setTimeout(() => setMenuValue(""), 50);
  };

  const displayName = user?.userName || user?.name || user?.email || "Admin";

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <nav className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 md:h-18 items-center justify-between">
          {/* LEFT */}
          <Link href="/admin" className="flex items-center gap-3 sm:gap-4">
            {/* Logo */}
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 overflow-hidden rounded-full ring-1 ring-black/10">
              <Image src="/cookie.jpg" alt="Logo" fill className="object-cover" />
            </div>

            {/* Title + Time */}
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
            {/* User info */}
            <div className="hidden md:block text-right leading-tight">
              <div className="text-sm font-semibold text-gray-900">
                {displayName}
              </div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>

            <Select value={menuValue} onValueChange={onMenuChange}>
              <SelectTrigger className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full border border-black/10 p-0">
                <SelectValue
                  placeholder={
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-900 text-xs sm:text-sm font-bold text-white">
                      {String(displayName).slice(0, 2).toUpperCase()}
                    </div>
                  }
                />
              </SelectTrigger>

              <SelectContent align="end" className="w-44">
                <SelectItem value="profile">Profile</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </nav>
    </header>
  );
}
