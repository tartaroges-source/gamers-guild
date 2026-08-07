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