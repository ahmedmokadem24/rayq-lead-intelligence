import { PageHeader } from "@/components/PageHeader";
import { AutomatedDiscoveryClient } from "@/components/AutomatedDiscoveryClient";

export default function AutomatedDiscoveryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Automated Discovery"
        title="Generate real lead lists from approved sources"
        description="Run Google Places or Search API discovery, analyze websites where available, score opportunities, and save selected verified leads into All Leads."
      />
      <AutomatedDiscoveryClient />
    </>
  );
}
