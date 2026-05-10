import type { DiscoveredLead } from "@/types/lead";

export function applyWebsiteAnalysis(lead: DiscoveredLead): DiscoveredLead {
  if (lead.website === "Not found") {
    return {
      ...lead,
      websiteQualityScore: 1,
      croOpportunityScore: 9,
      paidAdsOpportunityScore: Math.max(lead.paidAdsOpportunityScore, 7),
      contentOpportunityScore: Math.max(lead.contentOpportunityScore, 7),
      trackingOpportunityScore: 9,
      overallRayqFitScore: 8,
      missingOpportunities: unique([...lead.missingOpportunities, "Website not found", "Needs manual website review"]),
      tags: unique([...lead.tags, "Weak website", "Tracking unclear"]),
      opportunityType: unique([...lead.opportunityType, "Weak website", "Weak tracking"])
    };
  }

  const signal = `${lead.website} ${lead.category} ${lead.industry} ${lead.launchSignal || ""} ${lead.signalType || ""}`.toLowerCase();
  const ecommerce = /shopify|store|ecommerce|fashion|collection|product|shop/.test(signal);
  const highTicket = /clinic|real estate|furniture|interior|fitness|medical|dental/.test(signal);
  const newLaunch = /now open|soft opening|grand opening|just launched|new website|new collection|launch/.test(signal);

  const websiteQualityScore = newLaunch ? 5 : 6;
  const croOpportunityScore = ecommerce || highTicket ? 8 : 7;
  const paidAdsOpportunityScore = ecommerce || highTicket ? 8 : 7;
  const contentOpportunityScore = ecommerce ? 8 : 6;
  const trackingOpportunityScore = 8;
  const overallRayqFitScore = Math.round((croOpportunityScore + paidAdsOpportunityScore + contentOpportunityScore + trackingOpportunityScore) / 4);

  return {
    ...lead,
    websiteQualityScore,
    croOpportunityScore,
    paidAdsOpportunityScore,
    contentOpportunityScore,
    trackingOpportunityScore,
    overallRayqFitScore,
    missingOpportunities: unique([...lead.missingOpportunities, "Tracking unclear", "Needs website CRO review"]),
    tags: unique([...lead.tags, "Tracking unclear", ecommerce ? "Weak product descriptions" : "Weak CTA"]),
    opportunityType: unique([
      ...lead.opportunityType,
      newLaunch ? "New business" : "Growing business",
      ecommerce ? "Weak content" : "Weak website",
      "Weak tracking"
    ])
  };
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}
