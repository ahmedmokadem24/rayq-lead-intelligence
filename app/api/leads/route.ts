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
