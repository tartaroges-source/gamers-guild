'use client';

import { useRef, useState } from 'react';
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

// Target width in inches for the printed card. Height is derived from the
// canvas's actual aspect ratio at export time, not hardcoded — this keeps
// the PDF perfectly matching the live preview instead of being stretched
// to fit a fixed page size with a different ratio than the rendered card.
const CARD_WIDTH_IN = 3.375;

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
      // Export only after the local Next fonts are available, otherwise their
      // fallback widths can move text outside its template slots.
      await document.fonts.ready;

      const [html2canvas, { jsPDF }] = await Promise.all([
        import('html2canvas').then((m) => m.default),
        import('jspdf'),
      ]);

      const [frontCanvas, backCanvas] = await Promise.all([
        html2canvas(frontRef.current, { scale: 3, useCORS: true, backgroundColor: null }),
        html2canvas(backRef.current, { scale: 3, useCORS: true, backgroundColor: null }),
      ]);

      // Derive the page height from each canvas's own aspect ratio so the
      // PDF page is never a different shape than what was actually
      // rendered — eliminates any stretching/squishing on export.
      const cardHeightIn = CARD_WIDTH_IN / (frontCanvas.width / frontCanvas.height);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [CARD_WIDTH_IN, cardHeightIn],
      });

      pdf.addImage(frontCanvas.toDataURL('image/png'), 'PNG', 0, 0, CARD_WIDTH_IN, cardHeightIn);
      pdf.addPage([CARD_WIDTH_IN, cardHeightIn], 'landscape');
      pdf.addImage(backCanvas.toDataURL('image/png'), 'PNG', 0, 0, CARD_WIDTH_IN, cardHeightIn);

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
      <div className="overflow-x-auto pb-4">
        <MemberIdCard frontRef={frontRef} backRef={backRef} {...props} />
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <button
        type="button"
        onClick={handleDownload}
        disabled={isGenerating}
        className="bg-guild-green font-display text-background hover:bg-guild-green-dim mt-6 w-fit rounded-md px-6 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors disabled:opacity-50"
      >
        {isGenerating ? 'Generating PDF...' : 'Download ID Card (PDF)'}
      </button>
    </div>
  );
}