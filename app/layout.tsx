import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import { authClient } from '@/lib/auth/client';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MeetOff',
  description: 'Desligue o app, viva o encontro.',
  icons: {
    icon: [
      {
        url: '/meet-off.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/meet-off.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/meet-off.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <NeonAuthUIProvider authClient={authClient}>
          {children}
        </NeonAuthUIProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
