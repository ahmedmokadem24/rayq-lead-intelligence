"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { countries, businessTypes, industries } from "@/lib/constants";
import { founders, leadStatuses } from "@/types/lead";

export function LeadForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setSaving(true);
    setMessage("");
    const body = Object.fromEntries(formData.entries());
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    const lead = await response.json();
    setSaving(false);
    if (response.ok) router.push(`/leads/${lead.id}`);
    else setMessage("Could not save lead. Please check the required fields.");
  }

  return (
    <form action={submit} className="surface-card p-5 lg:p-7">
      <div className="mb-6">
        <h3 className="section-title">Lead information</h3>
        <p className="mt-1 text-sm text-muted">Add approved public business information and let RAYQ score the opportunity.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Field name="businessName" label="Business Name" required />
        <Field name="contactPersonName" label="Contact Person Name" />
        <Field name="jobTitle" label="Job Title" />
        <Field name="email" label="Email" type="email" />
        <Field name="phoneNumber" label="Phone Number" />
        <Field name="website" label="Website" />
        <Field name="instagram" label="Instagram" />
        <Field name="linkedIn" label="LinkedIn" />
        <Select name="country" label="Country" options={countries} />
        <Field name="city" label="City" />
        <Select name="industry" label="Industry" options={industries} />
        <Select name="businessType" label="Business Type" options={businessTypes} />
        <Field name="source" label="Source" placeholder="Manual, CSV, Instagram, Website list" />
        <Select name="leadStatus" label="Lead Status" options={leadStatuses as unknown as string[]} />
        <Select name="assignedFounder" label="Assigned Founder" options={founders as unknown as string[]} />
        <Field name="monthlyAdSpendEstimate" label="Monthly Ad Spend Estimate" />
        <Field name="websiteQualityScore" label="Website Quality Score" type="number" min="1" max="10" />
        <Field name="socialMediaQualityScore" label="Social Media Quality Score" type="number" min="1" max="10" />
        <Field name="adsPresence" label="Ads Presence" />
        <Field name="trackingQuality" label="Tracking Quality" />
        <Field name="nextFollowUpDate" label="Next Follow-up Date" type="date" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <TextArea name="whatTheyAreMissing" label="What They Are Missing" />
        <TextArea name="howRayqCanHelp" label="How RAYQ Can Help" />
        <TextArea name="personalizedOutreachAngle" label="Personalized Outreach Angle" />
        <TextArea name="notes" label="Notes" />
      </div>
      {message ? <p className="mt-4 text-sm text-red-200">{message}</p> : null}
      <button className="btn btn-primary mt-6 disabled:opacity-60" disabled={saving}>
        {saving ? "Saving..." : "Create lead and score"}
      </button>
    </form>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <label className="field-label">
      {label}
      <input {...props} className="field-control" />
    </label>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="field-label">
      {label}
      <select name={name} className="field-control">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function TextArea({ label, name }: { label: string; name: string }) {
  return (
    <label className="field-label">
      {label}
      <textarea name={name} rows={4} className="field-control" />
    </label>
  );
}
