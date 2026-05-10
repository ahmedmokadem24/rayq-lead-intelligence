import type { DiscoveredLead } from "@/types/lead";

export async function enrichWithBuiltWith(lead: DiscoveredLead) {
  // Future: detect stack, pixels, Shopify, and analytics server-side using BUILTWITH_API_KEY.
  return lead;
}
