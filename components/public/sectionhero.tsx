// components/public/sectionhero.tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full py-12 md:py-16 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="relative flex w-full h-[200px] sm:h-[300px] md:h-[400px] items-center justify-center">
          {slides.map((slide, index) => {
            let position = "";
            if (index === current) {
              position = "translate-x-0 scale-100 opacity-100 z-20";
            } else if (index === (current + 1) % slides.length) {
              position = "translate-x-[40%] sm:translate-x-[320px] scale-90 opacity-70 z-10";
            } else if (index === (current - 1 + slides.length) % slides.length) {
              position = "-translate-x-[40%] sm:-translate-x-[320px] scale-90 opacity-70 z-10";
            } else {
              position = "scale-75 opacity-0 z-0";
            }

            return (
              <img
                key={slide.id}
                src={slide.image}
                alt={slide.alt}
                className={`absolute w-[80%] sm:w-[70%] md:w-[800px] h-auto aspect-[2/1] object-cover rounded-xl shadow-lg transition-all duration-700 ease-in-out ${position}`}
              />
            );
          })}

          {/* Navigation Buttons */}
          <button
            onClick={goToPrev}
            aria-label="Previous slide"
            className="absolute left-2 sm:left-[-50px] top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 sm:p-3 rounded-full shadow-lg transition-colors"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={goToNext}
            aria-label="Next slide"
            className="absolute right-2 sm:right-[-50px] top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 sm:p-3 rounded-full shadow-lg transition-colors"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}