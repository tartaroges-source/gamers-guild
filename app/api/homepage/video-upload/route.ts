import { NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/lib/auth";

export async function POST(): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "You must be signed in to upload." }, { status: 401 });
  }

  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 1800; // valid for 30 minutes

  // Client-side ImageKit uploads are authorized by this signature, which
  // only our server can compute (it needs the private key). The browser
  // never sees the private key itself — only this one-time signature.
  const signature = crypto
    .createHmac("sha1", process.env.IMAGEKIT_PRIVATE_KEY!)
    .update(token + expire)
    .digest("hex");

  return NextResponse.json({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  });
}