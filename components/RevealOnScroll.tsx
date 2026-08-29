'use client';

import { useEffect, useRef, useState } from 'react';

type RevealOnScrollProps = {
  children: React.ReactNode;
  direction?: 'left' | 'right';
};

export function RevealOnScroll({ children, direction = 'left' }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const startX = direction === 'left' ? -60 : 60;

  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <div
        style={{
          transform: isVisible ? 'translateX(0px)' : `translateX(${startX}px)`,
          opacity: isVisible ? 1 : 0,
          transition: 'transform 1800ms cubic-bezier(0.22, 1, 0.36, 1), opacity 1800ms ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}