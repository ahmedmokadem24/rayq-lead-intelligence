import Link from "next/link";
import { ArrowUpRight, CalendarClock, Handshake, Search, Send, Target, Trophy, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/Badge";
import { Card, CardHeader } from "@/components/ui";
import { readLeads } from "@/lib/storage";
import { getMetrics, groupBy } from "@/lib/metrics";
import { demoDiscoveredLeads } from "@/lib/discovery/mockData";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const leads = await readLeads();
  const metrics = getMetrics(leads);
  const byCountry = groupBy(leads, "country");
  const byIndustry = groupBy(leads, "industry");
  const byStatus = groupBy(leads, "leadStatus");
  const hotLeads = leads.filter((lead) => ["High", "Very High"].includes(lead.priority)).slice(0, 5);
  const highDiscovery = demoDiscoveredLeads.filter((lead) => lead.priority === "High").length;
  const veryHighDiscovery = demoDiscoveredLeads.filter((lead) => lead.priority === "Very High").length;
  const newBusinesses = demoDiscoveredLeads.filter((lead) => lead.businessStage === "New").length;
  const discoveryCountries = groupValues(demoDiscoveredLeads.map((lead) => lead.country));
  const discoveryIndustries = groupValues(demoDiscoveredLeads.map((lead) => lead.industry));

  return (
    <>
      <PageHeader
        eyebrow="RAYQ Marketing Agency"
        title="Lead intelligence dashboard"
        description="Lead Database stores saved leads you already want to contact. Lead Discovery finds new opportunities for review before saving."
        action={<Link href="/automated-discovery" className="btn btn-primary"><Search size={16} />Run Discovery</Link>}
      />
      <SectionLabel title="Lead Database" description="Saved CRM leads that are already worth contacting." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Total saved leads" helper="Stored in All Leads" value={metrics.total} icon={<Users size={19} />} />
        <Metric label="Contacted" helper="Already reached out" value={metrics.contacted} icon={<Send size={19} />} />
        <Metric label="Calls booked" helper="Audit or sales calls" value={metrics.callsBooked} icon={<CalendarClock size={19} />} />
        <Metric label="Proposals sent" helper="Active sales cycle" value={metrics.proposalsSent} icon={<Handshake size={19} />} />
        <Metric label="Won clients" helper="Closed deals" value={metrics.won} icon={<Trophy size={19} />} />
      </div>
      <SectionLabel title="Lead Discovery" description="New opportunities found by the engine before saving." className="mt-7" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="New opportunities" helper="In review feed" value={demoDiscoveredLeads.length} icon={<Search size={19} />} />
        <Metric label="High priority" helper="Strong fit" value={highDiscovery} icon={<Target size={19} />} />
        <Metric label="Very high priority" helper="Review first" value={veryHighDiscovery} icon={<Target size={19} />} />
        <Metric label="Need review" helper="Not saved yet" value={demoDiscoveredLeads.length} icon={<Users size={19} />} />
        <Metric label="New this week" helper="New businesses found" value={newBusinesses} icon={<CalendarClock size={19} />} />
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Chart title="Leads by country" data={byCountry} />
        <Chart title="Leads by industry" data={byIndustry} />
        <Chart title="Leads by status" data={byStatus} />
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <Ranked title="Best countries to focus on" data={discoveryCountries} />
        <Ranked title="Best industries to focus on" data={discoveryIndustries} />
      </div>
      <Card className="mt-6 p-5 lg:p-6">
        <CardHeader title="Priority pipeline" description="The most valuable opportunities to review next." action={<Link href="/leads" className="btn btn-secondary">All leads <ArrowUpRight size={15} /></Link>} />
        <div className="grid gap-3 lg:grid-cols-2">
          {hotLeads.map((lead) => (
            <Link key={lead.id} href={`/leads/${lead.id}`} className="surface-card surface-card-hover p-4 shadow-none">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-black">{lead.businessName}</p>
                  <p className="mt-1 text-sm text-muted">{lead.industry} · {lead.country} · {lead.assignedFounder}</p>
                </div>
                <Badge value={lead.priority} />
              </div>
              <p className="mt-3 text-sm leading-6 text-linen/72">{lead.personalizedOutreachAngle}</p>
            </Link>
          ))}
        </div>
      </Card>
    </>
  );
}

function SectionLabel({ title, description, className = "" }: { title: string; description: string; className?: string }) {
  return <div className={`mb-3 ${className}`}><h3 className="text-sm font-black uppercase tracking-[0.18em] text-champagne">{title}</h3><p className="mt-1 text-sm text-muted">{description}</p></div>;
}

function Metric({ label, value, icon, helper }: { label: string; value: number | string; icon: React.ReactNode; helper: string }) {
  return (
    <div className="surface-card surface-card-hover p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#f0d18a] to-gold text-ink">{icon}</div>
        <div className="h-2 w-2 rounded-full bg-champagne/80" />
      </div>
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p className="mt-1 text-4xl font-black tracking-tight">{value}</p>
      <p className="mt-2 text-xs font-medium text-muted">{helper}</p>
    </div>
  );
}

function Ranked({ title, data }: { title: string; data: [string, number][] }) {
  return (
    <Card className="p-5">
      <h3 className="font-black">{title}</h3>
      <div className="mt-3 grid gap-2">
        {data.map(([label, value]) => <div key={label} className="flex justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm"><span className="text-linen/75">{label}</span><span className="font-black">{value}</span></div>)}
      </div>
    </Card>
  );
}

function groupValues(values: string[]) {
  const counts = values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function Chart({ title, data }: { title: string; data: Record<string, number> }) {
  const max = Math.max(1, ...Object.values(data));
  return (
    <Card className="p-5">
      <h3 className="mb-4 font-black">{title}</h3>
      <div className="grid gap-3">
        {Object.entries(data).map(([label, value]) => (
          <div key={label}>
            <div className="mb-1.5 flex justify-between text-sm text-linen/72"><span>{label}</span><span className="font-bold text-pearl">{value}</span></div>
            <div className="h-2.5 rounded-full bg-white/8"><div className="h-2.5 rounded-full bg-gradient-to-r from-champagne to-gold" style={{ width: `${(value / max) * 100}%` }} /></div>
          </div>
        ))}
      </div>
    </Card>
  );
}
