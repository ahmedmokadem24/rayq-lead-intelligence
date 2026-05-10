"use client";

import Link from "next/link";
import { Download, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/Badge";
import { ScoreBadge } from "@/components/ui";
import { countries, industries } from "@/lib/constants";
import type { Lead } from "@/types/lead";
import { founders, leadStatuses, priorities } from "@/types/lead";

export function LeadTable({ leads }: { leads: Lead[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [priority, setPriority] = useState("");
  const [founder, setFounder] = useState("");
  const [due, setDue] = useState("");

  const filtered = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return leads.filter((lead) => {
      const text = `${lead.businessName} ${lead.contactPersonName} ${lead.website} ${lead.industry} ${lead.country}`.toLowerCase();
      return (
        (!query || text.includes(query.toLowerCase())) &&
        (!status || lead.leadStatus === status) &&
        (!country || lead.country === country) &&
        (!industry || lead.industry === industry) &&
        (!priority || lead.priority === priority) &&
        (!founder || lead.assignedFounder === founder) &&
        (!due || (due === "today" ? lead.nextFollowUpDate <= today : Boolean(lead.nextFollowUpDate)))
      );
    });
  }, [leads, query, status, country, industry, priority, founder, due]);

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-white/10 p-4 lg:p-5">
        <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-7">
        <label className="relative md:col-span-2">
          <Search className="absolute left-3 top-3.5 text-muted" size={16} />
          <input className="field-control pl-10" placeholder="Search business, contact, website..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <Filter value={status} setValue={setStatus} options={leadStatuses as unknown as string[]} label="Status" />
        <Filter value={country} setValue={setCountry} options={countries} label="Country" />
        <Filter value={industry} setValue={setIndustry} options={industries} label="Industry" />
        <Filter value={priority} setValue={setPriority} options={priorities as unknown as string[]} label="Priority" />
        <Filter value={founder} setValue={setFounder} options={founders as unknown as string[]} label="Founder" />
        <select className="field-control" value={due} onChange={(event) => setDue(event.target.value)}>
          <option value="">Any follow-up</option>
          <option value="today">Due today</option>
          <option value="any">Has follow-up</option>
        </select>
        <a className="btn btn-primary" href="/api/export">
          <Download size={16} />
          Export CSV
        </a>
        </div>
      </div>
      <div className="table-scroll overflow-x-auto">
        <table className="min-w-[1100px] w-full text-left text-sm">
          <thead className="bg-black/22 text-xs uppercase tracking-[0.16em] text-muted">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Industry</th>
              <th className="px-4 py-3">Founder</th>
              <th className="px-4 py-3">Next Follow-up</th>
              <th className="px-4 py-3">Opportunity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8">
            {filtered.map((lead) => (
              <tr key={lead.id} className="transition hover:bg-white/[0.045]">
                <td className="px-4 py-4 lg:px-5">
                  <Link href={`/leads/${lead.id}`} className="text-[15px] font-black text-pearl hover:text-champagne">{lead.businessName}</Link>
                  <p className="mt-1 text-xs text-muted">{lead.contactPersonName || "No contact"} · {lead.city || "No city"}</p>
                </td>
                <td className="px-4 py-4 lg:px-5">
                  <div className="flex items-center gap-2">
                    <ScoreBadge score={lead.leadScore} />
                    <Badge value={lead.priority} />
                  </div>
                </td>
                <td className="px-4 py-4 lg:px-5"><Badge value={lead.leadStatus} /></td>
                <td className="px-4 py-4 text-linen/75 lg:px-5">{lead.country}</td>
                <td className="px-4 py-4 text-linen/75 lg:px-5">{lead.industry}</td>
                <td className="px-4 py-4 text-linen/75 lg:px-5">{lead.assignedFounder}</td>
                <td className="px-4 py-4 text-linen/75 lg:px-5">{lead.nextFollowUpDate || "-"}</td>
                <td className="px-4 py-4 text-linen/75 lg:px-5">{lead.estimatedOpportunity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Filter({ value, setValue, options, label }: { value: string; setValue: (value: string) => void; options: string[]; label: string }) {
  return (
    <select className="field-control" value={value} onChange={(event) => setValue(event.target.value)}>
      <option value="">{label}</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}
