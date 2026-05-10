import { NextResponse } from "next/server";
import { unparse } from "papaparse";
import { readLeads } from "@/lib/storage";

export async function GET() {
  const leads = await readLeads();
  const csv = unparse(leads);
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=rayq-leads.csv"
    }
  });
}
