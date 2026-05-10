import type { Lead, Priority } from "@/types/lead";

export function priorityFromScore(score: number): Priority {
  if (score >= 81) return "Very High";
  if (score >= 61) return "High";
  if (score >= 36) return "Medium";
  return "Low";
}

export function calculateLeadScore(lead: Partial<Lead>) {
  let score = 0;
  const reasons: string[] = [];
  const country = (lead.country || "").toLowerCase();
  const industry = (lead.industry || "").toLowerCase();
  const businessType = (lead.businessType || "").toLowerCase();
  const missing = (lead.whatTheyAreMissing || "").toLowerCase();
  const websiteScore = Number(lead.websiteQualityScore || 0);
  const socialScore = Number(lead.socialMediaQualityScore || 0);
  const stage = (lead.businessStage || "").toLowerCase();
  const bestService = (lead.bestRayqServiceToPitch || lead.howRayqCanHelp || "").toLowerCase();

  if (/new|launch|newly/.test(stage) || /new launch|newly active/.test(missing)) {
    score += 15;
    reasons.push("New launch or newly active business");
  }

  if (/mid-sized|mid sized|weak marketing/.test(`${stage} ${missing}`)) {
    score += 20;
    reasons.push("Mid-sized business with weak marketing");
  }

  if (lead.website && /cro|conversion|landing|cta/.test(missing)) {
    score += 15;
    reasons.push("Has website but weak CRO");
  }

  if (lead.instagram && socialScore > 0 && socialScore <= 6) {
    score += 10;
    reasons.push("Has Instagram but weak content");
  }

  if (/e-commerce|ecommerce|shopify/.test(`${industry} ${businessType}`)) {
    score += 15;
    reasons.push("E-commerce business");
  }

  if (/real estate|clinic|fitness|furniture|high-ticket|b2b|luxury/.test(`${industry} ${businessType}`)) {
    score += 15;
    reasons.push("High-ticket product or service");
  }

  if (/uae|saudi|kuwait|qatar|gcc/.test(country)) {
    score += 15;
    reasons.push("GCC market fit");
  }

  if (lead.email || lead.phoneNumber || lead.instagram || lead.linkedIn) {
    score += 10;
    reasons.push("Contact info available");
  }

  if (websiteScore > 0 && websiteScore <= 5) {
    score += 10;
    reasons.push("Weak website");
  }

  if (/capture|whatsapp|email|retarget|funnel|cta/.test(missing)) {
    score += 10;
    reasons.push("Missing WhatsApp or email capture");
  }

  if (!lead.adsPresence || /none|weak|unclear|no|funnel/i.test(lead.adsPresence) || /ads funnel|paid acquisition|retarget/.test(missing)) {
    score += 15;
    reasons.push("Missing clear ads funnel");
  }

  if (/performance|website|cro|creative|tracking|analytics|whatsapp|growth|paid/.test(bestService)) {
    score += 20;
    reasons.push("Strong fit for RAYQ services");
  }

  return {
    score: Math.min(score, 100),
    priority: priorityFromScore(Math.min(score, 100)),
    reasons
  };
}
