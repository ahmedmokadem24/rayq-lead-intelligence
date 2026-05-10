"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Card, CardHeader, ScoreBadge } from "@/components/ui";
import { countries, industries, businessTypes } from "@/lib/constants";
import type { Lead } from "@/types/lead";
import { founders, leadStatuses } from "@/types/lead";

export function LeadDetailClient({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(lead);

  function update(key: keyof Lead, value: string) {
    setDraft((current) => ({ ...current, [key]: key.includes("Score") || key === "leadScore" ? Number(value) : value }));
  }

  async function save() {
    setSaving(true);
    await fetch(`/api/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(draft)
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
      <section className="grid gap-5">
        <Card className="p-5 lg:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-champagne">Opportunity summary</p>
              <h3 className="mt-2 text-2xl font-black tracking-tight">{draft.businessName}</h3>
              <p className="mt-2 text-sm text-muted">{draft.industry} · {draft.businessType} · {draft.country} · {draft.city || "No city"}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ScoreBadge score={draft.leadScore} />
              <Badge value={draft.priority} />
              <Badge value={draft.leadStatus} />
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Mini label="Founder" value={draft.assignedFounder} />
            <Mini label="Next follow-up" value={draft.nextFollowUpDate || "Not set"} />
            <Mini label="Estimated opportunity" value={draft.estimatedOpportunity} />
          </div>
        </Card>

        <Card className="p-5 lg:p-6">
          <CardHeader title="Contact and lead data" description="Update the business details, assignment, and qualification fields." />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Business Name" value={draft.businessName} onChange={(v) => update("businessName", v)} />
            <Field label="Contact Person" value={draft.contactPersonName} onChange={(v) => update("contactPersonName", v)} />
            <Field label="Job Title" value={draft.jobTitle} onChange={(v) => update("jobTitle", v)} />
            <Field label="Email" value={draft.email} onChange={(v) => update("email", v)} />
            <Field label="Phone" value={draft.phoneNumber} onChange={(v) => update("phoneNumber", v)} />
            <Field label="Website" value={draft.website} onChange={(v) => update("website", v)} />
            <Field label="Instagram" value={draft.instagram} onChange={(v) => update("instagram", v)} />
            <Field label="LinkedIn" value={draft.linkedIn} onChange={(v) => update("linkedIn", v)} />
            <Select label="Status" value={draft.leadStatus} options={leadStatuses as unknown as string[]} onChange={(v) => update("leadStatus", v)} />
            <Select label="Founder" value={draft.assignedFounder} options={founders as unknown as string[]} onChange={(v) => update("assignedFounder", v)} />
            <Select label="Country" value={draft.country} options={countries} onChange={(v) => update("country", v)} />
            <Select label="Industry" value={draft.industry} options={industries} onChange={(v) => update("industry", v)} />
            <Select label="Business Type" value={draft.businessType} options={businessTypes} onChange={(v) => update("businessType", v)} />
            <Field label="Monthly Ad Spend Estimate" value={draft.monthlyAdSpendEstimate} onChange={(v) => update("monthlyAdSpendEstimate", v)} />
            <Field label="Website Quality Score" type="number" value={String(draft.websiteQualityScore)} onChange={(v) => update("websiteQualityScore", v)} />
            <Field label="Social Media Quality Score" type="number" value={String(draft.socialMediaQualityScore)} onChange={(v) => update("socialMediaQualityScore", v)} />
            <Field label="Last Contacted Date" type="date" value={draft.lastContactedDate} onChange={(v) => update("lastContactedDate", v)} />
            <Field label="Next Follow-up Date" type="date" value={draft.nextFollowUpDate} onChange={(v) => update("nextFollowUpDate", v)} />
          </div>
        </Card>

        <Card className="p-5 lg:p-6">
          <CardHeader title="Opportunity diagnosis" description="Capture the missing pieces and the strongest RAYQ value angle." />
          <div className="mb-5 grid gap-3 md:grid-cols-3">
            <Mini label="Best service to pitch" value={draft.bestRayqServiceToPitch || "Not selected"} />
            <Mini label="Estimated impact" value={draft.estimatedImpact || draft.estimatedOpportunity} />
            <Mini label="Why now" value={draft.whyNow || "Timing should be qualified manually."} />
          </div>
          {draft.diagnosisTags?.length ? <div className="mb-5 flex flex-wrap gap-2">{draft.diagnosisTags.map((tag) => <Badge key={tag} value={tag} />)}</div> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <TextArea label="What They Are Missing" value={draft.whatTheyAreMissing} onChange={(v) => update("whatTheyAreMissing", v)} />
            <TextArea label="Why It Matters" value={draft.whyItMatters || ""} onChange={(v) => update("whyItMatters", v)} />
            <TextArea label="How RAYQ Can Help" value={draft.howRayqCanHelp} onChange={(v) => update("howRayqCanHelp", v)} />
            <TextArea label="Personalized Outreach Angle" value={draft.personalizedOutreachAngle} onChange={(v) => update("personalizedOutreachAngle", v)} />
            <TextArea label="Notes" value={draft.notes} onChange={(v) => update("notes", v)} />
          </div>
          <button onClick={save} disabled={saving} className="btn btn-primary mt-6">
            <Save size={16} />
            {saving ? "Saving..." : "Save and rescore"}
          </button>
        </Card>
      </section>
      <aside className="grid content-start gap-4">
        <Draft title="First Message" value={draft.firstMessageDraft} />
        <Draft title="Follow-up 1" value={draft.followUp1Draft} />
        <Draft title="Follow-up 2" value={draft.followUp2Draft} />
        <Card className="p-4">
          <h4 className="font-black">Tracking intelligence</h4>
          <div className="mt-3 grid gap-2 text-sm text-linen/72">
            <p>Ads: {draft.adsPresence}</p>
            <p>Tracking: {draft.trackingQuality}</p>
            <p>Opportunity: {draft.estimatedOpportunity}</p>
          </div>
        </Card>
      </aside>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-1 text-sm font-bold text-linen">{value}</p>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="field-label">{label}<input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="field-control" /></label>;
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="field-label">{label}<select value={value} onChange={(e) => onChange(e.target.value)} className="field-control">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="field-label">{label}<textarea rows={5} value={value} onChange={(e) => onChange(e.target.value)} className="field-control" /></label>;
}

function Draft({ title, value }: { title: string; value: string }) {
  return <Card className="p-4"><h4 className="font-black">{title}</h4><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-linen/72">{value}</p></Card>;
}
