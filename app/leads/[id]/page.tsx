import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { LeadDetailClient } from "@/components/LeadDetailClient";
import { readLeads } from "@/lib/storage";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leads = await readLeads();
  const lead = leads.find((item) => item.id === id);
  if (!lead) notFound();

  return (
    <>
      <PageHeader eyebrow="Lead detail" title={lead.businessName} description="Review intelligence, update status, assign ownership, and refine outreach drafts before contacting." />
      <LeadDetailClient lead={lead} />
    </>
  );
}
