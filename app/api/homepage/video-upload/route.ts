import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'You must be signed in to upload.' }, { status: 401 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'homepage';

  // Cloudinary requires every signed upload to be authorized by a
  // signature computed here, on the server, from the exact parameters
  // that will be sent with the upload. This proves the request was
  // approved by us — the browser never sees the API secret itself,
  // only this one-time signature tied to this specific upload attempt.
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
}