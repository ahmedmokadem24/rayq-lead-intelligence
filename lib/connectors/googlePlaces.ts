import type { DiscoveredLead, DiscoveryFilters, FieldConfidence } from "@/types/lead";
import { priorityFromScore } from "@/lib/scoring";
import { applyWebsiteAnalysis } from "@/lib/discovery/websiteAnalysis";

export class GooglePlacesError extends Error {
  status: number;
  code: string;
  detail?: string;

  constructor(message: string, options: { status: number; code: string; detail?: string }) {
    super(message);
    this.name = "GooglePlacesError";
    this.status = options.status;
    this.code = options.code;
    this.detail = options.detail;
  }
}

export async function searchGooglePlaces(filters: Partial<DiscoveryFilters>) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!apiKey) {
    throw new GooglePlacesError("GOOGLE_PLACES_API_KEY is not configured in this project folder. Add it to .env.local and restart the Next.js server.", {
      status: 500,
      code: "GOOGLE_PLACES_KEY_MISSING"
    });
  }

  const limit = normalizeLimit(filters.resultsLimit);
  const requestedPages = Math.ceil(limit / 20);
  const queries = buildPlacesQueries(filters);
  const collected: DiscoveredLead[] = [];
  const seen = new Set<string>();

  for (const textQuery of queries) {
    let pageToken: string | undefined;

    for (let page = 1; page <= requestedPages && collected.length < limit; page += 1) {
      const data = await fetchGooglePlacesPage({ apiKey, textQuery, pageToken });
      const mapped = (data.places || []).map((place) => applyWebsiteAnalysis(mapGooglePlace(place, filters)));

      for (const lead of mapped) {
        const keys = dedupeKeys(lead);
        if (!keys.some((key) => seen.has(key))) {
          keys.forEach((key) => seen.add(key));
          collected.push(lead);
        }
        if (collected.length >= limit) break;
      }

      pageToken = data.nextPageToken;
      if (!pageToken) break;
    }
  }

  return collected.slice(0, limit);
}

async function fetchGooglePlacesPage({
  apiKey,
  textQuery,
  pageToken
}: {
  apiKey: string;
  textQuery: string;
  pageToken?: string;
}) {
  let response: Response;

  try {
    response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey,
        "x-goog-fieldmask": [
          "nextPageToken",
          "places.id",
          "places.displayName",
          "places.formattedAddress",
          "places.nationalPhoneNumber",
          "places.internationalPhoneNumber",
          "places.websiteUri",
          "places.googleMapsUri",
          "places.rating",
          "places.types",
          "places.primaryTypeDisplayName",
          "places.addressComponents"
        ].join(",")
      },
      body: JSON.stringify({
        textQuery,
        pageSize: 20,
        pageToken,
        languageCode: "en"
      })
    });
  } catch (error) {
    throw new GooglePlacesError("Could not reach Google Places API from the server.", {
      status: 502,
      code: "GOOGLE_PLACES_NETWORK_ERROR",
      detail: error instanceof Error ? error.message : "Unknown network error"
    });
  }

  if (!response.ok) {
    const detail = await safeReadError(response);
    throw new GooglePlacesError(`Google Places API request failed with HTTP ${response.status}.`, {
      status: response.status,
      code: "GOOGLE_PLACES_API_ERROR",
      detail
    });
  }

  return (await response.json()) as GooglePlacesResponse;
}

async function safeReadError(response: Response) {
  try {
    const raw = await response.text();
    return raw.slice(0, 1200);
  } catch {
    return "Could not read Google Places error body.";
  }
}

function buildPlacesQuery(filters: Partial<DiscoveryFilters>) {
  return [
    filters.query,
    filters.industry,
    filters.businessType,
    filters.city,
    filters.country
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || "businesses";
}

function buildPlacesQueries(filters: Partial<DiscoveryFilters>) {
  const keywords = (filters.query || "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  if (!keywords.length) return [buildPlacesQuery(filters)];

  return keywords.map((keyword) =>
    [
      keyword,
      filters.industry,
      filters.businessType,
      filters.city,
      filters.country
    ]
      .filter(Boolean)
      .join(" ")
      .trim()
  );
}

function normalizeLimit(value: number | undefined) {
  const limit = Number(value || 10);
  return [10, 20, 40, 60].includes(limit) ? limit : 10;
}

function dedupeKeys(lead: DiscoveredLead) {
  const keys = [`id:${lead.id}`];
  if (lead.website !== "Not found") keys.push(`website:${lead.website.toLowerCase().replace(/\/$/, "")}`);
  if (lead.phone !== "Not found") keys.push(`phone:${lead.phone.replace(/\D/g, "")}`);
  keys.push(`name:${lead.businessName.toLowerCase()}|${lead.address.toLowerCase()}`);
  return keys;
}

function mapGooglePlace(place: GooglePlace, filters: Partial<DiscoveryFilters>): DiscoveredLead {
  const businessName = place.displayName?.text || "Not found";
  const website = place.websiteUri || "Not found";
  const phone = place.internationalPhoneNumber || place.nationalPhoneNumber || "Not found";
  const address = place.formattedAddress || "Not found";
  const category = place.primaryTypeDisplayName?.text || place.types?.[0] || filters.industry || "Not found";
  const city = findAddressPart(place, ["locality", "administrative_area_level_2"]) || filters.city || "Not found";
  const country = findAddressPart(place, ["country"]) || filters.country || "Not found";
  const googleMapsUrl = place.googleMapsUri || "Not found";
  const rating = typeof place.rating === "number" ? place.rating : null;
  const fieldConfidence: FieldConfidence = {
    businessName: businessName === "Not found" ? 0 : 95,
    website: website === "Not found" ? 0 : 85,
    phone: phone === "Not found" ? 0 : 85,
    email: 0,
    address: address === "Not found" ? 0 : 90,
    city: city === "Not found" ? 0 : 80,
    country: country === "Not found" ? 0 : 80,
    category: category === "Not found" ? 0 : 70,
    rating: rating === null ? 0 : 90,
    googleMapsUrl: googleMapsUrl === "Not found" ? 0 : 95,
    sourceUrl: googleMapsUrl === "Not found" ? 0 : 95,
    launchSignal: 0
  };
  const dataConfidenceScore = Math.round(Object.values(fieldConfidence).reduce((sum, value) => sum + value, 0) / Object.values(fieldConfidence).length);
  const contactDataQuality = phone !== "Not found" && website !== "Not found" ? "Medium" : phone !== "Not found" || website !== "Not found" ? "Weak" : "Missing";
  const opportunityScore = calculateGoogleOpportunityScore({ website, country, category, contactDataQuality });

  return {
    id: `GPLACES-${place.id || crypto.randomUUID()}`,
    businessName,
    website,
    country,
    city,
    industry: filters.industry || category,
    businessType: filters.businessType || "Not found",
    businessStage: "Growing",
    source: "Google Places",
    verificationStatus: dataConfidenceScore >= 80 ? "Verified" : "Partially verified",
    contactDataQuality,
    opportunityType: ["Growing business", website === "Not found" ? "Weak website" : "Weak tracking"],
    bestOutreachChannel: phone !== "Not found" ? "Call" : "Email",
    dataConfidenceScore,
    fieldConfidence,
    address,
    category,
    rating,
    googleMapsUrl,
    sourceUrl: googleMapsUrl,
    launchSignal: "Business found in Google Places",
    signalType: "Business listing",
    opportunityScore,
    priority: priorityFromScore(opportunityScore),
    missingOpportunities: ["Tracking unclear", "Needs manual website and funnel review"],
    bestRayqServiceToPitch: filters.serviceToPitch || "Performance Marketing",
    suggestedOutreachAngle: "verified Google business profile, website funnel, and tracking audit",
    contactEmail: "Not found",
    phone,
    websiteQualityScore: website === "Not found" ? 1 : 6,
    croOpportunityScore: website === "Not found" ? 9 : 7,
    paidAdsOpportunityScore: 7,
    contentOpportunityScore: 6,
    trackingOpportunityScore: 8,
    overallRayqFitScore: 7,
    tags: ["Tracking unclear"],
    diagnosis: {
      whatTheyAreMissing: "Needs manual review for website quality, tracking, paid funnel, and content opportunities.",
      whyItMatters: "Google Places verifies the business exists, but marketing gaps should be confirmed before outreach.",
      whatRayqCanDo: "Run a review-first audit of website, paid media, CRO, tracking, and growth opportunities.",
      bestRayqServiceToPitch: filters.serviceToPitch || "Performance Marketing",
      estimatedImpact: "Potential improvement depends on manual audit findings.",
      whyNow: "Businesses with verified public profiles can be qualified into a targeted audit workflow.",
      personalizedAuditAngle: "Use their verified Google profile as the starting point for a website and tracking audit.",
      suggestedFirstMessage: `Hi, I found ${businessName} through Google business results and wanted to share a few review-based ideas around website conversion, tracking, and growth. Would you be open to a short audit?`
    }
  };
}

function calculateGoogleOpportunityScore({
  website,
  country,
  category,
  contactDataQuality
}: {
  website: string;
  country: string;
  category: string;
  contactDataQuality: string;
}) {
  let score = 35;
  if (website !== "Not found") score += 15;
  if (/uae|saudi|kuwait|qatar|gcc/i.test(country)) score += 15;
  if (/clinic|real estate|furniture|fashion|restaurant|fitness|store|ecommerce|shop/i.test(category)) score += 15;
  if (contactDataQuality !== "Missing") score += 10;
  return Math.min(score, 100);
}

function findAddressPart(place: GooglePlace, types: string[]) {
  return place.addressComponents?.find((component) => component.types?.some((type) => types.includes(type)))?.longText;
}

type GooglePlacesResponse = {
  places?: GooglePlace[];
  nextPageToken?: string;
};

type GooglePlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
  rating?: number;
  types?: string[];
  primaryTypeDisplayName?: { text?: string };
  addressComponents?: Array<{ longText?: string; shortText?: string; types?: string[] }>;
};
