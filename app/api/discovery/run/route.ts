import { NextResponse } from "next/server";
import { runDiscovery } from "@/lib/discovery";
import { GooglePlacesError } from "@/lib/connectors/googlePlaces";

export async function POST(request: Request) {
  const filters = await request.json();
  try {
    const leads = await runDiscovery(filters);
    return NextResponse.json({ leads });
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
