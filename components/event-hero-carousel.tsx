"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MoveLeft, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventHeroCarouselProps {
  images: string[];
  interval?: number; // ms
}

export function EventHeroCarousel({ images, interval = 5000 }: EventHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setProgress(0);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setProgress(0);
  }, [images.length]);

  useEffect(() => {
    const step = 50; // update every 50ms
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + (step / interval) * 100;
      });
    }, step);

    return () => clearInterval(timer);
  }, [currentIndex, interval, nextSlide]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full h-[350px] md:h-[650px] group overflow-hidden">
      {/* Images */}
      {images.map((img, idx) => (
        <div
          key={idx}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0",
          )}
        >
          <Image
            src={img}
            alt={`Slide ${idx + 1}`}
            fill
            className="object-cover"
            priority={idx === 0}
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      ))}

      {/* Progress Bars */}
      <div className="absolute top-4 left-4 right-4 z-30 flex gap-2 h-1">
        {images.map((_, idx) => (
          <div key={idx} className="flex-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full bg-white transition-all ease-linear",
                idx < currentIndex && "w-full",
                idx === currentIndex && "w-0", // Will be overridden by inline style
                idx > currentIndex && "w-0",
              )}
              style={idx === currentIndex ? { width: `${progress}%` } : {}}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-4 md:left-12 -translate-y-1/2 z-30">
        <button
          onClick={prevSlide}
          className="bg-white/80 backdrop-blur-sm rounded-full p-2 md:p-3 shadow-md hover:bg-white transition-all transform hover:scale-110 text-gray-700 cursor-pointer"
        >
          <MoveLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
      <div className="absolute top-1/2 right-4 md:right-12 -translate-y-1/2 z-30">
        <button
          onClick={nextSlide}
          className="bg-white/80 backdrop-blur-sm rounded-full p-2 md:p-3 shadow-md hover:bg-white transition-all transform hover:scale-110 text-gray-700 cursor-pointer"
        >
          <MoveRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
}
