import { PageHeader } from "@/components/PageHeader";
import { DiscoveryClient } from "@/components/DiscoveryClient";

export default function LeadDiscoveryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Lead Discovery"
        title="Assisted social and manual discovery"
        description="Use this area for manual Instagram, LinkedIn, Facebook, website lists, and approved CSV inputs. For automatic lead generation, use Automated Discovery."
      />
      <DiscoveryClient />
    </>
  );
}
