import { NextResponse } from "next/server";
import { unparse } from "papaparse";
import { readLeads } from "@/lib/storage";

export async function GET() {
  try {
    const leads = await readLeads();
    const csv = unparse(leads);
    return new NextResponse(csv, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": "attachment; filename=rayq-leads.csv"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Could not export leads" },
      { status: 500 }
    );
  }
}
