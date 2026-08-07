'use client';

import { useState, useEffect, useCallback, useRef, type TouchEvent } from 'react';
import Image from 'next/image';

type LightboxImage = { id: string; url: string; caption?: string | null };

export function AlbumLightbox({ images }: { images: LightboxImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const touchStartX = useRef(0);

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const showNext = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [openIndex, close, showPrev, showNext]);

  function handleTouchStart(e: TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: TouchEvent) {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) showPrev();
    if (delta < -50) showNext();
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, i) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="border-guild-green/20 bg-surface overflow-hidden rounded-lg border"
          >
            <Image
              src={image.url}
              alt={image.caption ?? ''}
              width={300}
              height={300}
              className="aspect-square w-full object-cover transition-opacity hover:opacity-80"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={close}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 text-3xl text-white/70 hover:text-white"
            aria-label="Close"
          >
            &times;
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="absolute left-4 text-3xl text-white/70 hover:text-white"
            aria-label="Previous image"
          >
            &#8249;
          </button>
          <Image
            src={images[openIndex].url}
            alt={images[openIndex].caption ?? ''}
            width={1200}
            height={1200}
            className="max-h-[85vh] w-auto max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-4 text-3xl text-white/70 hover:text-white"
            aria-label="Next image"
          >
            &#8250;
          </button>
        </div>
      )}
    </>
  );
}
