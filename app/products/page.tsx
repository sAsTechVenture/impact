import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import UnderConstruction from "@/components/common/UnderConstruction";

export const metadata: Metadata = generateSEOMetadata({
  title: "Products",
  description:
    "Explore Impact & Solutions' comprehensive product portfolio: TOC analyzers, POU coolers, heat exchangers, particle counters, microbial air samplers, and filter integrity testers for pharmaceutical and industrial applications.",
  canonical: "/products",
  keywords: [
    "TOC analyzers",
    "POU coolers",
    "heat exchangers",
    "particle counters",
    "microbial air samplers",
    "filter integrity testers",
    "water purification equipment",
    "pharmaceutical equipment",
    "clean utility products",
    "water system products",
  ],
});

export default function ProductsPage() {
  return (
    <main>
      <UnderConstruction
        title="Products"
        description="Our innovative product catalog is being prepared. Check back soon to explore our comprehensive range of solutions!"
      />
    </main>
  );
}

