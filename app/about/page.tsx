import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import AboutPageClient from "./about-client";

export const metadata: Metadata = generateSEOMetadata({
  title: "About Us",
  description:
    "Learn about Impact & Solutions - India's leading clean-utility and water-system solutions provider. Founded in 2018, we serve pharmaceutical, biotech, and industrial sectors with world-class technology and comprehensive support services.",
  canonical: "/about",
  keywords: [
    "about Impact & Solutions",
    "clean utility company India",
    "water system solutions",
    "pharmaceutical water systems",
    "company history",
    "mission vision",
    "core values",
    "trusted pharma partners",
  ],
});

export default function AboutPage() {
  return <AboutPageClient />;
}
