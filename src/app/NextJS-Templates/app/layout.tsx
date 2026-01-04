/**
 * Root Layout
 * Layout chính của ứng dụng
 */
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from 'react-hot-toast';

// Fonts
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-space-grotesk',
});

// Metadata
export const metadata: Metadata = {
  title: {
    default: 'Bloodline DNA - Xét Nghiệm ADN Uy Tín',
    template: '%s | Bloodline DNA',
  },
  description:
    'Dịch vụ xét nghiệm ADN huyết thống, ADN hành chính và pháp lý. Kết quả chính xác, bảo mật tuyệt đối, tư vấn miễn phí.',
  keywords: [
    'xét nghiệm ADN',
    'ADN huyết thống',
    'ADN pháp lý',
    'xét nghiệm quan hệ huyết thống',
    'DNA test Vietnam',
  ],
  authors: [{ name: 'Bloodline DNA' }],
  creator: 'Bloodline DNA',
  publisher: 'Bloodline DNA',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://bloodline-dna.vn',
    siteName: 'Bloodline DNA',
    title: 'Bloodline DNA - Xét Nghiệm ADN Uy Tín',
    description:
      'Dịch vụ xét nghiệm ADN huyết thống, ADN hành chính và pháp lý. Kết quả chính xác, bảo mật tuyệt đối.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bloodline DNA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bloodline DNA - Xét Nghiệm ADN Uy Tín',
    description: 'Dịch vụ xét nghiệm ADN huyết thống, ADN hành chính và pháp lý.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          {/* Main content */}
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

