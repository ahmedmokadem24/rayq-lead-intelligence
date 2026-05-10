import { PageHeader } from "@/components/PageHeader";
import { LeadTable } from "@/components/LeadTable";
import { readLeads } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await readLeads();
  return (
    <>
      <PageHeader
        eyebrow="Database"
        title="All leads"
        description="Filter by founder, status, country, industry, priority, and follow-up date. Open any lead to edit intelligence and outreach drafts."
      />
      <LeadTable leads={leads} />
    </>
  );
}
