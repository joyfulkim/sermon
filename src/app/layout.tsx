import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import BottomNavBar from '@/components/layout/BottomNavBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://sermon-five.vercel.app'),
  title: '설교 세미나 2026 | 아브라함 쿠루빌라 교수',
  description: '그리스도의 형상을 따라가게 하는(Christ-iconic) 설교 - 문단(Pericope)을 중심으로 한 신학적 설교 세미나. June 8-9, 선한목자교회',
  keywords: '설교 세미나, 아브라함 쿠루빌라, 성서침례대학원대학교, 2026, bbts',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '설교세미나 2026',
  },
  openGraph: {
    title: '설교 세미나 2026 | 아브라함 쿠루빌라 교수',
    description: 'Christ-iconic 설교 세미나 - June 8-9, 선한목자교회',
    type: 'website',
    images: [
      {
        url: '/og-thumbnail-v2.png',
        width: 1200,
        height: 630,
        alt: '설교 세미나 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '설교 세미나 2026 | 아브라함 쿠루빌라 교수',
    description: 'Christ-iconic 설교 세미나 - June 8-9, 선한목자교회',
    images: ['/og-thumbnail-v2.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#020617', // Match new bg-base
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <AuthProvider>
          <div className="mobile-container">
            {/* Animated neon background elements */}
            <div className="bg-glow-1" />
            <div className="bg-glow-2" />
            <div className="bg-glow-3" />
            <div className="wave-overlay" />

            {children}
            <BottomNavBar />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
