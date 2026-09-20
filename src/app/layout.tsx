import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
