"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Eye, Search, X } from "lucide-react";
import { Badge } from "@/components/Badge";
import { ScoreBadge } from "@/components/ui";
import type { DiscoveredLead } from "@/types/lead";
import { automatedDiscoverySources, businessTypes, countries, industries, servicesToPitch } from "@/lib/constants";

export function AutomatedDiscoveryClient() {
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
        leadSource: body.sourceMode === "DEMO" ? "DEMO mode" : body.sourceMode,
        minimumOpportunityScore: Number(body.minimumOpportunityScore || 0)
      })
    });
    const data = await response.json();
    setResults(data.leads || []);
    setSelected(data.leads?.[0] || null);
    setMessage(
      response.ok
        ? `Found ${data.leads.length} opportunities. Website analysis and scoring completed where data was available.`
        : [data.error, data.code ? `Code: ${data.code}` : "", data.detail ? `Detail: ${data.detail}` : ""].filter(Boolean).join(" ")
    );
    setRunning(false);
  }

  async function saveLead(lead: DiscoveredLead) {
    if (lead.verificationStatus === "Demo data") {
      setMessage("Demo data is for testing only and cannot be saved as a real lead.");
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
    setMessage(`${lead.businessName} ignored.`);
    if (selected?.id === lead.id) setSelected(null);
  }

  return (
    <div className="grid gap-5">
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-5">
          <h3 className="section-title">Automatic Discovery</h3>
          <p className="mt-2 text-sm leading-6 text-muted">Google Places and Search API are the primary automatic sources. They generate lead lists once API keys are connected.</p>
          <div className="mt-4 grid gap-2 text-sm text-linen/72">
            <p>1. Find businesses or launch signals.</p>
            <p>2. Analyze website opportunity where a website is available.</p>
            <p>3. Score RAYQ fit and missing services.</p>
            <p>4. Review, then save selected leads into All Leads.</p>
          </div>
        </div>
        <div className="surface-card p-5">
          <h3 className="section-title">Assisted Social Research</h3>
          <p className="mt-2 text-sm leading-6 text-muted">Instagram, LinkedIn, and Facebook stay manual or CSV-based. No login automation, no unsafe scraping, no invented profiles.</p>
          <Link href="/discovery" className="btn btn-secondary mt-4">Open assisted discovery tools</Link>
        </div>
      </section>

      <form action={run} className="surface-card p-5 lg:p-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="section-title">Run automated discovery</h3>
            <p className="mt-1 text-sm leading-6 text-muted">Use Google Places for real businesses, Search API / SerpAPI for launch signals, or DEMO only for testing.</p>
          </div>
          <button className="btn btn-primary" disabled={running}><Search size={16} />{running ? "Running..." : "Run Discovery"}</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Select name="sourceMode" label="Source selector" options={automatedDiscoverySources} />
          <Select name="country" label="Country" options={["", ...countries]} />
          <Field name="city" label="City" placeholder="Dubai, Cairo, Riyadh..." />
          <Select name="industry" label="Industry" options={["", ...industries]} />
          <Field name="query" label="Keyword" placeholder='e.g. "now open" Dubai clinic' />
          <Select name="businessType" label="Business type" options={["", ...businessTypes]} />
          <Field name="minimumOpportunityScore" label="Minimum opportunity score" type="number" defaultValue="50" />
          <Select name="serviceToPitch" label="Service to pitch" options={["", ...servicesToPitch]} />
        </div>
      </form>

      {message ? <div className="surface-card px-4 py-3 text-sm font-semibold text-linen">{message}</div> : null}

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <section className="surface-card overflow-hidden">
          <div className="border-b border-white/10 p-5">
            <h3 className="section-title">Automated discovery results</h3>
            <p className="mt-1 text-sm text-muted">Unknown fields remain `Not found` or `Needs review`. Outreach stays review-first.</p>
          </div>
          <ResultsTable results={results} selected={selected} setSelected={setSelected} saveLead={saveLead} ignoreLead={ignoreLead} />
        </section>

        <aside className="surface-card p-5">
          <h3 className="section-title">Website and opportunity analysis</h3>
          {selected ? <AnalysisPanel lead={selected} /> : <p className="mt-4 text-sm leading-6 text-muted">Select Analyze to review field confidence, website scores, missing services, and outreach angle.</p>}
        </aside>
      </div>
    </div>
  );
}

function ResultsTable({
  results,
  setSelected,
  saveLead,
  ignoreLead
}: {
  results: DiscoveredLead[];
  selected: DiscoveredLead | null;
  setSelected: (lead: DiscoveredLead) => void;
  saveLead: (lead: DiscoveredLead) => void;
  ignoreLead: (lead: DiscoveredLead) => void;
}) {
  return (
    <div className="table-scroll overflow-x-auto">
      <table className="min-w-[1760px] w-full text-left text-sm">
        <thead className="bg-black/22 text-xs uppercase tracking-[0.16em] text-muted">
          <tr>
            <th className="px-4 py-3">Business</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Signal</th>
            <th className="px-4 py-3">Market</th>
            <th className="px-4 py-3">Verification</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Score</th>
            <th className="px-4 py-3">Missing services</th>
            <th className="px-4 py-3">Best pitch</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/8">
          {results.map((lead) => (
            <tr key={lead.id} className="transition hover:bg-white/[0.045]">
              <td className="px-4 py-4">
                <p className="font-black text-pearl">{displayValue(lead.businessName)}</p>
                <p className="mt-1 text-xs text-muted">Website: {displayValue(lead.website)}</p>
                <p className="mt-1 text-xs text-muted">Maps/source: {displayValue(lead.googleMapsUrl !== "Not found" ? lead.googleMapsUrl : lead.sourceUrl || "Not found")}</p>
              </td>
              <td className="px-4 py-4 text-linen/75">{lead.source}</td>
              <td className="px-4 py-4 text-linen/75">{displayValue(lead.launchSignal || "Not found")}<p className="mt-1 text-xs text-muted">{lead.signalType || "Needs review"}</p></td>
              <td className="px-4 py-4 text-linen/75">{displayValue(lead.country)} · {displayValue(lead.city)}<p className="mt-1 text-xs text-muted">{displayValue(lead.category)}</p></td>
              <td className="px-4 py-4"><Badge value={lead.verificationStatus} /><p className="mt-1 text-xs text-muted">{lead.dataConfidenceScore}% data confidence</p></td>
              <td className="px-4 py-4 text-linen/75">Phone: {displayValue(lead.phone)}<br />Email: {displayValue(lead.contactEmail)}<p className="mt-1"><Badge value={lead.contactDataQuality} /></p></td>
              <td className="px-4 py-4"><ScoreBadge score={lead.opportunityScore} /></td>
              <td className="px-4 py-4 text-linen/75">{lead.missingOpportunities.join(", ")}</td>
              <td className="px-4 py-4 text-linen/75">{lead.bestRayqServiceToPitch}<p className="mt-1 text-xs text-muted">{lead.suggestedOutreachAngle}</p></td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-primary h-9 px-3 disabled:opacity-50" disabled={lead.verificationStatus === "Demo data"} onClick={() => saveLead(lead)}><Check size={14} />Save</button>
                  <button className="btn btn-secondary h-9 px-3" onClick={() => ignoreLead(lead)}><X size={14} />Ignore</button>
                  <button className="btn btn-ghost h-9 px-3" onClick={() => setSelected(lead)}><Eye size={14} />Analyze</button>
                </div>
              </td>
            </tr>
          ))}
          {!results.length ? <tr><td colSpan={10} className="px-4 py-12 text-center text-muted">Run Google Places, Search API / SerpAPI, or DEMO discovery to see results.</td></tr> : null}
        </tbody>
      </table>
    </div>
  );
}

function AnalysisPanel({ lead }: { lead: DiscoveredLead }) {
  return (
    <div className="mt-4 grid gap-4">
      <div>
        <p className="text-xl font-black">{displayValue(lead.businessName)}</p>
        <p className="mt-1 text-sm text-muted">{lead.diagnosis.personalizedAuditAngle}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          ["Website", lead.websiteQualityScore],
          ["CRO", lead.croOpportunityScore],
          ["Paid ads", lead.paidAdsOpportunityScore],
          ["Content", lead.contentOpportunityScore],
          ["Tracking", lead.trackingOpportunityScore],
          ["RAYQ fit", lead.overallRayqFitScore]
        ].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-3"><p className="text-xs text-muted">{label}</p><p className="mt-1 text-2xl font-black">{value}<span className="text-xs text-muted">/10</span></p></div>)}
      </div>
      <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
        <p className="mb-2 font-black text-champagne">Field confidence</p>
        <div className="grid gap-1 text-xs text-linen/72">
          {Object.entries(lead.fieldConfidence).map(([field, confidence]) => <div key={field} className="flex justify-between gap-3"><span>{field}</span><span>{confidence}%</span></div>)}
        </div>
      </div>
      <Block title="What they are missing" value={lead.diagnosis.whatTheyAreMissing} />
      <Block title="What RAYQ can do" value={lead.diagnosis.whatRayqCanDo} />
      <Block title="Suggested outreach" value={lead.diagnosis.suggestedFirstMessage} />
    </div>
  );
}

function Block({ title, value }: { title: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm leading-6 text-linen/72"><p className="mb-1 font-black text-champagne">{title}</p><p>{value}</p></div>;
}

function displayValue(value: string) {
  return value && value !== "Not found" ? value : "Not found";
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...rest } = props;
  return <label className="field-label">{label}<input className="field-control" {...rest} /></label>;
}

function Select({ label, name, options }: { label: string; name: string; options: readonly string[] }) {
  return <label className="field-label">{label}<select name={name} className="field-control">{options.map((option) => <option key={option} value={option}>{option || "Any"}</option>)}</select></label>;
}
