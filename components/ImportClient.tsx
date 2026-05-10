"use client";

import Papa from "papaparse";
import { useState } from "react";

export function ImportClient() {
  const [message, setMessage] = useState("");
  const [paste, setPaste] = useState("");

  async function upload(file: File) {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const response = await fetch("/api/import", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(results.data)
        });
        const data = await response.json();
        setMessage(`Imported ${data.imported} leads.`);
      }
    });
  }

  async function importPaste() {
    const rows = paste
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const isUrl = line.includes(".");
        return { businessName: isUrl ? line.replace(/^https?:\/\//, "") : line, website: isUrl ? line : "", source: "Pasted list" };
      });
    const response = await fetch("/api/import", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(rows)
    });
    const data = await response.json();
    setMessage(`Imported ${data.imported} pasted leads.`);
    setPaste("");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="surface-card p-5 lg:p-6">
        <h3 className="section-title">CSV upload</h3>
        <p className="mt-2 text-sm leading-6 text-muted">Use columns like Business Name, Email, Phone Number, Website, Instagram, LinkedIn, Country, City, Industry, Business Type, Source, and Notes.</p>
        <input type="file" accept=".csv" onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])} className="field-control mt-5 block h-auto cursor-pointer p-3 text-sm" />
      </section>
      <section className="surface-card p-5 lg:p-6">
        <h3 className="section-title">Paste websites or business names</h3>
        <textarea value={paste} onChange={(event) => setPaste(event.target.value)} rows={10} className="field-control mt-4 w-full" placeholder="One website or business name per line" />
        <button onClick={importPaste} className="btn btn-primary mt-4">Import pasted list</button>
      </section>
      {message ? <p className="surface-card p-4 text-sm text-linen">{message}</p> : null}
    </div>
  );
}
