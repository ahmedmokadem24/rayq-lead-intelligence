import type { DiscoveredLead, DiscoveryFilters, FieldConfidence, SavedSearch } from "@/types/lead";
import { priorityFromScore } from "@/lib/scoring";

const notFound = "Not found";

const demoConfidence: FieldConfidence = {
  businessName: 35,
  website: 0,
  phone: 0,
  email: 0,
  address: 0,
  city: 45,
  country: 45,
  category: 40,
  rating: 0,
  googleMapsUrl: 0,
  sourceUrl: 0,
  launchSignal: 20
};

const opportunities: Omit<DiscoveredLead, "priority">[] = [
  demoLead({
    id: "DEMO-1001",
    businessName: "DEMO - Dubai Home Decor Brand",
    country: "UAE",
    city: "Dubai",
    industry: "Furniture & Home Decor",
    businessType: "E-commerce brand",
    businessStage: "Growing",
    opportunityScore: 76,
    missingOpportunities: ["Weak CTA", "No WhatsApp button", "Tracking unclear"],
    bestRayqServiceToPitch: "Performance Marketing",
    suggestedOutreachAngle: "DEMO scenario: premium home decor funnel, retargeting, and CRO",
    opportunityType: ["Growing business", "Weak website", "Weak tracking"],
    bestOutreachChannel: "WhatsApp"
  }),
  demoLead({
    id: "DEMO-1002",
    businessName: "DEMO - Riyadh Clinic",
    country: "Saudi Arabia",
    city: "Riyadh",
    industry: "Clinic",
    businessType: "High-ticket service",
    businessStage: "Mid-sized",
    opportunityScore: 82,
    missingOpportunities: ["Weak landing page", "No clear funnel", "No email capture", "Tracking unclear"],
    bestRayqServiceToPitch: "CRO",
    suggestedOutreachAngle: "DEMO scenario: clinic booking funnel, tracking, and landing pages",
    opportunityType: ["Mid-sized business", "High-ticket opportunity", "Weak tracking"],
    bestOutreachChannel: "Call"
  }),
  demoLead({
    id: "DEMO-1003",
    businessName: "DEMO - Cairo Restaurant Launch",
    country: "Egypt",
    city: "Cairo",
    industry: "Restaurant",
    businessType: "Local business",
    businessStage: "New",
    opportunityScore: 68,
    missingOpportunities: ["Weak CTA", "Poor mobile experience", "No WhatsApp button"],
    bestRayqServiceToPitch: "Website",
    suggestedOutreachAngle: "DEMO scenario: mobile ordering page and WhatsApp reservations",
    opportunityType: ["New business", "Weak website", "Weak content"],
    bestOutreachChannel: "Instagram DM"
  }),
  demoLead({
    id: "DEMO-1004",
    businessName: "DEMO - Kuwait Fashion Store",
    country: "Kuwait",
    city: "Kuwait City",
    industry: "Fashion",
    businessType: "E-commerce brand",
    businessStage: "Growing",
    opportunityScore: 79,
    missingOpportunities: ["Weak product descriptions", "Weak SEO", "No retargeting setup"],
    bestRayqServiceToPitch: "AI Creatives",
    suggestedOutreachAngle: "DEMO scenario: fashion creative testing and product content",
    opportunityType: ["Growing business", "Weak content", "Weak ads"],
    bestOutreachChannel: "Email"
  })
];

export const demoDiscoveredLeads: DiscoveredLead[] = opportunities.map((lead) => ({
  ...lead,
  priority: priorityFromScore(lead.opportunityScore)
}));

export const demoSavedSearches: SavedSearch[] = [
  { id: "SS-1", name: "UAE furniture brands", country: "UAE", city: "Dubai", industry: "Furniture & Home Decor", businessType: "E-commerce brand", minimumOpportunityScore: 70, serviceToPitch: "Performance Marketing", lastRunDate: "2026-05-10", leadsFound: 18, leadsSaved: 4 },
  { id: "SS-2", name: "Egypt clinics", country: "Egypt", city: "Cairo", industry: "Clinic", businessType: "High-ticket service", minimumOpportunityScore: 65, serviceToPitch: "CRO", lastRunDate: "2026-05-10", leadsFound: 22, leadsSaved: 6 },
  { id: "SS-3", name: "Saudi fashion brands", country: "Saudi Arabia", city: "Riyadh", industry: "Fashion", businessType: "E-commerce brand", minimumOpportunityScore: 70, serviceToPitch: "AI Creatives", lastRunDate: "2026-05-09", leadsFound: 14, leadsSaved: 3 }
];

export function filterDemoOpportunities(filters: Partial<DiscoveryFilters>) {
  const min = Number(filters.minimumOpportunityScore || 0);
  return demoDiscoveredLeads.filter((lead) => {
    return (
      (!filters.country || lead.country === filters.country) &&
      (!filters.city || lead.city.toLowerCase().includes(filters.city.toLowerCase())) &&
      (!filters.industry || lead.industry === filters.industry) &&
      (!filters.businessType || lead.businessType === filters.businessType) &&
      (!filters.businessStage || lead.businessStage === filters.businessStage) &&
      (!filters.serviceToPitch || lead.bestRayqServiceToPitch === filters.serviceToPitch) &&
      lead.opportunityScore >= min
    );
  });
}

function demoLead(input: Pick<DiscoveredLead, "id" | "businessName" | "country" | "city" | "industry" | "businessType" | "businessStage" | "opportunityScore" | "missingOpportunities" | "bestRayqServiceToPitch" | "suggestedOutreachAngle" | "opportunityType" | "bestOutreachChannel">): Omit<DiscoveredLead, "priority"> {
  return {
    ...input,
    website: notFound,
    source: "DEMO mode",
    verificationStatus: "Demo data",
    contactDataQuality: "Missing",
    dataConfidenceScore: 18,
    fieldConfidence: demoConfidence,
    address: notFound,
    category: input.industry,
    rating: null,
    googleMapsUrl: notFound,
    sourceUrl: notFound,
    launchSignal: "DEMO signal only",
    signalType: "DEMO",
    contactEmail: notFound,
    phone: notFound,
    websiteQualityScore: 1,
    croOpportunityScore: 7,
    paidAdsOpportunityScore: 7,
    contentOpportunityScore: 7,
    trackingOpportunityScore: 8,
    overallRayqFitScore: 7,
    tags: input.missingOpportunities,
    diagnosis: {
      whatTheyAreMissing: `DEMO scenario only: ${input.missingOpportunities.join(", ")}.`,
      whyItMatters: "This is not a real business record. Use it only to test the review workflow.",
      whatRayqCanDo: `DEMO scenario: pitch ${input.bestRayqServiceToPitch} after verifying the real business manually or through approved APIs.`,
      bestRayqServiceToPitch: input.bestRayqServiceToPitch,
      estimatedImpact: "Unknown until verified.",
      whyNow: "Unknown until verified.",
      personalizedAuditAngle: input.suggestedOutreachAngle,
      suggestedFirstMessage: "DEMO only. Do not contact. Run Google Places or enter a verified manual source first."
    }
  };
}
