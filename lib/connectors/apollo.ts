import type { DiscoveredLead } from "@/types/lead";

export async function enrichWithApollo(lead: DiscoveredLead) {
  // Future: enrich B2B/company data server-side using APOLLO_API_KEY.
  return lead;
}
