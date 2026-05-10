import { NextResponse } from "next/server";
import { discoveredLeadToLeadInput } from "@/lib/discovery";
import { addLead } from "@/lib/storage";
import type { DiscoveredLead } from "@/types/lead";

export async function POST(request: Request) {
  const discoveredLead = (await request.json()) as DiscoveredLead;
  if (discoveredLead.verificationStatus === "Demo data") {
    return NextResponse.json({ message: "Demo data cannot be saved as a real lead." }, { status: 400 });
  }
  const lead = await addLead(discoveredLeadToLeadInput(discoveredLead));
  return NextResponse.json(lead, { status: 201 });
}
