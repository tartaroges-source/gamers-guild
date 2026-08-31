'use client';

import { useEffect, useRef, useState } from 'react';
import SignaturePadLib from 'signature_pad';

type SignaturePadProps = {
  onChange: (dataUrl: string | null) => void;
  error?: string;
};

export function SignaturePad({ onChange, error }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePadLib | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Signature pads need real pixel dimensions matching the canvas's
    // displayed size, or drawing looks blurry/offset — this sizes the
    // canvas's internal resolution to match its CSS size exactly.
    function resizeCanvas() {
      if (!canvas) return;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d')?.scale(ratio, ratio);
      padRef.current?.clear();
    }

    const pad = new SignaturePadLib(canvas, {
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: 'rgb(14, 19, 16)',
    });
    padRef.current = pad;

    pad.addEventListener('endStroke', () => {
      setIsEmpty(pad.isEmpty());
      onChange(pad.isEmpty() ? null : pad.toDataURL('image/png'));
    });

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onChange intentionally excluded to avoid re-initializing the pad on every parent render
  }, []);

  function handleClear() {
    padRef.current?.clear();
    setIsEmpty(true);
    onChange(null);
  }

  return (
    <div>
      <div
        className={`overflow-hidden rounded-md border bg-white ${
          error ? 'border-red-400' : 'border-guild-green/30'
        }`}
      >
        <canvas ref={canvasRef} className="h-40 w-full touch-none" />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-muted text-xs">
          {isEmpty ? 'Sign above using your mouse or finger.' : 'Signature captured.'}
        </p>
        <button
          type="button"
          onClick={handleClear}
          className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 rounded-md border px-3 py-1 text-xs"
        >
          Clear
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}