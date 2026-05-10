import Link from "next/link";
import { Download, RefreshCw, Save, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/Badge";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, ScoreBadge } from "@/components/ui";
import { demoDiscoveredLeads } from "@/lib/discovery/mockData";

export default function OpportunityFeedPage() {
  const high = demoDiscoveredLeads.filter((lead) => lead.priority === "High");
  const veryHigh = demoDiscoveredLeads.filter((lead) => lead.priority === "Very High");
  const newBusinesses = demoDiscoveredLeads.filter((lead) => lead.businessStage === "New");
  const midWeak = demoDiscoveredLeads.filter((lead) => lead.businessStage === "Mid-sized");
  const bestCountries = group(demoDiscoveredLeads.map((lead) => lead.country));
  const bestIndustries = group(demoDiscoveredLeads.map((lead) => lead.industry));

  return (
    <>
      <PageHeader
        eyebrow="Opportunity Feed"
        title="Markets and leads worth reviewing"
        description="A discovery command center for new opportunities before they become saved CRM leads."
        action={<Link href="/automated-discovery" className="btn btn-primary"><Search size={16} />Run Discovery</Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <FeedMetric label="New opportunities" value={demoDiscoveredLeads.length} helper="Demo opportunities available" />
        <FeedMetric label="High priority" value={high.length} helper="Strong RAYQ fit" />
        <FeedMetric label="Very high priority" value={veryHigh.length} helper="Review first" />
        <FeedMetric label="Need review" value={demoDiscoveredLeads.length} helper="Not saved yet" />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link href="/automated-discovery" className="btn btn-primary"><Search size={16} />Run Discovery</Link>
        <Link className="btn btn-secondary" href="/automated-discovery"><RefreshCw size={16} />Refresh Opportunities</Link>
        <Link className="btn btn-secondary" href="/automated-discovery"><Sparkles size={16} />Analyze Websites</Link>
        <Link className="btn btn-secondary" href="/automated-discovery"><Save size={16} />Save High Priority Leads</Link>
        <a className="btn btn-secondary" href="/api/discovery/export"><Download size={16} />Export Opportunities</a>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden">
          <div className="p-5">
            <CardHeader title="Recently analyzed opportunities" description="Demo feed from approved-source placeholders." />
          </div>
          <div className="table-scroll overflow-x-auto">
            <table className="min-w-[920px] w-full text-left text-sm">
              <thead className="bg-black/22 text-xs uppercase tracking-[0.16em] text-muted">
                <tr>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Review angle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {demoDiscoveredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.045]">
                    <td className="px-4 py-4 font-black text-pearl">{lead.businessName}<p className="mt-1 text-xs font-medium text-muted">{lead.country} · {lead.city} · {lead.industry}</p></td>
                    <td className="px-4 py-4"><Badge value={lead.businessStage} /></td>
                    <td className="px-4 py-4"><ScoreBadge score={lead.opportunityScore} /></td>
                    <td className="px-4 py-4 text-linen/75">{lead.bestRayqServiceToPitch}</td>
                    <td className="px-4 py-4 text-linen/75">{lead.suggestedOutreachAngle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid content-start gap-4">
          <FocusCard title="New businesses" value={newBusinesses.length} detail="Good timing for launch support and fast funnel setup." />
          <FocusCard title="Mid-sized weak marketing" value={midWeak.length} detail="Best fit for CRO, tracking, paid media, and dashboards." />
          <ListCard title="Best countries to focus on" data={bestCountries} />
          <ListCard title="Best industries to focus on" data={bestIndustries} />
        </div>
      </div>
    </>
  );
}

function FeedMetric({ label, value, helper }: { label: string; value: number; helper: string }) {
  return <div className="surface-card surface-card-hover p-5"><p className="text-sm font-semibold text-muted">{label}</p><p className="mt-1 text-4xl font-black">{value}</p><p className="mt-2 text-xs text-muted">{helper}</p></div>;
}

function FocusCard({ title, value, detail }: { title: string; value: number; detail: string }) {
  return <Card className="p-5"><p className="text-sm font-semibold text-muted">{title}</p><p className="mt-1 text-3xl font-black">{value}</p><p className="mt-2 text-sm leading-6 text-linen/72">{detail}</p></Card>;
}

function ListCard({ title, data }: { title: string; data: [string, number][] }) {
  return <Card className="p-5"><h3 className="font-black">{title}</h3><div className="mt-3 grid gap-2">{data.map(([label, value]) => <div key={label} className="flex justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm"><span className="text-linen/75">{label}</span><span className="font-black">{value}</span></div>)}</div></Card>;
}

function group(values: string[]) {
  const counts = values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}
