import type { Metadata } from "next";
import { IBM_Plex_Mono, Playfair_Display, Public_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "SA–Türkiye Sovereign AI & Digital Trade Sandbox",
  description:
    "Phase 1 proof-of-concept: TR↔EN diplomatic policy intelligence, cryptographically verifiable bulletins (SHA-256 + Ed25519 PKI), and cross-border SMME trade matching under AfCFTA guidelines.",
  keywords: [
    "South Africa",
    "Türkiye",
    "sovereign AI",
    "digital trade",
    "AfCFTA",
    "information integrity",
    "PKI verification",
    "SMME matching",
  ],
  authors: [{ name: "Business Hustle — Simple Eternity Holdings (Pty) Ltd" }],
  openGraph: {
    title: "SA–Türkiye Sovereign AI & Digital Trade Sandbox",
    description:
      "Bridging diplomatic strategy and private-sector trade execution: policy NLP, verifiable bulletins, and bilateral SMME matching.",
    siteName: "Sovereign AI & Digital Trade Sandbox",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${publicSans.variable} ${plexMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
