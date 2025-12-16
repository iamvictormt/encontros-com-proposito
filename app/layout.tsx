import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

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
    <html lang="pt-BR">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
