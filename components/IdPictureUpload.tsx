'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import { getCroppedImageFile } from '@/lib/cropImage';

type IdPictureUploadProps = {
  // Pass the parent's action `state` here. Any change to it means a
  // submission attempt just completed — React auto-resets uncontrolled
  // file inputs right after that, so this effect re-attaches the cropped
  // file immediately afterward, undoing the wipe.
  resetSignal?: unknown;
};

export function IdPictureUpload({ resetSignal }: IdPictureUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  // Holds the real cropped File, independent of the DOM input's own
  // value — this is what survives React's automatic form reset.
  const croppedFileRef = useRef<File | null>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setPreviewUrl(null);
    setImageSrc(URL.createObjectURL(file));
  }

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  function attachFileToInput(file: File) {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    if (hiddenInputRef.current) {
      hiddenInputRef.current.files = dataTransfer.files;
    }
  }

  async function handleConfirmCrop() {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedFile = await getCroppedImageFile(imageSrc, croppedAreaPixels, 'id-picture.jpg');

      croppedFileRef.current = croppedFile;
      attachFileToInput(croppedFile);

      setPreviewUrl(URL.createObjectURL(croppedFile));
      setImageSrc(null);
    } catch {
      setError('Could not crop the image. Please try again.');
    }
  }

  // Runs after every submission attempt (resetSignal changes whenever the
  // parent's action state updates). Re-attaches the already-cropped file
  // so a validation error elsewhere in the form doesn't force a re-crop.
  useEffect(() => {
    if (croppedFileRef.current) {
      attachFileToInput(croppedFileRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deliberately only re-runs on resetSignal changes
  }, [resetSignal]);

  return (
    <div>
      <label className="text-muted text-sm font-medium">2x2 ID Picture</label>

      <input type="file" name="idPicture" ref={hiddenInputRef} className="hidden" />

      {!imageSrc && !previewUrl && (
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="text-foreground file:bg-guild-green file:text-background hover:file:bg-guild-green-dim mt-1 w-full text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-bold file:tracking-wide file:uppercase"
        />
      )}

      {imageSrc && (
        <div className="mt-2 flex flex-col gap-3">
          <div className="border-guild-green/30 bg-background relative h-64 w-full overflow-hidden rounded-md border">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={0}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <input
            type="range"
            min={1}
            max={3}
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
              onClick={() => setImageSrc(null)}
              className="border-guild-green/30 text-muted hover:bg-surface rounded-md border px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {previewUrl && !imageSrc && (
        <div className="mt-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview, not a remote/optimizable image */}
          <img
            src={previewUrl}
            alt="Cropped ID picture preview"
            className="border-guild-green/30 h-24 w-24 rounded-md border object-cover"
          />
          <button
            type="button"
            onClick={() => {
              setPreviewUrl(null);
              croppedFileRef.current = null;
              if (hiddenInputRef.current) hiddenInputRef.current.value = '';
            }}
            className="text-guild-green text-xs hover:underline"
          >
            Retake / Re-crop
          </button>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}