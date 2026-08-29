'use client';

import { useEffect, useState } from 'react';

type Slide = { label: string; blurb: string };

export function HeroSlides({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative mt-6 h-28 max-w-2xl overflow-hidden sm:h-20">
      {slides.map((slide, i) => {
        const offset = i - index;
        return (
          <div
            key={slide.label}
            className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: `translateX(${offset * 100}%)`,
              opacity: offset === 0 ? 1 : 0,
            }}
          >
            <p
              className="font-display text-guild-gold text-xl font-bold tracking-wide uppercase sm:text-3xl"
              style={{ textShadow: '0 2px 20px rgba(31, 174, 89, 0.4)' }}
            >
              {slide.label}
            </p>
            <p className="text-muted mt-1 max-w-md text-sm sm:text-base">{slide.blurb}</p>
          </div>
        );
      })}
    </div>
  );
}