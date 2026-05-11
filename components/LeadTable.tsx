"use client";

import Link from "next/link";
import { Download, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/Badge";
import { ConfirmModal } from "@/components/ConfirmModal";
import { ScoreBadge } from "@/components/ui";
import { countries, industries } from "@/lib/constants";
import type { Lead } from "@/types/lead";
import { founders, leadStatuses, priorities } from "@/types/lead";

export function LeadTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [priority, setPriority] = useState("");
  const [founder, setFounder] = useState("");
  const [due, setDue] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<{ ids: string[]; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const filtered = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return leads.filter((lead) => {
      const text = `${lead.businessName} ${lead.contactPersonName} ${lead.website} ${lead.industry} ${lead.country}`.toLowerCase();
      return (
        !deletedIds.includes(lead.id) &&
        (!query || text.includes(query.toLowerCase())) &&
        (!status || lead.leadStatus === status) &&
        (!country || lead.country === country) &&
        (!industry || lead.industry === industry) &&
        (!priority || lead.priority === priority) &&
        (!founder || lead.assignedFounder === founder) &&
        (!due || (due === "today" ? lead.nextFollowUpDate <= today : Boolean(lead.nextFollowUpDate)))
      );
    });
  }, [leads, deletedIds, query, status, country, industry, priority, founder, due]);

  const visibleIds = filtered.map((lead) => lead.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  function toggleLead(id: string) {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function toggleVisible() {
    setSelectedIds((current) => {
      if (allVisibleSelected) return current.filter((id) => !visibleIds.includes(id));
      return Array.from(new Set([...current, ...visibleIds]));
    });
  }

  async function deleteConfirmed() {
    if (!confirm) return;
    setDeleting(true);
    setNotice(null);

    try {
      const response = await fetch("/api/leads", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ids: confirm.ids })
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        throw new Error(data.message || `Delete failed with status ${response.status}`);
      }

      setDeletedIds((current) => Array.from(new Set([...current, ...confirm.ids])));
      setSelectedIds((current) => current.filter((id) => !confirm.ids.includes(id)));
      setNotice({ type: "success", text: `Deleted ${data.deleted || confirm.ids.length} lead${(data.deleted || confirm.ids.length) === 1 ? "" : "s"}.` });
      setConfirm(null);
      router.refresh();
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Could not delete lead." });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-white/10 p-4 lg:p-5">
        {notice ? (
          <div className={`mb-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${notice.type === "success" ? "border-emerald-400/25 bg-emerald-500/15 text-emerald-100" : "border-red-400/25 bg-red-500/15 text-red-100"}`}>
            {notice.text}
          </div>
        ) : null}
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
        <button
          type="button"
          className="btn btn-secondary text-red-100 disabled:opacity-45"
          disabled={!selectedIds.length}
          onClick={() => setConfirm({ ids: selectedIds, label: `${selectedIds.length} selected lead${selectedIds.length === 1 ? "" : "s"}` })}
        >
          <Trash2 size={16} />
          Delete selected
        </button>
        </div>
      </div>
      <div className="table-scroll overflow-x-auto">
        <table className="min-w-[1260px] w-full text-left text-sm">
          <thead className="bg-black/22 text-xs uppercase tracking-[0.16em] text-muted">
            <tr>
              <th className="px-4 py-3">
                <input aria-label="Select visible leads" type="checkbox" checked={allVisibleSelected} onChange={toggleVisible} className="h-4 w-4 accent-champagne" />
              </th>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Industry</th>
              <th className="px-4 py-3">Founder</th>
              <th className="px-4 py-3">Next Follow-up</th>
              <th className="px-4 py-3">Opportunity</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8">
            {filtered.map((lead) => (
              <tr key={lead.id} className="transition hover:bg-white/[0.045]">
                <td className="px-4 py-4">
                  <input aria-label={`Select ${lead.businessName}`} type="checkbox" checked={selectedIds.includes(lead.id)} onChange={() => toggleLead(lead.id)} className="h-4 w-4 accent-champagne" />
                </td>
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
                <td className="px-4 py-4 lg:px-5">
                  <button type="button" className="btn btn-ghost h-9 px-3 text-red-100" onClick={() => setConfirm({ ids: [lead.id], label: lead.businessName })}>
                    <Trash2 size={14} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {confirm ? (
        <ConfirmModal
          title="Delete lead"
          message="Are you sure you want to delete this lead? This action cannot be undone."
          confirmLabel={`Delete ${confirm.label}`}
          onCancel={() => setConfirm(null)}
          onConfirm={deleteConfirmed}
          busy={deleting}
        />
      ) : null}
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
