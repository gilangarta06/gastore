"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  { id: 1, image: "/images/images.jpeg", alt: "Banner 1" },
  { id: 2, image: "/images/images.jpeg", alt: "Banner 2" },
  { id: 3, image: "/images/images.jpeg", alt: "Banner 3" },
];

export default function SectionHero() {
  const [current, setCurrent] = useState(0);
  const lastIndex = slides.length - 1;

  function goToNext() {
    setCurrent((prev) => (prev === lastIndex ? 0 : prev + 1));
  }

  function goToPrev() {
    setCurrent((prev) => (prev === 0 ? lastIndex : prev - 1));
  }

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full py-16 md:py-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-20">

        {/* Carousel Container */}
        <div className="relative group">
          <div className="relative flex w-full h-[180px] sm:h-[250px] md:h-[350px] items-center justify-center">
            {slides.map((slide, index) => {
              let position = "";
              if (index === current) {
                position = "translate-x-0 scale-100 opacity-100 z-20";
              } else if (index === (current + 1) % slides.length) {
                position = "translate-x-[35%] sm:translate-x-[220px] scale-90 opacity-60 z-10";
              } else if (index === (current - 1 + slides.length) % slides.length) {
                position = "-translate-x-[35%] sm:-translate-x-[220px] scale-90 opacity-60 z-10";
              } else {
                position = "scale-75 opacity-0 z-0";
              }

              return (
                <div
                  key={slide.id}
                  className={`absolute w-[65%] sm:w-[55%] md:w-[600px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ease-out ${position}`}
                >
                  {/* Gradient Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 p-[2px] rounded-2xl">
                    <div className="bg-background rounded-2xl overflow-hidden h-full relative">
                      <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <Button
            size="icon"
            variant="ghost"
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-card/80 backdrop-blur-sm border border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/40"
          >
            <ChevronLeft className="h-5 w-5 text-blue-500" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-card/80 backdrop-blur-sm border border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/40"
          >
            <ChevronRight className="h-5 w-5 text-blue-500" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 bg-gradient-to-r from-blue-500 to-purple-500"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Gradient Animation */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}
