'use client';

import { useState, useEffect, useCallback, useRef, type TouchEvent } from 'react';
import Image from 'next/image';

type LightboxImage = { id: string; url: string; type: 'IMAGE' | 'VIDEO'; caption?: string | null };

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

  // Lock body scroll while the lightbox is open
  useEffect(() => {
    if (openIndex === null) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [openIndex]);

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
            {image.type === 'VIDEO' ? (
              <video
                src={image.url}
                className="aspect-square w-full object-cover transition-opacity hover:opacity-80"
              />
            ) : (
              <Image
                src={image.url}
                alt={image.caption ?? ''}
                width={300}
                height={300}
                className="aspect-square w-full object-cover transition-opacity hover:opacity-80"
              />
            )}
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4"
          onClick={close}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-2 right-2 z-10 rounded-full bg-black/40 p-2 text-2xl leading-none text-white/80 hover:text-white sm:top-4 sm:right-4 sm:bg-transparent sm:text-3xl"
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
            className="absolute left-1 z-10 rounded-full bg-black/40 p-2 text-2xl leading-none text-white/80 hover:text-white sm:left-4 sm:bg-transparent sm:text-3xl"
            aria-label="Previous image"
          >
            &#8249;
          </button>

          {images[openIndex].type === 'VIDEO' ? (
            <video
              src={images[openIndex].url}
              controls
              autoPlay
              className="max-h-[100dvh] w-auto max-w-full object-contain sm:max-h-[85vh] sm:max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            // `fill` inside a viewport-sized relative box (instead of a fixed
            // width/height) so the image scales to fit without a forced
            // aspect ratio. Sized full-bleed on mobile, boxed on larger
            // screens. `100dvh` accounts for mobile browser chrome
            // (address bar) so the image isn't cut off by it.
            <div
              className="relative h-[100dvh] w-full sm:h-[85vh] sm:w-[90vw] sm:max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[openIndex].url}
                alt={images[openIndex].caption ?? ''}
                fill
                sizes="(max-width: 640px) 100vw, 90vw"
                className="object-contain"
                priority
              />
            </div>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-1 z-10 rounded-full bg-black/40 p-2 text-2xl leading-none text-white/80 hover:text-white sm:right-4 sm:bg-transparent sm:text-3xl"
            aria-label="Next image"
          >
            &#8250;
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white sm:bottom-4 sm:text-sm">
            {openIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}