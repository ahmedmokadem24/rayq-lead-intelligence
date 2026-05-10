import type { AnalyzerInput, AnalyzerResult } from "@/types/lead";
import { priorityFromScore } from "@/lib/scoring";

const weakSignals = ["outdated", "slow", "no cta", "weak", "poor", "missing", "no tracking", "no whatsapp", "no email", "bad", "low"];
const strongMarkets = ["uae", "saudi", "kuwait", "qatar", "gcc"];
const highTicket = ["real estate", "clinic", "furniture", "fitness", "b2b", "service"];

export function analyzeLead(input: AnalyzerInput): AnalyzerResult {
  const haystack = `${input.businessName || ""} ${input.website || ""} ${input.industry || ""} ${input.country || ""} ${input.instagram || ""} ${input.notes || ""}`.toLowerCase();
  const hasWebsite = Boolean(input.website);
  const hasInstagram = Boolean(input.instagram);
  const isStrongMarket = strongMarkets.some((market) => haystack.includes(market));
  const isHighTicket = highTicket.some((term) => haystack.includes(term));
  const weakCount = weakSignals.filter((signal) => haystack.includes(signal)).length;

  const websiteQualityScore = hasWebsite ? Math.max(3, 7 - weakCount) : 2;
  const croOpportunityScore = Math.min(10, 5 + weakCount + (haystack.includes("cta") ? 2 : 0));
  const socialContentOpportunityScore = hasInstagram ? Math.min(10, 5 + weakCount) : 8;
  const contentOpportunityScore = Math.min(10, socialContentOpportunityScore + (haystack.includes("description") ? 1 : 0));
  const paidAdsOpportunityScore = Math.min(10, 5 + weakCount + (isStrongMarket ? 2 : 0) + (isHighTicket ? 1 : 0));
  const trackingOpportunityScore = Math.min(10, 6 + (haystack.includes("tracking") ? 2 : 0) + (haystack.includes("pixel") ? 1 : 0));
  const overallRayqFitScore = Math.round((croOpportunityScore + contentOpportunityScore + paidAdsOpportunityScore + trackingOpportunityScore) / 4);
  const tags = [
    haystack.includes("cta") ? "Weak CTA" : "",
    haystack.includes("landing") ? "Weak landing page" : "",
    haystack.includes("whatsapp") ? "No WhatsApp button" : "",
    haystack.includes("description") ? "Weak product descriptions" : "",
    haystack.includes("seo") ? "Weak SEO" : "",
    haystack.includes("mobile") ? "Poor mobile experience" : "",
    haystack.includes("funnel") ? "No clear funnel" : "",
    haystack.includes("proof") ? "Weak social proof" : "",
    haystack.includes("email") ? "No email capture" : "",
    haystack.includes("retarget") ? "No retargeting setup" : "",
    haystack.includes("tracking") ? "Tracking unclear" : ""
  ].filter(Boolean);

  const mainProblems = [
    websiteQualityScore <= 5 ? "Website may need stronger conversion structure, CTAs, and trust signals." : "Website exists, but should be reviewed for CRO and tracking improvements.",
    socialContentOpportunityScore >= 7 ? "Content can likely be more offer-led, consistent, and conversion-focused." : "Social content has some foundation to build on.",
    paidAdsOpportunityScore >= 7 ? "Paid acquisition, retargeting, and landing page funnel opportunities look promising." : "Paid media opportunity needs more qualification.",
    "Tracking, GA4, GTM, pixels, and dashboard quality should be audited before scaling spend."
  ];

  const rayqOffers = [
    "Paid media strategy across Meta, Google, and TikTok",
    "Landing page or website CRO improvement",
    "AI image and video creative testing system",
    "Tracking, analytics, pixels, GTM, GA4, Shopify tracking, and dashboards",
    "Email and WhatsApp capture, nurture, and retargeting flows"
  ];

  const score = Math.min(
    100,
    (hasWebsite ? 10 : 0) +
      (websiteQualityScore <= 5 ? 15 : 8) +
      (socialContentOpportunityScore >= 7 ? 10 : 5) +
      (paidAdsOpportunityScore >= 7 ? 15 : 6) +
      (isStrongMarket ? 10 : 0) +
      (isHighTicket ? 15 : 5) +
      20
  );

  const businessName = input.businessName || input.website || "your brand";
  const suggestedFirstOutreach = `Hi, I came across ${businessName} and noticed a few quick opportunities around website conversion, paid media, content, and tracking. I run RAYQ Marketing Agency, where we help brands grow through paid media, websites, creatives, and growth strategy. Would you be open to a free 20-minute audit where I show you what I would improve first?`;

  return {
    websiteQualityScore,
    croOpportunityScore,
    socialContentOpportunityScore,
    paidAdsOpportunityScore,
    contentOpportunityScore,
    trackingOpportunityScore,
    overallRayqFitScore,
    tags,
    priority: priorityFromScore(score),
    mainProblems,
    rayqOffers,
    suggestedFirstOutreach,
    score
  };
}
