import { NextResponse } from "next/server";
import { addLead, deleteLeads, readLeads, removeDemoLeads, writeLeads } from "@/lib/storage";
import { calculateLeadScore } from "@/lib/scoring";
import type { Lead } from "@/types/lead";

export async function GET() {
  try {
    const leads = await readLeads();
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Could not load leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lead = await addLead(body);
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Could not add lead" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Lead[];
    const leads = body.map((lead) => {
      const score = calculateLeadScore(lead);
      return { ...lead, leadScore: score.score, priority: score.priority };
    });
    await writeLeads(leads);
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Could not update leads" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { ids?: string[]; removeDemo?: boolean };
    if (body.removeDemo) {
      const deleted = await removeDemoLeads();
      return NextResponse.json({ ok: true, deleted });
    }

    const ids = body.ids || [];
    if (!ids.length) {
      return NextResponse.json({ message: "No lead IDs provided" }, { status: 400 });
    }

    const deleted = await deleteLeads(ids);
    return NextResponse.json({ ok: true, deleted });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Could not delete leads" },
      { status: 500 }
    );
  }
}
