import { put } from "@vercel/blob";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function validateAndUploadImage(
  file: File,
  folder: string
): Promise<{ url: string } | { error: string }> {
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose an image file." };
  }

  // Never trust client-side restrictions alone — the <input accept="...">
  // attribute is just a UI hint; a request can always be crafted to skip
  // it. Re-checking type and size here, on the server, is the real
  // security boundary.
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Only JPEG, PNG, WebP, or GIF images are allowed." };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { error: "Image must be smaller than 5MB." };
  }

  const blob = await put(`${folder}/${crypto.randomUUID()}-${file.name}`, file, {
    access: "public",
  });

  return { url: blob.url };
}

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
// Kept deliberately tight — a homepage hero video is downloaded by every
// visitor. A large file quietly burns through Vercel Blob's free-tier
// bandwidth allowance far faster than image uploads ever would.
const MAX_VIDEO_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export async function validateAndUploadVideo(
  file: File,
  folder: string
): Promise<{ url: string } | { error: string }> {
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose a video file." };
  }

  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return { error: "Only MP4 or WebM videos are allowed." };
  }

  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    return {
      error: "Video must be smaller than 15MB — keep hero videos short (8-15s) and compressed.",
    };
  }

  const blob = await put(`${folder}/${crypto.randomUUID()}-${file.name}`, file, {
    access: "public",
  });

  return { url: blob.url };
}
