import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import UnderConstruction from "@/components/common/UnderConstruction";

export const metadata: Metadata = generateSEOMetadata({
  title: "Events & News",
  description:
    "Stay updated with Impact & Solutions' latest events, news, and industry updates. Discover our participation in pharmaceutical exhibitions, technical conferences, and company milestones.",
  canonical: "/events",
  keywords: [
    "Impact & Solutions events",
    "pharmaceutical exhibitions",
    "water system conferences",
    "clean utility events",
    "industry news",
    "company updates",
    "technical conferences",
  ],
});

export default function EventsPage() {
  return (
    <main>
      <UnderConstruction
        title="Events & News"
        description="Stay tuned! We're preparing to share our latest events, news, and updates with you. Coming soon!"
      />
    </main>
  );
}

