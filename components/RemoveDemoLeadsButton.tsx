"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/ConfirmModal";

export function RemoveDemoLeadsButton() {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function removeDemo() {
    setBusy(true);
    const response = await fetch("/api/leads", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ removeDemo: true })
    });
    const data = await response.json();
    setMessage(response.ok ? `Removed ${data.deleted} demo/mock/sample lead${data.deleted === 1 ? "" : "s"}.` : data.message || "Could not remove demo leads.");
    setBusy(false);
    setConfirm(false);
    router.refresh();
  }

  return (
    <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-black text-red-100">Remove Demo Leads</p>
          <p className="mt-1 text-sm leading-6 text-linen/72">Deletes only leads where source contains Demo, Mock Data, or sample. Real leads are not removed by this action.</p>
        </div>
        <button className="btn bg-red-500/85 text-white hover:bg-red-500" onClick={() => setConfirm(true)}>
          <Trash2 size={16} />
          Remove Demo Leads
        </button>
      </div>
      {message ? <p className="mt-3 text-sm font-semibold text-linen">{message}</p> : null}
      {confirm ? (
        <ConfirmModal
          title="Remove demo leads"
          message="Are you sure you want to delete this lead? This action cannot be undone."
          confirmLabel="Remove Demo Leads"
          onCancel={() => setConfirm(false)}
          onConfirm={removeDemo}
          busy={busy}
        />
      ) : null}
    </div>
  );
}
