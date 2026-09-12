import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HK Cafe — Authentic Hong Kong Flavours",
    template: "%s | HK Cafe",
  },
  description:
    "A beloved cha chaan teng serving classic Hong Kong comfort food and iconic milk teas since 1979.",
  keywords: ["HK Cafe", "Hong Kong food", "cha chaan teng", "dim sum", "milk tea", "menu"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "HK Cafe",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              toast: "bg-card border border-border text-foreground",
              success: "border-green-500/30",
              error: "border-red-500/30",
            },
          }}
        />
      </body>
    </html>
  );
}
