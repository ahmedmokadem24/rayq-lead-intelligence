import { NextResponse } from "next/server";
import { addLead } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const rows = (await request.json()) as Record<string, string>[];
    const imported = [];

    for (const row of rows) {
      const businessName = row.businessName || row["Business Name"] || row.name || row.Name;
      if (!businessName) continue;
      imported.push(
        await addLead({
          businessName,
          contactPersonName: row.contactPersonName || row["Contact Person Name"] || "",
          jobTitle: row.jobTitle || row["Job Title"] || "",
          email: row.email || row.Email || "",
          phoneNumber: row.phoneNumber || row["Phone Number"] || row.Phone || "",
          website: row.website || row.Website || "",
          instagram: row.instagram || row.Instagram || "",
          linkedIn: row.linkedIn || row.LinkedIn || "",
          country: row.country || row.Country || "Egypt",
          city: row.city || row.City || "",
          industry: row.industry || row.Industry || "E-commerce",
          businessType: row.businessType || row["Business Type"] || "E-commerce brand",
          source: row.source || row.Source || "CSV import",
          notes: row.notes || row.Notes || ""
        })
      );
    }

    return NextResponse.json({ imported: imported.length, leads: imported });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Could not import leads" },
      { status: 500 }
    );
  }
}
