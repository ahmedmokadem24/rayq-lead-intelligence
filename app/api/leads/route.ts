import { NextResponse } from "next/server";
import { addLead, readLeads, writeLeads } from "@/lib/storage";
import { calculateLeadScore } from "@/lib/scoring";
import type { Lead } from "@/types/lead";

export async function GET() {
  const leads = await readLeads();
  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  const body = await request.json();
  const lead = await addLead(body);
  return NextResponse.json(lead, { status: 201 });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as Lead[];
  const leads = body.map((lead) => {
    const score = calculateLeadScore(lead);
    return { ...lead, leadScore: score.score, priority: score.priority };
  });
  await writeLeads(leads);
  return NextResponse.json(leads);
}

export async function DELETE(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { ids?: string[]; removeDemo?: boolean };
  const leads = await readLeads();

  if (body.removeDemo) {
    const isDemo = (source = "") => /demo|mock data|sample/i.test(source);
    const remaining = leads.filter((lead) => !isDemo(lead.source));
    await writeLeads(remaining);
    return NextResponse.json({ ok: true, deleted: leads.length - remaining.length });
  }

  const ids = new Set(body.ids || []);
  if (!ids.size) {
    return NextResponse.json({ message: "No lead IDs provided" }, { status: 400 });
  }

  const remaining = leads.filter((lead) => !ids.has(lead.id));
  await writeLeads(remaining);
  return NextResponse.json({ ok: true, deleted: leads.length - remaining.length });
}
