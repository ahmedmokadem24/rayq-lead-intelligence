import { NextResponse } from "next/server";
import { unparse } from "papaparse";
import { demoDiscoveredLeads } from "@/lib/discovery/mockData";

export async function GET() {
  const csv = unparse(
    demoDiscoveredLeads.map((lead) => ({
      businessName: lead.businessName,
      website: lead.website,
      country: lead.country,
      city: lead.city,
      industry: lead.industry,
      businessStage: lead.businessStage,
      source: lead.source,
      verificationStatus: lead.verificationStatus,
      contactDataQuality: lead.contactDataQuality,
      dataConfidenceScore: lead.dataConfidenceScore,
      opportunityType: lead.opportunityType.join("; "),
      opportunityScore: lead.opportunityScore,
      missingOpportunities: lead.missingOpportunities.join("; "),
      bestRayqServiceToPitch: lead.bestRayqServiceToPitch,
      bestOutreachChannel: lead.bestOutreachChannel,
      suggestedOutreachAngle: lead.suggestedOutreachAngle,
      contactEmail: lead.contactEmail,
      phone: lead.phone,
      address: lead.address,
      category: lead.category,
      rating: lead.rating ?? "Not found",
      googleMapsUrl: lead.googleMapsUrl
    }))
  );

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=rayq-discovered-opportunities.csv"
    }
  });
}
