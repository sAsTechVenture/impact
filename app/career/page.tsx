import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import UnderConstruction from "@/components/common/UnderConstruction";

export const metadata: Metadata = generateSEOMetadata({
  title: "Career Opportunities",
  description:
    "Join Impact & Solutions and build your career in clean-utility and water-system solutions. Explore exciting career opportunities in engineering, sales, technical support, and project management.",
  canonical: "/career",
  keywords: [
    "careers at Impact & Solutions",
    "water system jobs",
    "pharmaceutical equipment jobs",
    "engineering careers",
    "technical support jobs",
    "clean utility careers",
    "job opportunities India",
  ],
});

export default function CareerPage() {
  return (
    <main>
      <UnderConstruction
        title="Career Opportunities"
        description="We're building an amazing careers page. Join us in shaping the future! Check back soon for exciting opportunities."
      />
    </main>
  );
}

