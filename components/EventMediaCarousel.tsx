'use client';

import { useState } from 'react';
import Image from 'next/image';

type MediaItem = { id: string; url: string; type: 'IMAGE' | 'VIDEO' };

export function EventMediaCarousel({ media }: { media: MediaItem[] }) {
  const [index, setIndex] = useState(0);
  const current = media[index];

  const goTo = (i: number) => setIndex((i + media.length) % media.length);

  return (
    <div className="w-full">
      <div className="border-guild-green/20 bg-surface relative overflow-hidden rounded-lg border">
        {current.type === 'VIDEO' ? (
          <video src={current.url} controls className="aspect-video w-full object-contain" />
        ) : (
          <div className="relative aspect-video w-full">
            <Image src={current.url} alt="" fill sizes="(max-width: 768px) 100vw, 768px" className="object-contain" />
          </div>
        )}

        {media.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous"
              className="bg-background/80 text-guild-green hover:bg-background absolute top-1/2 left-2 -translate-y-1/2 rounded-full p-2"
            >
              &larr;
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next"
              className="bg-background/80 text-guild-green hover:bg-background absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-2"
            >
              &rarr;
            </button>
          </>
        )}
      </div>

      {media.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {media.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 w-2 rounded-full ${i === index ? 'bg-guild-green' : 'bg-guild-green/30'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
