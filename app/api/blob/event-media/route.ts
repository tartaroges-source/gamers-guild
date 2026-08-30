import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// This route only ever issues a short-lived upload token — the actual
// file bytes go straight from the browser to Vercel Blob, never through
// this serverless function. That's what avoids the platform's request
// body size limit for videos.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await auth();
        if (!session?.user) {
          throw new Error('You must be signed in to upload files.');
        }

        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'video/mp4',
            'video/webm',
          ],
          maximumSizeInBytes: 50 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Intentionally empty — this webhook isn't reachable from
        // localhost during development. The client creates the
        // corresponding EventMedia row itself once the upload finishes,
        // via attachEventMediaAction.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed.' },
      { status: 400 }
    );
  }
}