import type { DiscoveredLead, DiscoveryFilters, FieldConfidence } from "@/types/lead";
import { applyWebsiteAnalysis } from "@/lib/discovery/websiteAnalysis";
import { priorityFromScore } from "@/lib/scoring";

export async function searchWebResults(filters: Partial<DiscoveryFilters>) {
  const apiKey = process.env.SERPAPI_API_KEY || process.env.SEARCH_API_KEY;
  if (!apiKey) {
    throw new Error("SERPAPI_API_KEY or SEARCH_API_KEY is not configured. Use DEMO mode or add the key to .env.local.");
  }

  const query = buildSearchQuery(filters);
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google");
  url.searchParams.set("q", query);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("num", "10");

  const response = await fetch(url);
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Search API request failed: ${response.status} ${detail}`);
  }

  const data = (await response.json()) as SerpApiResponse;
  return (data.organic_results || []).map((result, index) => applyWebsiteAnalysis(mapSearchResult(result, index, filters, query)));
}

function buildSearchQuery(filters: Partial<DiscoveryFilters>) {
  const keyword = filters.query || filters.industry || "new business";
  return [keyword, filters.city, filters.country].filter(Boolean).join(" ").trim();
}

function mapSearchResult(result: SerpResult, index: number, filters: Partial<DiscoveryFilters>, query: string): DiscoveredLead {
  const sourceUrl = result.link || "Not found";
  const website = sourceUrl;
  const launchSignal = detectLaunchSignal(`${result.title || ""} ${result.snippet || ""} ${query}`);
  const signalType = signalTypeFromLaunchSignal(launchSignal);
  const fieldConfidence: FieldConfidence = {
    businessName: result.title ? 45 : 0,
    website: sourceUrl === "Not found" ? 0 : 75,
    phone: 0,
    email: 0,
    address: 0,
    city: filters.city ? 55 : 0,
    country: filters.country ? 55 : 0,
    category: filters.industry ? 55 : 0,
    rating: 0,
    googleMapsUrl: 0,
    sourceUrl: sourceUrl === "Not found" ? 0 : 80,
    launchSignal: launchSignal === "Needs review" ? 30 : 75
  };
  const dataConfidenceScore = Math.round(Object.values(fieldConfidence).reduce((sum, value) => sum + value, 0) / Object.values(fieldConfidence).length);
  const opportunityScore = Math.min(100, 45 + (launchSignal === "Needs review" ? 0 : 20) + (website === "Not found" ? 0 : 15) + (/uae|saudi|kuwait|qatar|gcc/i.test(filters.country || "") ? 15 : 0));

  return {
    id: `SEARCH-${index}-${sourceUrl}`,
    businessName: result.title || "Not found",
    website,
    country: filters.country || "Not found",
    city: filters.city || "Not found",
    industry: filters.industry || "Not found",
    businessType: filters.businessType || "Not found",
    businessStage: signalType.includes("launch") || signalType.includes("opening") ? "New" : "Growing",
    source: "Search API",
    verificationStatus: "Needs review",
    contactDataQuality: "Missing",
    opportunityType: signalType.includes("launch") || signalType.includes("opening") ? ["New business", "Weak content"] : ["Growing business", "Weak content"],
    bestOutreachChannel: "Email",
    dataConfidenceScore,
    fieldConfidence,
    address: "Not found",
    category: filters.industry || "Not found",
    rating: null,
    googleMapsUrl: "Not found",
    sourceUrl,
    launchSignal,
    signalType,
    opportunityScore,
    priority: priorityFromScore(opportunityScore),
    missingOpportunities: ["Needs manual review", "Tracking unclear"],
    bestRayqServiceToPitch: filters.serviceToPitch || "Growth Strategy",
    suggestedOutreachAngle: `${launchSignal}. Verify the business and pitch a review-first growth audit.`,
    contactEmail: "Not found",
    phone: "Not found",
    websiteQualityScore: website === "Not found" ? 1 : 5,
    croOpportunityScore: 6,
    paidAdsOpportunityScore: 7,
    contentOpportunityScore: 7,
    trackingOpportunityScore: 8,
    overallRayqFitScore: 7,
    tags: ["Tracking unclear", "Needs manual review"],
    diagnosis: {
      whatTheyAreMissing: "Unknown until the website and business are verified. Search result suggests a possible launch or growth signal.",
      whyItMatters: "Launch signals can reveal businesses that need fast paid media, website, creative, and tracking support.",
      whatRayqCanDo: "Verify the result, analyze the website, then prepare a review-first audit angle.",
      bestRayqServiceToPitch: filters.serviceToPitch || "Growth Strategy",
      estimatedImpact: "Unknown until verified.",
      whyNow: launchSignal,
      personalizedAuditAngle: "Use the search signal as context, but verify before outreach.",
      suggestedFirstMessage: "Needs review. Verify the business and contact data before using outreach."
    }
  };
}

function detectLaunchSignal(text: string) {
  const lower = text.toLowerCase();
  const signals = ["now open", "soft opening", "grand opening", "we just launched", "just launched", "new website", "new collection", "new fashion brand", "shopify store"];
  return signals.find((signal) => lower.includes(signal)) || "Needs review";
}

function signalTypeFromLaunchSignal(signal: string) {
  if (/opening|now open/i.test(signal)) return "Opening signal";
  if (/launched|new website/i.test(signal)) return "Launch signal";
  if (/collection|fashion/i.test(signal)) return "Collection signal";
  if (/shopify|store/i.test(signal)) return "Commerce signal";
  return "Needs review";
}

type SerpApiResponse = {
  organic_results?: SerpResult[];
};

type SerpResult = {
  title?: string;
  link?: string;
  snippet?: string;
};
