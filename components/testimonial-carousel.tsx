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
    <div className="w-full">
      <div className="relative h-[360px] md:h-[400px] w-full overflow-hidden sm:overflow-visible mb-6">
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
                  "absolute top-0 bg-white transition-all duration-700 ease-in-out p-8 md:p-12 flex flex-col h-[340px] md:h-[380px]",

                  // VARIANT DEFAULT (Center Flanked)
                  variant === "default" &&
                    "w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] -translate-x-1/2 rounded-[2rem]",
                  variant === "default" &&
                    position === 0 &&
                    "z-30 left-1/2 opacity-100 scale-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)]",
                  variant === "default" &&
                    position === 1 &&
                    "z-20 left-[120%] sm:left-[90%] md:left-[85%] opacity-40 scale-95 md:scale-90 shadow-none cursor-pointer",
                  variant === "default" &&
                    position === reviews.length - 1 &&
                    "z-20 left-[-20%] sm:left-[10%] md:left-[15%] opacity-40 scale-95 md:scale-90 shadow-none cursor-pointer",
                  variant === "default" &&
                    position !== 0 &&
                    position !== 1 &&
                    position !== reviews.length - 1 &&
                    "opacity-0 pointer-events-none scale-75 left-1/2 z-0",

                  // VARIANT STACKED (Right Stacked)
                  variant === "stacked" && "w-[85%] sm:w-[90%] rounded-2xl border border-gray-100",
                  variant === "stacked" &&
                    position === 0 &&
                    "z-30 left-0 opacity-100 scale-100 shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
                  variant === "stacked" &&
                    position === 1 &&
                    "z-20 left-[8%] sm:left-[10%] opacity-100 scale-[0.95] shadow-sm cursor-pointer",
                  variant === "stacked" &&
                    position === 2 &&
                    "z-10 left-[16%] sm:left-[20%] opacity-100 scale-[0.90] shadow-sm cursor-pointer",
                  variant === "stacked" &&
                    position > 2 &&
                    "opacity-0 pointer-events-none scale-[0.80] left-[24%] z-0",
                )}
              >
                {/* QUOTE */}
                <div className="mb-2 md:mb-4">
                  <Image
                    src="/images/quote.svg"
                    alt="Quote"
                    className="h-12 w-12 md:h-12 md:w-12"
                    width={64}
                    height={64}
                  />
                </div>

                {/* TEXTO */}
                <div
                  className={cn(
                    "overflow-y-auto pr-4 mb-6 flex-grow",
                    position === 0 ? "pointer-events-auto scroolbar-hide" : "pointer-events-none",
                  )}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      width: 4px;
                    }
                    div::-webkit-scrollbar-thumb {
                      background-color: #e5e7eb;
                      border-radius: 4px;
                    }
                  `}</style>
                  <p className="text-base md:text-[17px] text-gray-500 font-medium leading-relaxed">
                    {review.text}
                  </p>
                </div>

                {/* NOME NO CANTO INFERIOR ESQUERDO */}
                <p className="text-base md:text-lg font-bold text-black mt-auto">{review.author}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTÕES */}
      <div
        className={cn(
          "flex items-center mt-8 gap-12",
          arrowsPosition === "center" && "justify-center",
          arrowsPosition === "left" && "justify-start",
          arrowsPosition === "right" && "justify-end",
        )}
      >
        <button
          onClick={handlePreviousReview}
          className="text-gray-400 hover:text-black transition-colors cursor-pointer"
          aria-label="Previous review"
        >
          <MoveLeft className="h-6 w-6" />
        </button>
        <button
          onClick={handleNextReview}
          className="text-black hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="Next review"
        >
          <MoveRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
