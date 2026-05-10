import { promises as fs } from "fs";
import path from "path";
import type { Lead, LeadInput } from "@/types/lead";
import { addDaysIso, currencyOpportunity, todayIso } from "@/lib/utils";
import { calculateLeadScore } from "@/lib/scoring";
import { generateOutreach } from "@/lib/outreach";

const dataPath = path.join(process.cwd(), "data", "leads.json");

export async function readLeads(): Promise<Lead[]> {
  const raw = await fs.readFile(dataPath, "utf8");
  return JSON.parse(raw) as Lead[];
}

export async function writeLeads(leads: Lead[]) {
  await fs.writeFile(dataPath, JSON.stringify(leads, null, 2));
}

export function createLead(input: LeadInput): Lead {
  const now = todayIso();
  const score = calculateLeadScore(input);
  const outreach = generateOutreach({ ...input, leadScore: score.score, priority: score.priority });

  return {
    id: `RAYQ-${Date.now().toString().slice(-6)}`,
    businessName: input.businessName,
    contactPersonName: input.contactPersonName || "",
    jobTitle: input.jobTitle || "",
    email: input.email || "",
    phoneNumber: input.phoneNumber || "",
    website: input.website || "",
    instagram: input.instagram || "",
    linkedIn: input.linkedIn || "",
    country: input.country || "Egypt",
    city: input.city || "",
    industry: input.industry || "E-commerce",
    businessType: input.businessType || "E-commerce brand",
    source: input.source || "Manual",
    leadStatus: input.leadStatus || "New",
    priority: input.priority || score.priority,
    leadScore: input.leadScore || score.score,
    estimatedOpportunity: input.estimatedOpportunity || currencyOpportunity(score.score),
    monthlyAdSpendEstimate: input.monthlyAdSpendEstimate || "Unknown",
    websiteQualityScore: Number(input.websiteQualityScore || 5),
    socialMediaQualityScore: Number(input.socialMediaQualityScore || 5),
    adsPresence: input.adsPresence || "Unknown",
    trackingQuality: input.trackingQuality || "Unknown",
    whatTheyAreMissing: input.whatTheyAreMissing || score.reasons.join(", "),
    howRayqCanHelp: input.howRayqCanHelp || "Paid media, CRO, creatives, tracking, dashboards, and lifecycle marketing.",
    personalizedOutreachAngle: input.personalizedOutreachAngle || input.whatTheyAreMissing || "growth, conversion, and tracking",
    firstMessageDraft: input.firstMessageDraft || outreach.instagramDm,
    followUp1Draft: input.followUp1Draft || outreach.followUp1,
    followUp2Draft: input.followUp2Draft || outreach.followUp2,
    notes: input.notes || "",
    assignedFounder: input.assignedFounder || "Omar",
    lastContactedDate: input.lastContactedDate || "",
    nextFollowUpDate: input.nextFollowUpDate || addDaysIso(2),
    createdDate: now,
    updatedDate: now,
    businessStage: input.businessStage,
    bestRayqServiceToPitch: input.bestRayqServiceToPitch,
    whyItMatters: input.whyItMatters,
    estimatedImpact: input.estimatedImpact,
    whyNow: input.whyNow,
    croOpportunityScore: input.croOpportunityScore,
    paidAdsOpportunityScore: input.paidAdsOpportunityScore,
    contentOpportunityScore: input.contentOpportunityScore,
    trackingOpportunityScore: input.trackingOpportunityScore,
    overallRayqFitScore: input.overallRayqFitScore,
    diagnosisTags: input.diagnosisTags,
    verificationStatus: input.verificationStatus,
    contactDataQuality: input.contactDataQuality,
    opportunityType: input.opportunityType,
    bestOutreachChannel: input.bestOutreachChannel,
    dataConfidenceScore: input.dataConfidenceScore
  };
}

export async function addLead(input: LeadInput) {
  const leads = await readLeads();
  const lead = createLead(input);
  leads.unshift(lead);
  await writeLeads(leads);
  return lead;
}
