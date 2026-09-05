'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import { getCroppedImageFile } from '@/lib/cropImage';

type IdPictureUploadProps = {
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
  const croppedFileRef = useRef<File | null>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (croppedFileRef.current) {
      attachFileToInput(croppedFileRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deliberately only re-runs on resetSignal changes
  }, [resetSignal]);

  // react-easy-crop measures its container's size on mount to size the crop
  // area. When the container mounts inside a conditional block, that
  // measurement can happen before layout has actually settled, producing a
  // tiny (e.g. 64x64) crop area regardless of the container's real size.
  // Dispatching a resize event one tick after mount forces the library to
  // re-measure against the container's true, final dimensions.
  useEffect(() => {
    if (!imageSrc) return;
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
    return () => clearTimeout(timer);
  }, [imageSrc]);

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
          <div
            ref={cropContainerRef}
            className="border-guild-green/30 bg-background relative overflow-hidden rounded-md border"
            style={{ width: '100%', height: 256 }}
          >
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