'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { formatEventDate } from '@/lib/format';

type AnnouncementItem = {
  id: string;
  title: string;
  body: string;
  posterUrl: string | null;
  createdAt: Date;
};

type AnnouncementGalleryProps = {
  announcements: AnnouncementItem[];
  variant: 'cards' | 'list';
};

export function AnnouncementGallery({ announcements, variant }: AnnouncementGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + announcements.length) % announcements.length));
  }, [announcements.length]);
  const showNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % announcements.length));
  }, [announcements.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, close, showPrev, showNext]);

  const active = activeIndex !== null ? announcements[activeIndex] : null;

  return (
    <>
      {variant === 'cards' ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {announcements.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="hud-card glow-card border-guild-green/20 bg-surface overflow-hidden rounded-lg border text-left"
            >
              {item.posterUrl && (
                <div className="bg-background relative h-40 w-full">
                  <Image
                    src={item.posterUrl}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 512px"
                    className="object-contain"
                  />
                </div>
              )}
              <div className="p-6">
                <p className="text-guild-gold font-mono text-xs tracking-widest uppercase">
                  {formatEventDate(item.createdAt)}
                </p>
                <h3 className="font-display text-foreground mt-2 text-lg font-bold tracking-wide uppercase">
                  {item.title}
                </h3>
                <p className="text-muted mt-2 line-clamp-3 text-sm">{item.body}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <ul className="mt-10 flex flex-col gap-6">
          {announcements.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="border-guild-green/20 bg-surface block w-full overflow-hidden rounded-lg border text-left"
              >
                {item.posterUrl && (
                  <div className="bg-background relative h-56 w-full sm:h-72">
                    <Image
                      src={item.posterUrl}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="p-6">
                  <p className="text-guild-gold font-mono text-xs tracking-widest uppercase">
                    {formatEventDate(item.createdAt)}
                  </p>
                  <h2 className="font-display text-foreground mt-1 text-xl font-bold tracking-wide uppercase">
                    {item.title}
                  </h2>
                  <p className="text-muted mt-3 text-sm whitespace-pre-line">{item.body}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="text-foreground hover:text-guild-green absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>

          {announcements.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label="Previous announcement"
                className="text-foreground hover:text-guild-green absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 sm:left-4"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                aria-label="Next announcement"
                className="text-foreground hover:text-guild-green absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 sm:right-4"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          <div
            className="border-guild-green/20 bg-surface flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border sm:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {active.posterUrl && (
              <div className="bg-background relative min-h-[240px] w-full flex-1 sm:min-h-0">
                <Image src={active.posterUrl} alt="" fill sizes="90vw" className="object-contain" />
              </div>
            )}
            <div className="w-full flex-shrink-0 overflow-y-auto p-6 sm:w-80">
              <p className="text-guild-gold font-mono text-xs tracking-widest uppercase">
                {formatEventDate(active.createdAt)}
              </p>
              <h2 className="font-display text-foreground mt-2 text-xl font-bold tracking-wide uppercase">
                {active.title}
              </h2>
              <p className="text-muted mt-3 text-sm whitespace-pre-line">{active.body}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}