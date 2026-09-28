'use client';

import { useEffect, useRef, useState } from 'react';
import { toJpeg } from 'html-to-image';
import { MemberIdCard } from '@/components/MemberIdCard';

type MemberIdCardViewProps = {
  photoUrl: string | null;
  ign: string;
  fullName: string;
  studentId: string;
  positionLabel: string;
  dateOfBirth: string;
  dateOfIssue: string;
  memberSince: string;
  signatureUrl: string | null;
  qrDataUrl: string | null;
};

// Real, unscaled pixel size of each card — must match the dimensions used
// inside MemberIdCard itself.
const CARD_WIDTH_PX = 1344;
const CARD_HEIGHT_PX = 824;
const CARD_GAP_PX = 32;
const TOTAL_CONTENT_HEIGHT_PX = CARD_HEIGHT_PX * 2 + CARD_GAP_PX;

function waitForCardImages(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll<HTMLImageElement>('img[data-card-image]'));
  const pending = images.filter((img) => !img.complete || img.naturalWidth === 0);

  if (pending.length === 0) return Promise.resolve();

  return new Promise((resolve) => {
    let remaining = pending.length;
    function settle() {
      remaining -= 1;
      if (remaining <= 0) resolve();
    }
    pending.forEach((img) => {
      img.addEventListener('load', settle, { once: true });
      img.addEventListener('error', settle, { once: true });
    });
  });
}

function ScaledCard({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    function updateScale() {
      if (!node) return;
      const available = node.offsetWidth;
      setScale(Math.min(1, available / CARD_WIDTH_PX));
    }

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} style={{ width: '100%' }}>
      <div style={{ height: TOTAL_CONTENT_HEIGHT_PX * scale }}>
        <div
          style={{
            width: CARD_WIDTH_PX,
            height: TOTAL_CONTENT_HEIGHT_PX,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// Lets the browser breathe (and release memory from the previous capture)
// between rendering the front and back cards — waiting for a real
// animation frame gives the browser an actual opportunity to run garbage
// collection before the next heavy capture starts.
function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Triggers a normal browser download for an in-memory data URL by
// clicking a temporary, invisible link.
function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function MemberIdCardView(props: MemberIdCardViewProps) {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    if (!frontRef.current || !backRef.current) return;

    setIsGenerating(true);
    setError(null);

    try {
      await Promise.all([
        document.fonts.ready,
        waitForCardImages(frontRef.current),
        waitForCardImages(backRef.current),
      ]);

      // pixelRatio 2 is still solidly print-quality (~192 DPI on a CR80
      // card) at a fraction of the memory cost of 3. JPG has no
      // transparency, so the card's rounded corners get filled with the
      // backgroundColor below instead of being see-through. quality 0.95
      // keeps text and glow effects crisp with far smaller files than PNG.
      const captureOptions = { pixelRatio: 2, quality: 0.95, backgroundColor: '#ffffff' };

      const baseName = props.fullName.replace(/\s+/g, '-');

      const frontDataUrl = await toJpeg(frontRef.current, captureOptions);
      downloadDataUrl(frontDataUrl, `${baseName}-guild-id-front.jpg`);

      await nextFrame();
      // Small pause so the browser treats these as two separate
      // downloads instead of dropping the second one.
      await wait(400);

      const backDataUrl = await toJpeg(backRef.current, captureOptions);
      downloadDataUrl(backDataUrl, `${baseName}-guild-id-back.jpg`);
    } catch (err) {
      console.error('ID card generation failed:', err);
      setError('Something went wrong generating the image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-6 sm:items-start">
        <ScaledCard>
          <MemberIdCard frontRef={frontRef} backRef={backRef} {...props} />
        </ScaledCard>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <button
        type="button"
        onClick={handleDownload}
        disabled={isGenerating}
        className="bg-guild-green font-display text-background hover:bg-guild-green-dim mt-6 w-full rounded-md px-6 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors disabled:opacity-50 sm:w-fit"
      >
        {isGenerating ? 'Generating...' : 'Download ID Card (JPG)'}
      </button>
    </div>
  );
}