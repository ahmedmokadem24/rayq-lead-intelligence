import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/Badge";
import { ScoreBadge } from "@/components/ui";
import { readLeads } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const leads = (await readLeads()).filter((lead) => lead.nextFollowUpDate).sort((a, b) => a.nextFollowUpDate.localeCompare(b.nextFollowUpDate));
  return (
    <>
      <PageHeader eyebrow="Follow-up calendar" title="Next actions" description="A simple review queue for founder-owned follow-ups. Messages are drafts only until manually reviewed and sent." />
      <div className="grid gap-3">
        {leads.map((lead) => (
          <Link key={lead.id} href={`/leads/${lead.id}`} className="surface-card surface-card-hover grid gap-3 p-4 md:grid-cols-[150px_1fr_auto] md:items-center">
            <div className="font-black text-champagne">{lead.nextFollowUpDate}</div>
            <div>
              <p className="font-black">{lead.businessName}</p>
              <p className="mt-1 text-sm text-muted">{lead.assignedFounder} · {lead.country} · {lead.industry}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ScoreBadge score={lead.leadScore} />
              <Badge value={lead.leadStatus} />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
