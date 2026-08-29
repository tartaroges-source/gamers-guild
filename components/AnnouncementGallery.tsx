'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);

  // Portals need document.body, which only exists on the client — this
  // flag guards against trying to render one during server-side rendering.
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const modal = active && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={close}
    >
      <div
        className="border-guild-green/20 bg-surface flex h-[75vh] w-[75vw] max-w-4xl flex-col overflow-hidden rounded-lg border max-sm:h-[90vh] max-sm:w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-guild-green/20 flex flex-shrink-0 items-center justify-between border-b px-4 py-3">
          <p className="text-guild-gold font-mono text-xs tracking-widest uppercase">
            {formatEventDate(active.createdAt)}
          </p>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="text-muted hover:text-guild-green flex h-8 w-8 items-center justify-center rounded-md"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {active.posterUrl && (
            <div className="bg-background relative h-[45vh] w-full max-sm:h-64">
              <Image src={active.posterUrl} alt="" fill sizes="75vw" className="object-contain" />
            </div>
          )}
          <div className="p-5">
            <h2 className="font-display text-foreground text-lg font-bold tracking-wide uppercase break-words sm:text-xl">
              {active.title}
            </h2>
            <p className="text-muted mt-3 text-sm break-words whitespace-pre-line">{active.body}</p>
          </div>
        </div>

        {/* Footer nav */}
        {announcements.length > 1 && (
          <div className="border-guild-green/20 flex flex-shrink-0 items-center justify-between border-t px-4 py-3">
            <button
              type="button"
              onClick={showPrev}
              className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Prev
            </button>
            <p className="text-muted font-mono text-xs tracking-widest">
              {activeIndex !== null ? activeIndex + 1 : 0} / {announcements.length}
            </p>
            <button
              type="button"
              onClick={showNext}
              className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm"
            >
              Next
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {variant === 'cards' ? (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {announcements.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="hud-card glow-card border-guild-green/20 bg-surface overflow-hidden rounded-lg border text-left"
            >
              {item.posterUrl && (
                <div className="bg-background relative h-52 w-full sm:h-64">
                  <Image
                    src={item.posterUrl}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 512px"
                    className="object-contain"
                  />
                </div>
              )}
              <div className="p-4 sm:p-6">
                <p className="text-guild-gold font-mono text-xs tracking-widest uppercase">
                  {formatEventDate(item.createdAt)}
                </p>
                <h3 className="font-display text-foreground mt-2 text-base font-bold tracking-wide uppercase sm:text-lg">
                  {item.title}
                </h3>
                <p className="text-muted mt-2 line-clamp-3 text-sm">{item.body}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-4 sm:mt-10 sm:gap-6">
          {announcements.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="border-guild-green/20 bg-surface block w-full overflow-hidden rounded-lg border text-left"
              >
                {item.posterUrl && (
                  <div className="bg-background relative h-64 w-full sm:h-80">
                    <Image
                      src={item.posterUrl}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="p-4 sm:p-6">
                  <p className="text-guild-gold font-mono text-xs tracking-widest uppercase">
                    {formatEventDate(item.createdAt)}
                  </p>
                  <h2 className="font-display text-foreground mt-1 text-lg font-bold tracking-wide uppercase sm:text-xl">
                    {item.title}
                  </h2>
                  <p className="text-muted mt-3 text-sm break-words whitespace-pre-line">{item.body}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {mounted && modal ? createPortal(modal, document.body) : null}
    </>
  );
}