import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/config";

// This only uses the edge-safe config — no database calls happen here,
// just a check of the signed session cookie on incoming requests.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/dashboard/:path*"],
};