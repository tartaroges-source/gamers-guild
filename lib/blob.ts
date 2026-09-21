import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

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

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ width: 1000, crop: "limit", quality: "auto", fetch_format: "auto" }],
      },
      (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(error ?? new Error("Cloudinary image upload failed with no result."));
          return;
        }
        resolve(uploadResult);
      }
    );
    uploadStream.end(buffer);
  });

  return { url: result.secure_url };
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

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "video",
        // Caps quality/bitrate automatically so short hero clips don't
        // eat disproportionately into the monthly credit pool — 1 credit
        // covers 500 seconds of SD video, so keeping quality reasonable
        // matters more here than for images.
        transformation: [{ quality: "auto" }],
      },
      (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(error ?? new Error("Cloudinary video upload failed with no result."));
          return;
        }
        resolve(uploadResult);
      }
    );
    uploadStream.end(buffer);
  });

  return { url: result.secure_url };
}