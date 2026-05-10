import { NextResponse } from "next/server";
import { readLeads, writeLeads } from "@/lib/storage";
import { calculateLeadScore } from "@/lib/scoring";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const leads = await readLeads();
  const lead = leads.find((item) => item.id === id);
  if (!lead) return NextResponse.json({ message: "Lead not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const leads = await readLeads();
  const index = leads.findIndex((item) => item.id === id);
  if (index < 0) return NextResponse.json({ message: "Lead not found" }, { status: 404 });

  const merged = { ...leads[index], ...body, updatedDate: new Date().toISOString().slice(0, 10) };
  const score = calculateLeadScore(merged);
  leads[index] = { ...merged, leadScore: score.score, priority: score.priority };
  await writeLeads(leads);
  return NextResponse.json(leads[index]);
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  const leads = await readLeads();
  await writeLeads(leads.filter((item) => item.id !== id));
  return NextResponse.json({ ok: true });
}
