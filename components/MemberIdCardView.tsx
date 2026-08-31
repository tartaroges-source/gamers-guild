'use client';

import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
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

const CARD_WIDTH_IN = 3.375;

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
// between rendering the front and back cards — a bare await Promise
// wasn't enough; waiting for a real animation frame gives the browser an
// actual opportunity to run garbage collection before the next heavy
// capture starts.
function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
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

      const { jsPDF } = await import('jspdf');

      // pixelRatio was 3, which — combined with html-to-image embedding
      // every image (including full-resolution template PNGs) as base64
      // during capture — produced enough memory pressure to crash the
      // tab. 2x is still solidly print-quality (~192 DPI on a CR80 card)
      // at a fraction of the memory cost. cacheBust removed too, since
      // forcing a fresh network fetch + re-encode on every single
      // download was pure added memory/time cost for no benefit here.
      const captureOptions = { pixelRatio: 2, backgroundColor: undefined };

      const frontDataUrl = await toPng(frontRef.current, captureOptions);
      await nextFrame();
      const backDataUrl = await toPng(backRef.current, captureOptions);

      const frontImg = new Image();
      frontImg.src = frontDataUrl;
      await new Promise((resolve) => {
        frontImg.onload = resolve;
      });
      const cardHeightIn = CARD_WIDTH_IN / (frontImg.width / frontImg.height);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [CARD_WIDTH_IN, cardHeightIn],
      });

      pdf.addImage(frontDataUrl, 'PNG', 0, 0, CARD_WIDTH_IN, cardHeightIn);
      pdf.addPage([CARD_WIDTH_IN, cardHeightIn], 'landscape');
      pdf.addImage(backDataUrl, 'PNG', 0, 0, CARD_WIDTH_IN, cardHeightIn);

      pdf.save(`${props.fullName.replace(/\s+/g, '-')}-guild-id.pdf`);
    } catch (err) {
      console.error('ID card generation failed:', err);
      setError('Something went wrong generating the PDF. Please try again.');
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
        {isGenerating ? 'Generating PDF...' : 'Download ID Card (PDF)'}
      </button>
    </div>
  );
}