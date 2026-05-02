"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, MoveLeft, MoveRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface Review {
  id: string | number;
  text: string;
  author: string;
}

interface TestimonialCarouselProps {
  reviews: Review[];
  variant?: "default" | "stacked";
  arrowsPosition?: "left" | "center" | "right";
}

export function TestimonialCarousel({
  reviews,
  variant = "default",
  arrowsPosition = "center",
}: TestimonialCarouselProps) {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const handlePreviousReview = () => {
    setCurrentReviewIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNextReview = () => {
    setCurrentReviewIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="w-full relative py-12">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-orange/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand-green/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative h-[420px] md:h-[480px] w-full overflow-hidden sm:overflow-visible mb-12">
        <div className="relative w-full h-full max-w-7xl mx-auto">
          {reviews.map((review, index) => {
            const position = (index - currentReviewIndex + reviews.length) % reviews.length;

            return (
              <div
                key={review.id}
                onClick={() => {
                  if (position === 1) handleNextReview();
                  if (variant === "default" && position === reviews.length - 1)
                    handlePreviousReview();
                  if (variant === "stacked" && position === 2) handleNextReview();
                }}
                className={cn(
                  "absolute top-0 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col h-[400px] md:h-[440px] group",

                  // VARIANT DEFAULT (Center Flanked)
                  variant === "default" &&
                    "w-[92%] sm:w-[80%] md:w-[70%] lg:w-[60%] -translate-x-1/2 rounded-[3.5rem] p-10 md:p-16 border-white/40",
                  variant === "default" &&
                    position === 0 &&
                    "z-30 left-1/2 opacity-100 scale-100 glass shadow-[0_40px_80px_-15px_rgba(0,0,0,0.25)]",
                  variant === "default" &&
                    position === 1 &&
                    "z-20 left-[130%] sm:left-[100%] md:left-[95%] opacity-20 scale-[0.85] blur-[2px] shadow-none cursor-pointer grayscale",
                  variant === "default" &&
                    position === reviews.length - 1 &&
                    "z-20 left-[-30%] sm:left-[0%] md:left-[5%] opacity-20 scale-[0.85] blur-[2px] shadow-none cursor-pointer grayscale",
                  variant === "default" &&
                    position !== 0 &&
                    position !== 1 &&
                    position !== reviews.length - 1 &&
                    "opacity-0 pointer-events-none scale-50 left-1/2 z-0",

                  // VARIANT STACKED (Right Stacked)
                  variant === "stacked" && "w-[85%] sm:w-[90%] rounded-[3rem] p-10 border-white/20 glass",
                  variant === "stacked" &&
                    position === 0 &&
                    "z-30 left-0 opacity-100 scale-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)]",
                  variant === "stacked" &&
                    position === 1 &&
                    "z-20 left-[8%] sm:left-[10%] opacity-60 scale-[0.92] shadow-sm cursor-pointer blur-[1px]",
                  variant === "stacked" &&
                    position === 2 &&
                    "z-10 left-[16%] sm:left-[20%] opacity-30 scale-[0.84] shadow-sm cursor-pointer blur-[2px]",
                  variant === "stacked" &&
                    position > 2 &&
                    "opacity-0 pointer-events-none scale-[0.70] left-[24%] z-0",
                )}
              >
                {/* Decorative Elements */}
                <div className="absolute top-10 right-10 flex gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-red/40" />
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-orange/40" />
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-green/40" />
                </div>

                {/* QUOTE ICON */}
                <div className="mb-8 relative">
                   <div className="absolute -top-4 -left-4 w-12 h-12 bg-brand-orange/10 rounded-full blur-xl animate-pulse" />
                   <svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-orange relative z-10">
                      <path d="M12.8 40L21.6 22.4V0H0V22.4H8.8L0 40H12.8ZM39.2 40L48 22.4V0H26.4V22.4H35.2L26.4 40H39.2Z" fill="currentColor" fillOpacity="0.4"/>
                   </svg>
                </div>

                {/* TEXT CONTENT */}
                <div
                  className={cn(
                    "overflow-y-auto pr-6 mb-8 flex-grow scroolbar-hide",
                    position === 0 ? "pointer-events-auto" : "pointer-events-none",
                  )}
                >
                  <p className="text-lg md:text-2xl text-brand-black/70 font-bold italic leading-relaxed tracking-tight">
                    "{review.text}"
                  </p>
                </div>

                {/* AUTHOR FOOTER */}
                <div className="mt-auto flex items-center gap-6">
                   <div className="h-px flex-1 bg-brand-black/5" />
                   <div className="text-right">
                      <p className="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em] mb-1">Membro da comunidade</p>
                      <p className="text-xl md:text-2xl font-black text-brand-black uppercase tracking-tighter">{review.author}</p>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NAVIGATION CONTROLS */}
      <div
        className={cn(
          "flex items-center gap-16 relative z-40",
          arrowsPosition === "center" && "justify-center",
          arrowsPosition === "left" && "justify-start",
          arrowsPosition === "right" && "justify-end",
        )}
      >
        <button
          onClick={handlePreviousReview}
          className="group flex flex-col items-center gap-3 text-gray-400 hover:text-brand-orange transition-all duration-500 cursor-pointer"
          aria-label="Previous review"
        >
          <div className="w-16 h-16 rounded-full border border-brand-black/5 flex items-center justify-center glass group-hover:bg-brand-black group-hover:text-white group-hover:border-brand-black transition-all duration-500 shadow-xl group-active:scale-90">
             <MoveLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">Anterior</span>
        </button>

        <button
          onClick={handleNextReview}
          className="group flex flex-col items-center gap-3 text-gray-400 hover:text-brand-green transition-all duration-500 cursor-pointer"
          aria-label="Next review"
        >
          <div className="w-20 h-20 rounded-full border border-brand-black/5 flex items-center justify-center glass group-hover:bg-brand-black group-hover:text-white group-hover:border-brand-black transition-all duration-500 shadow-2xl group-active:scale-90">
             <MoveRight className="h-8 w-8 group-hover:translate-x-1 transition-transform" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">Próximo</span>
        </button>
      </div>
    </div>
  );
}
