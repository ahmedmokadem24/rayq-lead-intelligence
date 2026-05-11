import { NextResponse } from "next/server";
import { runDiscovery } from "@/lib/discovery";
import { GooglePlacesError } from "@/lib/connectors/googlePlaces";

export async function POST(request: Request) {
  const filters = await request.json();
  try {
    const leads = await runDiscovery(filters);
    const requestedLimit = Number(filters.resultsLimit || 10);
    const limitedResultMessage =
      (filters.leadSource === "Google Places" || filters.sourceMode === "Google Places") && leads.length < requestedLimit
        ? `Google returned only ${leads.length} results for this search. Try a broader keyword or nearby city.`
        : undefined;

    return NextResponse.json({ leads, requestedLimit, limitedResultMessage });
  } catch (error) {
    if (error instanceof GooglePlacesError) {
      return NextResponse.json(
        {
          leads: [],
          error: error.message,
          code: error.code,
          detail: error.detail,
          source: "Google Places"
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        leads: [],
        error: error instanceof Error ? error.message : "Discovery failed",
        code: "DISCOVERY_ERROR"
      },
      { status: 400 }
    );
  }
}
