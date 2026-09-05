const CANONICAL_PUBLIC_ORIGIN = 'https://gamersguild-ucpnc.vercel.app';

function originFrom(value: string | undefined) {
  if (!value) return null;

  try {
    return new URL(value.includes('://') ? value : `https://${value}`).origin;
  } catch {
    return null;
  }
}

export async function getBaseUrl() {
  // QR codes can be generated on a local/admin server but scanned on another
  // device. Always use the deployed public URL so they never point at
  // localhost, a preview deployment, or an internal reverse-proxy address.
  const configuredOrigin = originFrom(process.env.NEXT_PUBLIC_APP_URL);
  return configuredOrigin ?? CANONICAL_PUBLIC_ORIGIN;
}
