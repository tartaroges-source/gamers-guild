import { NextRequest, NextResponse } from 'next/server';

// Fetches a remote image server-side and returns its bytes directly. This
// exists purely to sidestep CORS: a browser-side fetch() to Vercel Blob can
// be blocked by CORS policy even when an <img> tag loads it fine, but a
// server-to-server request has no CORS restriction at all. The client asks
// this same-origin route for the image instead of asking Blob directly.
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url || !url.startsWith('https://')) {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }

  // Restrict to Vercel Blob URLs only — this route should never become a
  // general-purpose open proxy for arbitrary sites.
  if (!url.includes('.public.blob.vercel-storage.com')) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: 'Upstream fetch failed' }, { status: 502 });
    }

    const contentType = response.headers.get('content-type') ?? 'application/octet-stream';
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Proxy fetch failed' }, { status: 502 });
  }
}