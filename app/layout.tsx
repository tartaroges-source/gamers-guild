import type { Metadata } from 'next';
import { Rajdhani, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const rajdhani = Rajdhani({
  variable: '--font-rajdhani',
  subsets: ['latin'],
  weight: ['600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Gamers' Guild | PNC",
  description:
    "The official home of the Gamers' Guild at PNC — events, announcements, and community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${rajdhani.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">{children}</body>
    </html>
  );
}