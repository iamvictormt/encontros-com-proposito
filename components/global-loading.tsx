"use client";

import Image from "next/image";

export function GlobalLoading() {
  return (
    <div className="fixed inset-0 w-screen h-[100dvh] z-[9999] flex flex-col items-center justify-center bg-white">
      <div className="relative flex flex-col items-center">
        {/* Animated Background Glow */}
        <div className="absolute -inset-10 bg-[#FF1D55]/5 blur-3xl rounded-full animate-pulse" />

        {/* Loading Indicator */}
        <div className="mt-8 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#FF1D55] animate-bounce [animation-delay:-0.3s]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#FF1D55] animate-bounce [animation-delay:-0.15s]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#FF1D55] animate-bounce" />
        </div>

        <p className="mt-4 text-sm font-medium text-gray-500 tracking-widest uppercase animate-pulse">
          Carregando...
        </p>
      </div>
    </div>
  );
}
