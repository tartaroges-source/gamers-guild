'use client';

import { useRef } from 'react';

type MemberQrCardProps = {
  fullName: string;
  qrDataUrl: string;
  fileName: string;
};

export function MemberQrCard({ fullName, qrDataUrl, fileName }: MemberQrCardProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="flex-shrink-0"
        title="View full-size"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- generated data URL, not an external image */}
        <img
          src={qrDataUrl}
          alt={`QR code verifying ${fullName}`}
          className="h-20 w-20 rounded bg-white p-1 transition-opacity hover:opacity-80"
        />
      </button>

      <dialog ref={dialogRef} className="border-guild-green/30 bg-surface backdrop:bg-black/70 rounded-lg border p-6">
        <div className="flex flex-col items-center gap-4">
          <p className="font-display text-foreground text-sm font-bold tracking-wide uppercase">
            {fullName}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element -- generated data URL, not an external image */}
          <img
            src={qrDataUrl}
            alt={`QR code verifying ${fullName}`}
            className="h-64 w-64 rounded bg-white p-2"
          />
          <div className="flex gap-3">
            <a href={qrDataUrl} download={fileName} className="bg-guild-green font-display text-background hover:bg-guild-green-dim rounded-md px-4 py-2 text-xs font-bold tracking-wide uppercase">
              Download
            </a>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="border-guild-green/30 text-muted hover:bg-background rounded-md border px-4 py-2 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}