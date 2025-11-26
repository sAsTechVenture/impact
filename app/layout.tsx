import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/common";
import { generateMetadata as generateSEOMetadata, generateJsonLd } from "@/lib/seo";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...generateSEOMetadata({
    title: "Home",
    description:
      "Impact & Solutions - India's leading provider of clean-utility and water-system critical products. Exclusive distributor serving pharmaceutical, biotech, and industrial sectors with world-class solutions since 2018.",
    canonical: "/",
    keywords: [
      "clean utility systems",
      "water system products",
      "pharmaceutical water systems",
      "TOC analyzers",
      "POU coolers",
      "heat exchangers",
      "particle counters",
      "water purification India",
      "pharma water systems",
      "biotech clean utilities",
    ],
  }),
  icons: {
    icon: [
      { url: "/Logo-redraw-white.png", sizes: "32x32", type: "image/png" },
      { url: "/Logo-redraw-white.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/Logo-redraw-white.png",
    apple: "/Logo-redraw-white.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#234C90",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = generateJsonLd();

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
