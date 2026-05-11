import { NextResponse } from "next/server";
import { deleteLead, getLead, updateLead } from "@/lib/storage";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const lead = await getLead(id);
    if (!lead) return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    return NextResponse.json(lead);
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Could not load lead" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const lead = await updateLead(id, body);
    if (!lead) return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    return NextResponse.json(lead);
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Could not update lead" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const existing = await getLead(id);
    if (!existing) return NextResponse.json({ ok: false, message: "Lead not found" }, { status: 404 });
    const deleted = await deleteLead(id);
    return NextResponse.json({ ok: true, deleted });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Could not delete lead" },
      { status: 500 }
    );
  }
}
