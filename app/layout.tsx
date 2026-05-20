import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster as SonnerToaster } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

import { LoadingProvider } from "@/providers/loading-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { BottomNav } from "@/components/bottom-nav";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MeetOff",
  description: "Desligue o app, viva o encontro.",
  icons: {
    icon: [
      {
        url: "/meet-off.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/meet-off.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/meet-off.png",
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
        <LoadingProvider>
          <AuthProvider>
            {children}
            <BottomNav />
            <Analytics />
            <Toaster />
            <SonnerToaster position="top-center" richColors />
          </AuthProvider>
        </LoadingProvider>
        <Script
          src="https://www.mercadopago.com/v2/security.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
