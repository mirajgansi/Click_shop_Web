"use client";

import { ShoppingCart } from "lucide-react";

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <ShoppingCart className="h-14 w-14 text-green-600 animate-bounce" />
          <div className="absolute inset-0 -z-10 h-14 w-14 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
        </div>

        <p className="text-sm text-gray-600 animate-pulse">
          Loading your groceries...
        </p>
      </div>
    </div>
  );
}
