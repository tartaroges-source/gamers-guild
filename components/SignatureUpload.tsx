'use client';

import { useState } from 'react';
import { trimSignatureWhitespace } from '@/lib/trimImage';

type SignatureUploadProps = {
  onChange: (dataUrl: string | null) => void;
  error?: string;
};

export function SignatureUpload({ onChange, error }: SignatureUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessError(null);
    setIsProcessing(true);
    onChange(null);
    setPreviewUrl(null);

    try {
      const dataUrl = await trimSignatureWhitespace(file);
      setPreviewUrl(dataUrl);
      onChange(dataUrl);
    } catch {
      setProcessError('Could not process that image. Please try a different photo.');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div>
      {!previewUrl && (
        <>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={isProcessing}
            className="text-foreground file:bg-guild-green file:text-background hover:file:bg-guild-green-dim text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-bold file:tracking-wide file:uppercase disabled:opacity-50"
          />
          <p className="text-muted mt-1 text-xs ">
            Upload a clear photo of your signature on a plain white background — extra space around it
            is trimmed automatically.
          </p>
          {isProcessing && <p className="text-guild-gold mt-1 text-xs">Processing...</p>}
        </>
      )}

      {previewUrl && (
        <div className="mt-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- local data URL preview, not a remote image */}
          <img
            src={previewUrl}
            alt="Signature preview"
            className="border-guild-green/30 h-16 rounded-md border bg-white object-contain p-2"
          />
          <button
            type="button"
            onClick={() => {
              setPreviewUrl(null);
              onChange(null);
            }}
            className="text-guild-green text-xs hover:underline"
          >
            Remove / Re-upload
          </button>
        </div>
      )}

      {(processError || error) && (
        <p className="mt-1 text-sm text-red-400">{processError ?? error}</p>
      )}
    </div>
  );
}