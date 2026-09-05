'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import { getCroppedImageFile } from '@/lib/cropImage';

type SignatureUploadProps = {
  onChange: (dataUrl: string | null) => void;
  error?: string;
};

export function SignatureUpload({
  onChange,
  error,
}: SignatureUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<Area | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropError, setCropError] = useState<string | null>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setCropError(null);
    setPreviewUrl(null);
    onChange(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setImageSrc(URL.createObjectURL(file));
  }

  const onCropComplete = useCallback(
    (_area: Area, areaPixels: Area) => {
      setCroppedAreaPixels(areaPixels);
    },
    []
  );

  async function handleConfirmCrop() {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedFile = await getCroppedImageFile(
        imageSrc,
        croppedAreaPixels,
        'signature.png'
      );

      const reader = new FileReader();

      reader.onload = () => {
        const dataUrl = reader.result as string;
        setPreviewUrl(dataUrl);
        onChange(dataUrl);
        setImageSrc(null);
      };

      reader.readAsDataURL(croppedFile);
    } catch {
      setCropError('Could not crop the image. Please try again.');
    }
  }

  return (
    <div>
      {!imageSrc && !previewUrl && (
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="text-foreground file:bg-guild-green file:text-background hover:file:bg-guild-green-dim text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-bold file:tracking-wide file:uppercase"
        />
      )}

      {imageSrc && (
        <div className="mt-2 flex flex-col gap-3">
          <p className="text-guild-gold text-xs">
            Zoom and drag so only your signature shows inside the box
            — crop out any extra background space around it for the
            clearest result on your ID.
          </p>

          <div className="border-guild-green/30 bg-background relative h-64 w-full overflow-hidden rounded-md border">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={0}
              aspect={3}
              cropShape="rect"
              cropSize={{ width: 600, height: 200 }}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <input
            type="range"
            min={1}
            max={4}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleConfirmCrop}
              className="bg-guild-green text-background hover:bg-guild-green-dim rounded-md px-4 py-2 text-sm font-bold"
            >
              Confirm Crop
            </button>

            <button
              type="button"
              onClick={() => {
                setImageSrc(null);
                setZoom(1);
                setCrop({ x: 0, y: 0 });
                setCroppedAreaPixels(null);
              }}
              className="border-guild-green/30 text-muted hover:bg-surface rounded-md border px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {previewUrl && !imageSrc && (
        <div className="mt-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Cropped signature preview"
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
            Retake / Re-crop
          </button>
        </div>
      )}

      {(cropError || error) && (
        <p className="mt-1 text-sm text-red-400">
          {cropError ?? error}
        </p>
      )}
    </div>
  );
}