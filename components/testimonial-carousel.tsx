"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface Review {
  id: string | number;
  text: string;
  author: string;
}

interface TestimonialCarouselProps {
  reviews: Review[];
}

export function TestimonialCarousel({ reviews }: TestimonialCarouselProps) {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const handlePreviousReview = () => {
    setCurrentReviewIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNextReview = () => {
    setCurrentReviewIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  if (!reviews || reviews.length === 0) return null;

  return (
    <div>
      <div className="relative h-90 w-full mb-2">
        <div className="relative w-full h-full">
          {reviews.map((review, index) => {
            const position = (index - currentReviewIndex + reviews.length) % reviews.length;

            return (
              <div
                key={review.id}
                className={cn(
                  "relative absolute top-0 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 ease-in-out p-8 h-80",
                  // ↑ importante: "relative" antes de "absolute"

                  position === 0 && "z-30 left-0 w-[85%] opacity-100 scale-100 overflow-y-auto",
                  position === 1 && "z-20 left-[5%] w-[90%] opacity-60 scale-95 overflow-hidden",
                  position === 2 && "z-10 left-[10%] w-[95%] opacity-40 scale-90 overflow-hidden",
                  position > 2 && "opacity-0 pointer-events-none",
                )}
              >
                {/* QUOTE */}
                <Image
                  src="/images/quote.svg"
                  alt="Quote"
                  className="mb-4 h-10 w-10"
                  width={24}
                  height={24}
                />

                {/* TEXTO */}
                <p className="text-base text-gray-500 leading-relaxed mb-12 pr-4">{review.text}</p>

                {/* NOME NO CANTO INFERIOR ESQUERDO */}
                <p className="text-sm font-bold text-black absolute bottom-4 left-8">
                  {review.author}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTÕES */}
      <div className="flex justify-end gap-4 mt-1">
        <button
          onClick={handlePreviousReview}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="Previous review"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          onClick={handleNextReview}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="Next review"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
