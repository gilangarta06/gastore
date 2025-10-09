"use client";

import { useState, useEffect } from "react";

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

  useEffect(() => {
    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full py-12 md:py-16 bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="relative flex w-full h-[150px] sm:h-[220px] md:h-[300px] items-center justify-center">
          {slides.map((slide, index) => {
            let position = "";
            if (index === current) {
              position = "translate-x-0 scale-100 opacity-100 z-20";
            } else if (index === (current + 1) % slides.length) {
              position = "translate-x-[30%] sm:translate-x-[200px] scale-90 opacity-70 z-10";
            } else if (index === (current - 1 + slides.length) % slides.length) {
              position = "-translate-x-[30%] sm:-translate-x-[200px] scale-90 opacity-70 z-10";
            } else {
              position = "scale-75 opacity-0 z-0";
            }

            return (
              <img
                key={slide.id}
                src={slide.image}
                alt={slide.alt}
                className={`absolute w-[60%] sm:w-[50%] md:w-[520px] rounded-xl shadow-lg object-cover aspect-[2/1] transition-all duration-700 ease-in-out ${position}`}
              />
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-all ${
                i === current
                  ? "bg-gray-800 dark:bg-white scale-110"
                  : "bg-gray-400 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
