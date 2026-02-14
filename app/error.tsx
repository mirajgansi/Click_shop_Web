"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      
      {/* Image */}
      <div className="relative w-full max-w-3xl h-[400px]">
        <Image
          src="/image.png"
          alt="Something went wrong"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Title */}
      <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-800">
        Oops! Something went wrong
      </h1>

      {/* Subtitle */}
      <p className="mt-2 max-w-md text-sm sm:text-base text-gray-600">
        We're having trouble loading your groceries right now. 
        Please refresh the page or try again in a moment.
      </p>

      {/* Retry Button */}
      <button
        onClick={() => reset()}
        className="mt-6 rounded-xl bg-green-600 px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
      >
        Try Again
      </button>
    </div>
  );
}
