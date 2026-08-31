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
// MemberIdCard stacks front + back with `gap-8` (Tailwind's 2rem, 32px at
// the default root font size). The previous version only reserved height
// for a single card, which caused the second card to spill outside its
// wrapper on desktop (scale === 1) and visually cover the download button.
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

// Shrinks the fixed-size card pair to fit narrow screens using a pure CSS
// transform. This changes only how the content is painted on screen — the
// element's real layout size (offsetWidth/offsetHeight) is unchanged, so
// html-to-image still captures each card at full, unscaled resolution
// regardless of how small it's being displayed here. The wrapper's
// reserved height now accounts for BOTH cards + the gap between them, so
// nothing spills outside its box at any scale, including scale === 1 on
// desktop.
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

      const captureOptions = { pixelRatio: 3, cacheBust: true, backgroundColor: undefined };

      const frontDataUrl = await toPng(frontRef.current, captureOptions);
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