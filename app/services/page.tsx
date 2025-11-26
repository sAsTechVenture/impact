import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import UnderConstruction from "@/components/common/UnderConstruction";

export const metadata: Metadata = generateSEOMetadata({
  title: "Services",
  description:
    "Comprehensive clean-utility and water-system services from Impact & Solutions. Annual maintenance, calibration, validation, operation & maintenance, breakdown support, training programs, and spare parts supply for pharmaceutical and industrial sectors.",
  canonical: "/services",
  keywords: [
    "clean utility services",
    "water system maintenance",
    "calibration services",
    "validation services",
    "AMC services",
    "breakdown support",
    "pharmaceutical maintenance",
    "water system calibration",
    "technical training",
    "spare parts supply",
  ],
});

export default function ServicesPage() {
  return (
    <main>
      <UnderConstruction
        title="Services"
        description="We're crafting an exceptional service experience for you. Our detailed service offerings will be available shortly!"
      />
    </main>
  );
}

