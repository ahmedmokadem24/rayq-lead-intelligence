"use client";

import { useState } from "react";
import { AnalyzerResult } from "@/types/lead";

export function AnalyzerClient() {
  const [result, setResult] = useState<AnalyzerResult | null>(null);

  async function analyze(formData: FormData) {
    const body = Object.fromEntries(formData.entries());
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    setResult(await response.json());
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[460px_1fr]">
      <form action={analyze} className="surface-card p-5 lg:p-6">
        <h3 className="section-title">Research input</h3>
        <p className="mb-5 mt-1 text-sm text-muted">Paste observations from approved public research.</p>
        <Field name="businessName" label="Business Name" />
        <Field name="website" label="Website URL" />
        <Field name="instagram" label="Instagram or LinkedIn URL" />
        <Field name="country" label="Country" />
        <Field name="industry" label="Industry" />
        <label className="field-label mt-4">
          Research Notes
          <textarea name="notes" rows={8} className="field-control" placeholder="Paste public observations: outdated site, weak CTAs, no WhatsApp, unclear tracking, weak creatives..." />
        </label>
        <button className="btn btn-primary mt-5">Analyze opportunity</button>
      </form>
      <section className="surface-card p-5 lg:p-6">
        {result ? (
          <div>
            <div className="grid gap-3 md:grid-cols-4">
              <Score label="Website" value={result.websiteQualityScore} />
              <Score label="CRO Opportunity" value={result.croOpportunityScore} />
              <Score label="Paid Ads Opportunity" value={result.paidAdsOpportunityScore} />
              <Score label="Lead Score" value={result.score} suffix="/100" />
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-4">
              <Score label="Content Opportunity" value={result.contentOpportunityScore} />
              <Score label="Tracking Opportunity" value={result.trackingOpportunityScore} />
              <Score label="Overall RAYQ Fit" value={result.overallRayqFitScore} />
              <Score label="Social Opportunity" value={result.socialContentOpportunityScore} />
            </div>
            {result.tags.length ? <div className="mt-5 flex flex-wrap gap-2">{result.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-bold text-linen">{tag}</span>)}</div> : null}
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <List title="Main problems found" items={result.mainProblems} />
              <List title="What RAYQ can offer" items={result.rayqOffers} />
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
              <h3 className="font-bold">Suggested first outreach</h3>
              <p className="mt-2 text-sm leading-6 text-linen/72">{result.suggestedFirstOutreach}</p>
            </div>
          </div>
        ) : (
          <div className="grid h-full min-h-[420px] place-items-center text-center text-muted">
            <p>Enter public business information and notes to generate an ethical lead audit summary.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ label, name }: { label: string; name: string }) {
  return <label className="field-label mt-4 first:mt-0">{label}<input name={name} className="field-control" /></label>;
}

function Score({ label, value, suffix = "/10" }: { label: string; value: number; suffix?: string }) {
  return <div className="rounded-2xl border border-white/10 bg-black/25 p-4"><p className="text-sm text-muted">{label}</p><p className="mt-1 text-3xl font-black">{value}<span className="text-sm text-muted">{suffix}</span></p></div>;
}

function List({ title, items }: { title: string; items: string[] }) {
  return <div><h3 className="font-bold">{title}</h3><ul className="mt-3 grid gap-2 text-sm leading-6 text-linen/72">{items.map((item) => <li key={item} className="rounded-xl border border-white/8 bg-black/20 px-3 py-2">{item}</li>)}</ul></div>;
}
