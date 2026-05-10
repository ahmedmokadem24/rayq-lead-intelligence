import { PageHeader } from "@/components/PageHeader";
import { AnalyzerClient } from "@/components/AnalyzerClient";

export default function AnalyzerPage() {
  return (
    <>
      <PageHeader eyebrow="Research" title="Lead analyzer" description="Analyze websites or business notes using transparent heuristics. No scraping, no spam, and no platform-term violations." />
      <AnalyzerClient />
    </>
  );
}
