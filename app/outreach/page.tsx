import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui";
import { generateOutreach } from "@/lib/outreach";
import { readLeads } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function OutreachPage() {
  const leads = await readLeads();
  return (
    <>
      <PageHeader eyebrow="Drafts" title="Outreach drafts" description="Review-ready LinkedIn, Instagram, email, WhatsApp, follow-up, and audit invitation drafts for each lead." />
      <div className="grid gap-4">
        {leads.map((lead) => {
          const drafts = generateOutreach(lead);
          return (
            <Card key={lead.id} className="p-5 lg:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black tracking-tight">{lead.businessName}</h3>
                  <p className="mt-1 text-sm text-muted">{lead.personalizedOutreachAngle}</p>
                </div>
                <Link className="btn btn-secondary" href={`/leads/${lead.id}`}>Open lead</Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {Object.entries(drafts).map(([key, value]) => (
                  <div key={key} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="mb-2 text-sm font-black capitalize text-champagne">{key.replace(/([A-Z])/g, " $1")}</p>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-linen/72">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
