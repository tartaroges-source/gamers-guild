const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

function imagekitAuthHeader(): string {
  // ImageKit's server-side upload uses HTTP Basic Auth with the private
  // key as the username and an empty password — this is documented
  // behavior, not SDK-specific, so it's stable regardless of which
  // client library version is (or isn't) installed.
  const token = Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString("base64");
  return `Basic ${token}`;
}

async function uploadToImageKit(
  file: File,
  folder: string,
  extraTransformParams: string
): Promise<{ url: string } | { error: string }> {
  const form = new FormData();
  form.append("file", file);
  form.append("fileName", `${crypto.randomUUID()}-${file.name}`);
  form.append("folder", `/${folder}`);
  form.append("useUniqueFileName", "false");

  const response = await fetch(IMAGEKIT_UPLOAD_URL, {
    method: "POST",
    headers: { Authorization: imagekitAuthHeader() },
    body: form,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    return { error: body?.message ?? "Upload failed." };
  }

  const result = await response.json();
  // ImageKit applies transformations by appending a query string to the
  // delivery URL rather than at upload time — the file stored is
  // untouched, and the transformation is applied on the fly whenever
  // that URL is requested.
  return { url: `${result.url}?tr=${extraTransformParams}` };
}

export async function validateAndUploadImage(
  file: File,
  folder: string
): Promise<{ url: string } | { error: string }> {
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose an image file." };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Only JPEG, PNG, WebP, or GIF images are allowed." };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { error: "Image must be smaller than 5MB." };
  }

  // w-1000: cap width at 1000px (larger images shrink, smaller ones are
  // left alone). q-auto: ImageKit picks the best quality per image
  // automatically, balancing file size against visible quality.
  return uploadToImageKit(file, folder, "w-1000,q-auto");
}

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
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

  return uploadToImageKit(file, folder, "q-auto");
}