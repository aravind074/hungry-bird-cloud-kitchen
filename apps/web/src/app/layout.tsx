import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Toaster } from 'react-hot-toast';
import CartDrawer from '@/components/shared/CartDrawer';

export const metadata: Metadata = {
  title: {
    default: 'Hungry Bird – AI Powered Cloud Kitchen',
    template: '%s | Hungry Bird',
  },
  description: 'Fresh, healthy meals delivered to your doorstep. Personalised by AI, crafted by chefs. Subscribe to daily Breakfast, Lunch, or Dinner.',
  keywords: ['cloud kitchen', 'food delivery', 'meal subscription', 'healthy food', 'AI recommendations', 'tiffin service'],
  authors: [{ name: 'Hungry Bird Team' }],
  creator: 'Hungry Bird',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://hungrybird.in',
    title: 'Hungry Bird – AI Powered Cloud Kitchen',
    description: 'Fresh, healthy meals delivered daily. Subscribe to Breakfast, Lunch, or Dinner.',
    siteName: 'Hungry Bird',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hungry Bird – AI Powered Cloud Kitchen',
    description: 'Fresh, healthy meals delivered daily.',
    creator: '@hungrybird_in',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f97316' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white antialiased">
        <Providers>
          {children}
          <CartDrawer />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg, #fff)',
                color: 'var(--toast-color, #1a1a2e)',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 10px 40px -5px rgba(0,0,0,0.15)',
                border: '1px solid rgba(249, 115, 22, 0.2)',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: '500',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
