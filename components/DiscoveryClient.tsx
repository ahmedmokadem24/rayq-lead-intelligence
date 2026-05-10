"use client";

import { useState } from "react";
import { Check, Eye, Search, X } from "lucide-react";
import { Badge } from "@/components/Badge";
import { ScoreBadge } from "@/components/ui";
import { businessStages, type DiscoveredLead } from "@/types/lead";
import { businessTypes, countries, industries, leadSources, servicesToPitch } from "@/lib/constants";

export function DiscoveryClient() {
  const [results, setResults] = useState<DiscoveredLead[]>([]);
  const [selected, setSelected] = useState<DiscoveredLead | null>(null);
  const [message, setMessage] = useState("");
  const [running, setRunning] = useState(false);

  async function run(formData: FormData) {
    setRunning(true);
    setMessage("");
    const body = Object.fromEntries(formData.entries());
    const response = await fetch("/api/discovery/run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...body,
        minimumOpportunityScore: Number(body.minimumOpportunityScore || 0)
      })
    });
    const data = await response.json();
    setResults(data.leads || []);
    setSelected(data.leads?.[0] || null);
    setMessage(
      response.ok
        ? `Found ${data.leads.length} review-ready opportunities.`
        : [data.error, data.code ? `Code: ${data.code}` : "", data.detail ? `Detail: ${data.detail}` : ""].filter(Boolean).join(" ")
    );
    setRunning(false);
  }

  async function saveLead(lead: DiscoveredLead) {
    if (lead.verificationStatus === "Demo data") {
      setMessage("Demo data is for workflow testing only. Run Google Places or add a verified manual source before saving.");
      return;
    }

    const response = await fetch("/api/discovery/save", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(lead)
    });
    if (response.ok) {
      setResults((current) => current.filter((item) => item.id !== lead.id));
      setMessage(`${lead.businessName} saved to All Leads.`);
      if (selected?.id === lead.id) setSelected(null);
    }
  }

  function ignoreLead(lead: DiscoveredLead) {
    setResults((current) => current.filter((item) => item.id !== lead.id));
    setMessage(`${lead.businessName} ignored for now.`);
    if (selected?.id === lead.id) setSelected(null);
  }

  return (
    <div className="grid gap-5">
      <form action={run} className="surface-card p-5 lg:p-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="section-title">Discovery filters</h3>
            <p className="mt-1 text-sm leading-6 text-muted">Use verified Google Places data when an API key is configured. Demo mode is clearly labeled and never includes fake contact details.</p>
          </div>
          <button className="btn btn-primary" disabled={running}>
            <Search size={16} />
            {running ? "Running..." : "Run Discovery"}
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Select name="country" label="Country" options={["", ...countries]} />
          <Field name="city" label="City" placeholder="Dubai, Cairo, Riyadh..." />
          <Select name="industry" label="Industry" options={["", ...industries]} />
          <Select name="businessType" label="Business type" options={["", ...businessTypes]} />
          <Select name="businessStage" label="Business stage" options={["", ...businessStages]} />
          <Select name="leadSource" label="Lead source" options={["", ...leadSources]} />
          <Field name="minimumOpportunityScore" label="Minimum opportunity score" type="number" defaultValue="60" />
          <Select name="serviceToPitch" label="Service to pitch" options={["", ...servicesToPitch]} />
          <Field name="query" label="Google/search query" placeholder="furniture stores, clinics, restaurants..." />
          <Field name="instagramUrl" label="Manual Instagram URL" placeholder="Paste manually verified URL" />
          <Field name="linkedInUrl" label="Manual LinkedIn URL" placeholder="Paste manually verified URL" />
          <label className="field-label md:col-span-2">
            Website URL paste list
            <textarea name="websiteList" className="field-control" placeholder="One manually collected website URL per line" />
          </label>
        </div>
      </form>

      {message ? <div className="surface-card px-4 py-3 text-sm font-semibold text-linen">{message}</div> : null}

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <section className="surface-card overflow-hidden">
          <div className="border-b border-white/10 p-5">
            <h3 className="section-title">Discovery review table</h3>
            <p className="mt-1 text-sm text-muted">These are not saved leads yet. Review, save, ignore, or analyze more.</p>
          </div>
          <div className="table-scroll overflow-x-auto">
            <table className="min-w-[1680px] w-full text-left text-sm">
              <thead className="bg-black/22 text-xs uppercase tracking-[0.16em] text-muted">
                <tr>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Market</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Verification</th>
                  <th className="px-4 py-3">Data quality</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Opportunity type</th>
                  <th className="px-4 py-3">Missing opportunities</th>
                  <th className="px-4 py-3">Best pitch</th>
                  <th className="px-4 py-3">Best channel</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {results.map((lead) => (
                  <tr key={lead.id} className="transition hover:bg-white/[0.045]">
                    <td className="px-4 py-4">
                      <p className="font-black text-pearl">{lead.businessName}</p>
                      <p className="mt-1 text-xs text-muted">Website: {displayValue(lead.website)} · Confidence {lead.fieldConfidence.website}%</p>
                      <p className="mt-1 text-xs text-muted">Maps: {displayValue(lead.googleMapsUrl)}</p>
                    </td>
                    <td className="px-4 py-4 text-linen/75">{displayValue(lead.country)} · {displayValue(lead.city)}<br />{lead.industry}<p className="mt-1 text-xs text-muted">{displayValue(lead.address)}</p></td>
                    <td className="px-4 py-4"><Badge value={lead.businessStage} /></td>
                    <td className="px-4 py-4 text-linen/75">{lead.source}</td>
                    <td className="px-4 py-4"><Badge value={lead.verificationStatus} /><p className="mt-1 text-xs text-muted">{lead.dataConfidenceScore}% confidence</p></td>
                    <td className="px-4 py-4"><Badge value={lead.contactDataQuality} /></td>
                    <td className="px-4 py-4"><ScoreBadge score={lead.opportunityScore} /></td>
                    <td className="px-4 py-4 text-linen/75">{lead.opportunityType.join(", ")}</td>
                    <td className="px-4 py-4 text-linen/75">{lead.missingOpportunities.slice(0, 3).join(", ")}</td>
                    <td className="px-4 py-4 text-linen/75">{lead.bestRayqServiceToPitch}<p className="mt-1 text-xs text-muted">{lead.suggestedOutreachAngle}</p></td>
                    <td className="px-4 py-4"><Badge value={lead.bestOutreachChannel} /></td>
                    <td className="px-4 py-4 text-linen/75">Email: {displayValue(lead.contactEmail)} · {lead.fieldConfidence.email}%<br />Phone: {displayValue(lead.phone)} · {lead.fieldConfidence.phone}%</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button className="btn btn-primary h-9 px-3 disabled:opacity-50" disabled={lead.verificationStatus === "Demo data"} onClick={() => saveLead(lead)}><Check size={14} />Save</button>
                        <button className="btn btn-secondary h-9 px-3" onClick={() => ignoreLead(lead)}><X size={14} />Ignore</button>
                        <button className="btn btn-ghost h-9 px-3" onClick={() => setSelected(lead)}><Eye size={14} />Analyze</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!results.length ? (
                  <tr>
                    <td colSpan={13} className="px-4 py-12 text-center text-muted">Choose a source and run discovery. Use DEMO mode only for workflow testing.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="surface-card p-5">
          <h3 className="section-title">Analyze more</h3>
          {selected ? (
            <div className="mt-4 grid gap-4">
              <div>
                <p className="text-xl font-black">{selected.businessName}</p>
                <p className="mt-1 text-sm text-muted">{selected.suggestedOutreachAngle}</p>
              </div>
              <ScoreGrid lead={selected} />
              <ConfidenceGrid lead={selected} />
              <Diagnosis lead={selected} />
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-muted">Select Analyze More on a discovered lead to review website scores, tags, diagnosis, and first-message angle.</p>
          )}
        </aside>
      </div>
    </div>
  );
}

function displayValue(value: string) {
  return value && value !== "Not found" ? value : "Not found";
}

function ScoreGrid({ lead }: { lead: DiscoveredLead }) {
  const rows = [
    ["Website", lead.websiteQualityScore],
    ["CRO", lead.croOpportunityScore],
    ["Paid ads", lead.paidAdsOpportunityScore],
    ["Content", lead.contentOpportunityScore],
    ["Tracking", lead.trackingOpportunityScore],
    ["RAYQ fit", lead.overallRayqFitScore]
  ];
  return <div className="grid grid-cols-2 gap-2">{rows.map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-3"><p className="text-xs text-muted">{label}</p><p className="mt-1 text-2xl font-black">{value}<span className="text-xs text-muted">/10</span></p></div>)}</div>;
}

function ConfidenceGrid({ lead }: { lead: DiscoveredLead }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="mb-2 font-black text-champagne">Field confidence</p>
      <div className="grid gap-1 text-xs text-linen/72">
        {Object.entries(lead.fieldConfidence).map(([field, confidence]) => (
          <div key={field} className="flex justify-between gap-3"><span>{field}</span><span>{confidence}%</span></div>
        ))}
      </div>
    </div>
  );
}

function Diagnosis({ lead }: { lead: DiscoveredLead }) {
  const diagnosis = lead.diagnosis;
  return (
    <div className="grid gap-3 text-sm leading-6 text-linen/72">
      <TagList tags={lead.tags} />
      <Block title="What they are missing" value={diagnosis.whatTheyAreMissing} />
      <Block title="Why it matters" value={diagnosis.whyItMatters} />
      <Block title="What RAYQ can do" value={diagnosis.whatRayqCanDo} />
      <Block title="Estimated impact" value={diagnosis.estimatedImpact} />
      <Block title="Why now" value={diagnosis.whyNow} />
      <Block title="Suggested first message" value={diagnosis.suggestedFirstMessage} />
    </div>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return <div className="flex flex-wrap gap-2">{tags.map((tag) => <Badge key={tag} value={tag} />)}</div>;
}

function Block({ title, value }: { title: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-black/20 p-3"><p className="mb-1 font-black text-champagne">{title}</p><p>{value}</p></div>;
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...rest } = props;
  return <label className="field-label">{label}<input className="field-control" {...rest} /></label>;
}

function Select({ label, name, options }: { label: string; name: string; options: readonly string[] }) {
  return <label className="field-label">{label}<select name={name} className="field-control">{options.map((option) => <option key={option} value={option}>{option || "Any"}</option>)}</select></label>;
}
