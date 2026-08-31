'use client';

import { useEffect, useState } from 'react';
import { montserrat, yellowtail } from '@/lib/fonts';

type MemberIdCardProps = {
  frontRef: React.RefObject<HTMLDivElement | null>;
  backRef: React.RefObject<HTMLDivElement | null>;
  photoUrl: string | null;
  ign: string;
  fullName: string;
  studentId: string;
  positionLabel: string;
  dateOfBirth: string;
  dateOfIssue: string;
  memberSince: string;
  signatureUrl: string | null;
  qrDataUrl: string | null;
};

const CARD_WIDTH = 1344;
const CARD_HEIGHT = 824;

// Layout-neutral border: `outline` never takes up box space or resizes
// the element (unlike `border`, which shifted the whole rendered box and
// threw off every absolutely-positioned overlay when it was added
// earlier). Same visual gold border effect, none of the side effects.
const cardOutlineStyle: React.CSSProperties = {
  outline: '6px solid #ffd400',
  outlineOffset: '-6px',
};

const valueStyle: React.CSSProperties = {
  margin: 0,
  position: 'absolute',
  fontWeight: 700,
  fontSize: 22,
  lineHeight: 1.2,
  color: '#ffffff',
  letterSpacing: '0.035em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  textShadow: '0 0 4px rgba(255, 255, 255, 0.82), 0 0 11px rgba(255, 255, 255, 0.28)',
};

function SignatureImage({ src }: { src: string }) {
  const [processedSrc, setProcessedSrc] = useState(src);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d');
        if (!context) return;

        context.drawImage(image, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const hasTransparentBackground = imageData.data[3] === 0;

        for (let index = 0; index < imageData.data.length; index += 4) {
          const alpha = imageData.data[index + 3];
          if (alpha === 0) continue;

          if (hasTransparentBackground) {
            imageData.data[index] = 255;
            imageData.data[index + 1] = 255;
            imageData.data[index + 2] = 255;
            continue;
          }

          const brightness =
            (imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2]) / 3;
          imageData.data[index] = 255;
          imageData.data[index + 1] = 255;
          imageData.data[index + 2] = 255;
          imageData.data[index + 3] = Math.round(((255 - brightness) / 255) * alpha);
        }

        context.putImageData(imageData, 0, 0);
        if (!cancelled) setProcessedSrc(canvas.toDataURL('image/png'));
      } catch {
        if (!cancelled) setProcessedSrc(src);
      }
    };
    image.onerror = () => {
      if (!cancelled) setProcessedSrc(src);
    };
    image.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- canvas-derived image is needed for PDF parity
    <img
      src={processedSrc}
      alt="Signature"
      data-card-image="true"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  );
}

export function MemberIdCard({
  frontRef,
  backRef,
  photoUrl,
  ign,
  fullName,
  studentId,
  positionLabel,
  dateOfBirth,
  dateOfIssue,
  memberSince,
  signatureUrl,
  qrDataUrl,
}: MemberIdCardProps) {
  return (
    <div
      className={`${montserrat.variable} ${yellowtail.variable} flex flex-col items-center gap-8`}
    >
      <div
        ref={frontRef}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          position: 'relative',
          background: '#0e1310',
          borderRadius: 64,
          overflow: 'hidden',
          ...cardOutlineStyle,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- native img required for reliable html2canvas capture */}
        <img
          src="/id-card-front.png"
          alt=""
          data-card-image="true"
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />

        <div
          style={{
            position: 'absolute',
            left: 56,
            top: 54,
            width: 470,
            height: 612,
            padding: 5,
            borderRadius: 42,
            background: '#ffd400',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 35,
              overflow: 'hidden',
              background: '#101510',
            }}
          >
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- native img required for reliable html2canvas capture
              <img
                src={photoUrl}
                alt={fullName}
                crossOrigin="anonymous"
                data-card-image="true"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#e5e5e5',
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 700,
                  fontSize: 48,
                  color: '#c9a227',
                }}
              >
                {fullName.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div
          className={yellowtail.className}
          style={{
            position: 'absolute',
            left: 70,
            top: 510,
            width: 350,
            padding: '8px 14px 12px',
            color: '#ffd400',
            fontSize: 62,
            fontFamily: '"Brush Script MT", "Segoe Script", var(--font-yellowtail)',
            fontWeight: 700,
            lineHeight: 1,
            whiteSpace: 'nowrap',
            overflow: 'visible',
          }}
        >
          {ign}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- native img required for reliable html2canvas capture */}
        <img
          src="/logo.png"
          alt="Gamers' Guild crest"
          data-card-image="true"
          style={{
            position: 'absolute',
            left: 415,
            top: 535,
            width: 100,
            height: 100,
            objectFit: 'contain',
          }}
        />
        <div
          className={montserrat.className}
          style={{
            position: 'absolute',
            left: 78,
            top: 591,
            maxWidth: 420,
            color: '#ffffff',
            fontSize: 20,
            fontWeight: 800,
            lineHeight: 1.15,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            textShadow: '0 0 4px rgba(255, 255, 255, 0.72), 0 0 9px rgba(255, 255, 255, 0.22)',
          }}
        >
          {fullName}
        </div>
        <div
          className={montserrat.className}
          style={{
            position: 'absolute',
            left: 78,
            top: 616,
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            textShadow: '0 0 3px rgba(255, 255, 255, 0.7), 0 0 7px rgba(255, 255, 255, 0.2)',
          }}
        >
          Member since {memberSince}
        </div>

        <div className={montserrat.className} style={{ ...valueStyle, left: 596, top: 350 }}>
          {studentId}
        </div>
        <div className={montserrat.className} style={{ ...valueStyle, left: 1000, top: 350 }}>
          {positionLabel}
        </div>
        <div className={montserrat.className} style={{ ...valueStyle, left: 596, top: 452 }}>
          {dateOfBirth}
        </div>
        <div
          className={montserrat.className}
          style={{ ...valueStyle, left: 996, top: 452, fontSize: 19 }}
        >
          {dateOfIssue}
        </div>

        {signatureUrl && (
          <div style={{ position: 'absolute', left: 590, top: 553, width: 270, height: 105 }}>
            <SignatureImage src={signatureUrl} />
          </div>
        )}

        <div style={{ position: 'absolute', left: 730, top: 751, width: 560, height: 38 }}>
          <span
            className={montserrat.className}
            style={{
              position: 'absolute',
              left: 0,
              width: 260,
              color: '#ffd400',
              fontSize: 18,
              fontWeight: 800,
              lineHeight: 1.4,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              textAlign: 'right',
              whiteSpace: 'nowrap',
              textShadow: '0 0 4px rgba(255, 212, 0, 0.85), 0 0 10px rgba(255, 212, 0, 0.35)',
            }}
          >
            {ign}
          </span>
          <span
            className={montserrat.className}
            style={{
              position: 'absolute',
              left: 300,
              width: 250,
              color: '#ffffff',
              fontSize: 17,
              fontWeight: 700,
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
              textShadow: '0 0 4px rgba(255, 255, 255, 0.75), 0 0 9px rgba(255, 255, 255, 0.25)',
            }}
          >
            {fullName}
          </span>
        </div>
      </div>

      <div
        ref={backRef}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          position: 'relative',
          background: '#0e1310',
          borderRadius: 64,
          overflow: 'hidden',
          ...cardOutlineStyle,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- native img required for reliable html2canvas capture */}
        <img
          src="/id-card-back.png"
          alt=""
          data-card-image="true"
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />

        {qrDataUrl && (
          <div
            style={{
              position: 'absolute',
              left: 148,
              top: 180,
              width: 452,
              height: 465,
              padding: 6,
              borderRadius: 24,
              background: '#ffffff',
              border: '4px solid #ffd400',
              boxSizing: 'border-box',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- native img required for reliable html2canvas capture */}
            <img
              src={qrDataUrl}
              alt="Member verification QR code"
              data-card-image="true"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element -- supplied static asset */}
        <img
          src="/president-signature-cropped.png"
          alt="President signature"
          data-card-image="true"
          style={{
            position: 'absolute',
            left: 978,
            top: 526,
            width: 250,
            height: 140,
            objectFit: 'contain',
            mixBlendMode: 'screen',
            filter: 'grayscale(1) brightness(2.25) contrast(1.35)',
          }}
        />
      </div>
    </div>
  );
}