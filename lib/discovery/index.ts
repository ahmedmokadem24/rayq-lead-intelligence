import type { DiscoveredLead, DiscoveryFilters, LeadInput } from "@/types/lead";
import { filterDemoOpportunities } from "@/lib/discovery/mockData";
import { searchGooglePlaces } from "@/lib/connectors/googlePlaces";
import { searchWebResults } from "@/lib/connectors/searchApi";
import { priorityFromScore } from "@/lib/scoring";

export async function runDiscovery(filters: Partial<DiscoveryFilters>) {
  if (filters.leadSource === "Google Places" || filters.leadSource === "Google Places businesses" || filters.sourceMode === "Google Places") {
    return searchGooglePlaces(filters);
  }

  if (filters.leadSource === "Search API / SerpAPI" || filters.sourceMode === "Search API / SerpAPI") {
    return searchWebResults(filters);
  }

  if (filters.leadSource === "Website URL paste list") {
    return createWebsiteListOpportunities(filters);
  }

  if (filters.leadSource === "Manual Instagram URL input" && filters.instagramUrl) {
    return [createManualOpportunity(filters.instagramUrl, "Manual Instagram URL input", filters)];
  }

  if (filters.leadSource === "Manual LinkedIn company/founder URL input" && filters.linkedInUrl) {
    return [createManualOpportunity(filters.linkedInUrl, "Manual LinkedIn company/founder URL input", filters)];
  }

  if (filters.leadSource && filters.leadSource !== "DEMO mode" && filters.leadSource !== "DEMO") {
    return [];
  }

  return filterDemoOpportunities(filters);
}

export function discoveredLeadToLeadInput(lead: DiscoveredLead): LeadInput {
  return {
    businessName: lead.businessName,
    email: known(lead.contactEmail),
    phoneNumber: known(lead.phone),
    website: known(lead.website),
    country: known(lead.country) || "Egypt",
    city: known(lead.city),
    industry: lead.industry,
    businessType: lead.businessType,
    businessStage: lead.businessStage,
    source: `Lead Discovery - ${lead.source}`,
    leadStatus: lead.verificationStatus === "Verified" ? "New" : "Needs Manual Review",
    leadScore: lead.opportunityScore,
    priority: lead.priority,
    estimatedOpportunity: lead.diagnosis.estimatedImpact,
    monthlyAdSpendEstimate: "Unknown",
    websiteQualityScore: lead.websiteQualityScore,
    socialMediaQualityScore: Math.max(1, 10 - lead.contentOpportunityScore),
    adsPresence: lead.missingOpportunities.includes("No clear funnel") || lead.missingOpportunities.includes("No retargeting setup") ? "Weak or unclear" : "Unknown",
    trackingQuality: lead.tags.includes("Tracking unclear") ? "Tracking unclear" : "Unknown",
    whatTheyAreMissing: lead.diagnosis.whatTheyAreMissing,
    howRayqCanHelp: lead.diagnosis.whatRayqCanDo,
    personalizedOutreachAngle: lead.diagnosis.personalizedAuditAngle,
    firstMessageDraft: lead.diagnosis.suggestedFirstMessage,
    notes: `Discovery diagnosis: ${lead.missingOpportunities.join(", ")}`,
    bestRayqServiceToPitch: lead.bestRayqServiceToPitch,
    whyItMatters: lead.diagnosis.whyItMatters,
    estimatedImpact: lead.diagnosis.estimatedImpact,
    whyNow: lead.diagnosis.whyNow,
    croOpportunityScore: lead.croOpportunityScore,
    paidAdsOpportunityScore: lead.paidAdsOpportunityScore,
    contentOpportunityScore: lead.contentOpportunityScore,
    trackingOpportunityScore: lead.trackingOpportunityScore,
    overallRayqFitScore: lead.overallRayqFitScore,
    diagnosisTags: lead.tags,
    verificationStatus: lead.verificationStatus,
    contactDataQuality: lead.contactDataQuality,
    opportunityType: lead.opportunityType,
    bestOutreachChannel: lead.bestOutreachChannel,
    dataConfidenceScore: lead.dataConfidenceScore
  };
}

function known(value: string) {
  return value && value !== "Not found" ? value : "";
}

function createWebsiteListOpportunities(filters: Partial<DiscoveryFilters>) {
  return (filters.websiteList || "")
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((website) => createManualOpportunity(website, "Website URL paste list", filters));
}

function createManualOpportunity(value: string, source: string, filters: Partial<DiscoveryFilters>): DiscoveredLead {
  const isWebsite = /^https?:\/\//i.test(value) || value.includes(".");
  const opportunityScore = isWebsite ? 45 : 30;
  return {
    id: `MANUAL-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    businessName: "Not found",
    website: isWebsite ? normalizeWebsite(value) : "Not found",
    country: filters.country || "Not found",
    city: filters.city || "Not found",
    industry: filters.industry || "Not found",
    businessType: filters.businessType || "Not found",
    businessStage: "Growing",
    source,
    verificationStatus: "Needs review",
    contactDataQuality: "Missing",
    opportunityType: ["Weak website"],
    bestOutreachChannel: source.includes("Instagram") ? "Instagram DM" : source.includes("LinkedIn") ? "LinkedIn" : "Email",
    dataConfidenceScore: isWebsite ? 28 : 18,
    fieldConfidence: {
      businessName: 0,
      website: isWebsite ? 80 : 0,
      phone: 0,
      email: 0,
      address: 0,
      city: filters.city ? 50 : 0,
      country: filters.country ? 50 : 0,
      category: filters.industry ? 45 : 0,
      rating: 0,
      googleMapsUrl: 0,
      sourceUrl: isWebsite ? 80 : 0,
      launchSignal: 0
    },
    address: "Not found",
    category: filters.industry || "Not found",
    rating: null,
    googleMapsUrl: "Not found",
    sourceUrl: isWebsite ? normalizeWebsite(value) : value,
    launchSignal: "Manual source provided",
    signalType: "Manual input",
    opportunityScore,
    priority: priorityFromScore(opportunityScore),
    missingOpportunities: ["Needs manual review"],
    bestRayqServiceToPitch: filters.serviceToPitch || "Growth Strategy",
    suggestedOutreachAngle: "Manual source provided. Verify business name, contact details, and website quality before outreach.",
    contactEmail: "Not found",
    phone: "Not found",
    websiteQualityScore: isWebsite ? 5 : 1,
    croOpportunityScore: 5,
    paidAdsOpportunityScore: 5,
    contentOpportunityScore: 5,
    trackingOpportunityScore: 5,
    overallRayqFitScore: 5,
    tags: ["Needs manual review"],
    diagnosis: {
      whatTheyAreMissing: "Unknown until manually reviewed.",
      whyItMatters: "The source URL is user-provided, but business and contact data are not verified yet.",
      whatRayqCanDo: "Verify the business, then audit website, paid media, content, and tracking opportunities.",
      bestRayqServiceToPitch: filters.serviceToPitch || "Growth Strategy",
      estimatedImpact: "Unknown until verified.",
      whyNow: "Unknown until verified.",
      personalizedAuditAngle: "Manual source needs review before any outreach angle is used.",
      suggestedFirstMessage: "Do not contact yet. Verify the business details first."
    }
  };
}

function normalizeWebsite(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}
