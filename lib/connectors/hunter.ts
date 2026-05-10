import type { DiscoveredLead } from "@/types/lead";

export async function enrichWithHunter(lead: DiscoveredLead) {
  // Future: enrich contact data server-side using HUNTER_API_KEY.
  return lead;
}
