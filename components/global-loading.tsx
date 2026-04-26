"use client";

import Image from "next/image";

export function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <div className="relative flex flex-col items-center">
        {/* Animated Background Glow */}
        <div className="absolute -inset-10 bg-[#8A0204]/5 blur-3xl rounded-full animate-pulse" />
        
        {/* Logo Container */}
        <div className="relative animate-in fade-in zoom-in duration-700">
          <Image
            src="/meet-off.png"
            alt="MeetOff Logo"
            width={240}
            height={80}
            className="w-48 md:w-64 h-auto animate-pulse"
            priority
          />
        </div>

        {/* Loading Indicator */}
        <div className="mt-8 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#8A0204] animate-bounce [animation-delay:-0.3s]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#8A0204] animate-bounce [animation-delay:-0.15s]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#8A0204] animate-bounce" />
        </div>
        
        <p className="mt-4 text-sm font-medium text-gray-500 tracking-widest uppercase animate-pulse">
          Carregando...
        </p>
      </div>
    </div>
  );
}
