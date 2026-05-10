"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { SavedSearch } from "@/types/lead";
import { businessTypes, countries, industries, servicesToPitch } from "@/lib/constants";

export function SavedSearchesClient({ initialSearches }: { initialSearches: SavedSearch[] }) {
  const [searches, setSearches] = useState(initialSearches);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  function create(formData: FormData) {
    const values = Object.fromEntries(formData.entries());
    const search: SavedSearch = {
      id: `SS-${Date.now()}`,
      name: String(values.name || "Untitled search"),
      country: String(values.country || ""),
      city: String(values.city || ""),
      industry: String(values.industry || ""),
      businessType: String(values.businessType || ""),
      minimumOpportunityScore: Number(values.minimumOpportunityScore || 60),
      serviceToPitch: String(values.serviceToPitch || ""),
      lastRunDate: today,
      leadsFound: 0,
      leadsSaved: 0
    };
    setSearches((current) => [search, ...current]);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <form action={create} className="surface-card p-5 lg:p-6">
        <h3 className="section-title">Create saved search</h3>
        <p className="mt-1 text-sm leading-6 text-muted">Presets help the team repeat the same discovery plays.</p>
        <div className="mt-5 grid gap-4">
          <Field name="name" label="Search name" placeholder="UAE furniture brands" />
          <Select name="country" label="Country" options={["", ...countries]} />
          <Field name="city" label="City" placeholder="Dubai" />
          <Select name="industry" label="Industry" options={["", ...industries]} />
          <Select name="businessType" label="Business type" options={["", ...businessTypes]} />
          <Field name="minimumOpportunityScore" label="Minimum opportunity score" type="number" defaultValue="60" />
          <Select name="serviceToPitch" label="Service to pitch" options={["", ...servicesToPitch]} />
        </div>
        <button className="btn btn-primary mt-5"><Plus size={16} />Save search</button>
      </form>

      <section className="surface-card overflow-hidden">
        <div className="border-b border-white/10 p-5">
          <h3 className="section-title">Saved presets</h3>
          <p className="mt-1 text-sm text-muted">Reusable discovery modes for markets RAYQ wants to focus on.</p>
        </div>
        <div className="table-scroll overflow-x-auto">
          <table className="min-w-[940px] w-full text-left text-sm">
            <thead className="bg-black/22 text-xs uppercase tracking-[0.16em] text-muted">
              <tr>
                <th className="px-4 py-3">Search</th>
                <th className="px-4 py-3">Market</th>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Last run</th>
                <th className="px-4 py-3">Results</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {searches.map((search) => (
                <tr key={search.id} className="hover:bg-white/[0.045]">
                  <td className="px-4 py-4 font-black text-pearl">{search.name}</td>
                  <td className="px-4 py-4 text-linen/75">{search.country || "Any"} · {search.city || "Any city"}</td>
                  <td className="px-4 py-4 text-linen/75">{search.industry || "Any industry"}<p className="mt-1 text-xs text-muted">{search.businessType || "Any type"}</p></td>
                  <td className="px-4 py-4 text-linen/75">{search.minimumOpportunityScore}+</td>
                  <td className="px-4 py-4 text-linen/75">{search.serviceToPitch || "Any service"}</td>
                  <td className="px-4 py-4 text-linen/75">{search.lastRunDate}</td>
                  <td className="px-4 py-4 text-linen/75">{search.leadsFound} found · {search.leadsSaved} saved</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...rest } = props;
  return <label className="field-label">{label}<input className="field-control" {...rest} /></label>;
}

function Select({ label, name, options }: { label: string; name: string; options: readonly string[] }) {
  return <label className="field-label">{label}<select name={name} className="field-control">{options.map((option) => <option key={option} value={option}>{option || "Any"}</option>)}</select></label>;
}
