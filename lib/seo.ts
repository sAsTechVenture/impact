import { Metadata } from "next";

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  keywords?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

const siteUrl = "https://impactandsolutions.in";
const defaultOgImage = `${siteUrl}/B-F-IMPACT.png`;

export function generateMetadata({
  title,
  description,
  canonical,
  ogImage = defaultOgImage,
  ogType = "website",
  keywords = [],
  noindex = false,
  nofollow = false,
}: SEOProps): Metadata {
  const fullTitle = `${title} | Impact & Solutions`;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    authors: [{ name: "Impact & Solutions" }],
    creator: "Impact & Solutions",
    publisher: "Impact & Solutions",
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: ogType,
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: "Impact & Solutions",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: "@impactsolutions",
      site: "@impactsolutions",
    },
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 5,
    },
    verification: {
      // Add Google Search Console verification when available
      // google: "your-verification-code",
      google: "mRUMmuXSOQkZ5bcwUswmwdZXEDUyOBT9H78zdX9SiFs"
    },
  };
}

export function generateJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Impact & Solutions",
    url: siteUrl,
    logo: `${siteUrl}/B-F-IMPACT.png`,
    description:
      "India's leading company in delivering innovative clean-utility and water-system solutions for pharmaceutical, biotech, and industrial sectors.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Navi Mumbai (Panvel)",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9999999999",
      contactType: "Customer Service",
      email: "connect@impactsolutions.in",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    sameAs: [
      "https://www.facebook.com/impactsolutions",
      "https://www.instagram.com/impactsolutions",
      "https://www.twitter.com/impactsolutions",
      "https://www.linkedin.com/company/impactsolutions",
      "https://www.youtube.com/@impactsolutions",
    ],
    foundingDate: "2018",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: "50-100",
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };
}

