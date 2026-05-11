import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Lead, LeadInput } from "@/types/lead";
import { addDaysIso, currencyOpportunity, todayIso } from "@/lib/utils";
import { calculateLeadScore } from "@/lib/scoring";
import { generateOutreach } from "@/lib/outreach";

const dataPath = path.join(process.cwd(), "data", "leads.json");

type DbLead = Record<string, unknown>;

export class StorageConfigError extends Error {
  constructor() {
    super(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in Vercel. Local JSON storage is development-only."
    );
    this.name = "StorageConfigError";
  }
}

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const key = serviceKey || anonKey;
  return { url, key, hasConfig: Boolean(url && key) };
}

function shouldUseLocalJson() {
  return !supabaseConfig().hasConfig && process.env.NODE_ENV !== "production";
}

function assertSupabase() {
  const config = supabaseConfig();
  if (!config.hasConfig) throw new StorageConfigError();
  return config as { url: string; key: string; hasConfig: true };
}

async function supabaseRequest<T>(pathName: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = assertSupabase();
  const response = await fetch(`${url}/rest/v1/${pathName}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Supabase request failed (${response.status}): ${details || response.statusText}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function dateOrNull(value?: string) {
  return value && value.trim() ? value : null;
}

function str(value: unknown) {
  return typeof value === "string" ? value : "";
}

function num(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function arr(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : undefined;
}

function toDbLead(lead: Lead): DbLead {
  return {
    id: lead.id,
    business_name: lead.businessName,
    contact_person_name: lead.contactPersonName,
    job_title: lead.jobTitle,
    email: lead.email,
    phone_number: lead.phoneNumber,
    website: lead.website,
    instagram: lead.instagram,
    linkedin: lead.linkedIn,
    country: lead.country,
    city: lead.city,
    industry: lead.industry,
    business_type: lead.businessType,
    source: lead.source,
    lead_status: lead.leadStatus,
    priority: lead.priority,
    lead_score: lead.leadScore,
    estimated_opportunity: lead.estimatedOpportunity,
    monthly_ad_spend_estimate: lead.monthlyAdSpendEstimate,
    website_quality_score: lead.websiteQualityScore,
    social_media_quality_score: lead.socialMediaQualityScore,
    ads_presence: lead.adsPresence,
    tracking_quality: lead.trackingQuality,
    what_they_are_missing: lead.whatTheyAreMissing,
    how_rayq_can_help: lead.howRayqCanHelp,
    personalized_outreach_angle: lead.personalizedOutreachAngle,
    first_message_draft: lead.firstMessageDraft,
    follow_up_1_draft: lead.followUp1Draft,
    follow_up_2_draft: lead.followUp2Draft,
    notes: lead.notes,
    assigned_founder: lead.assignedFounder,
    last_contacted_date: dateOrNull(lead.lastContactedDate),
    next_follow_up_date: dateOrNull(lead.nextFollowUpDate),
    created_date: dateOrNull(lead.createdDate),
    updated_date: dateOrNull(lead.updatedDate),
    business_stage: lead.businessStage,
    best_rayq_service_to_pitch: lead.bestRayqServiceToPitch,
    why_it_matters: lead.whyItMatters,
    estimated_impact: lead.estimatedImpact,
    why_now: lead.whyNow,
    cro_opportunity_score: lead.croOpportunityScore,
    paid_ads_opportunity_score: lead.paidAdsOpportunityScore,
    content_opportunity_score: lead.contentOpportunityScore,
    tracking_opportunity_score: lead.trackingOpportunityScore,
    overall_rayq_fit_score: lead.overallRayqFitScore,
    diagnosis_tags: lead.diagnosisTags,
    verification_status: lead.verificationStatus,
    contact_data_quality: lead.contactDataQuality,
    opportunity_type: lead.opportunityType,
    best_outreach_channel: lead.bestOutreachChannel,
    data_confidence_score: lead.dataConfidenceScore
  };
}

function fromDbLead(row: DbLead): Lead {
  return {
    id: str(row.id),
    businessName: str(row.business_name),
    contactPersonName: str(row.contact_person_name),
    jobTitle: str(row.job_title),
    email: str(row.email),
    phoneNumber: str(row.phone_number),
    website: str(row.website),
    instagram: str(row.instagram),
    linkedIn: str(row.linkedin),
    country: str(row.country),
    city: str(row.city),
    industry: str(row.industry),
    businessType: str(row.business_type),
    source: str(row.source),
    leadStatus: (str(row.lead_status) || "New") as Lead["leadStatus"],
    priority: (str(row.priority) || "Low") as Lead["priority"],
    leadScore: num(row.lead_score),
    estimatedOpportunity: str(row.estimated_opportunity),
    monthlyAdSpendEstimate: str(row.monthly_ad_spend_estimate),
    websiteQualityScore: num(row.website_quality_score, 5),
    socialMediaQualityScore: num(row.social_media_quality_score, 5),
    adsPresence: str(row.ads_presence),
    trackingQuality: str(row.tracking_quality),
    whatTheyAreMissing: str(row.what_they_are_missing),
    howRayqCanHelp: str(row.how_rayq_can_help),
    personalizedOutreachAngle: str(row.personalized_outreach_angle),
    firstMessageDraft: str(row.first_message_draft),
    followUp1Draft: str(row.follow_up_1_draft),
    followUp2Draft: str(row.follow_up_2_draft),
    notes: str(row.notes),
    assignedFounder: (str(row.assigned_founder) || "Omar") as Lead["assignedFounder"],
    lastContactedDate: str(row.last_contacted_date),
    nextFollowUpDate: str(row.next_follow_up_date),
    createdDate: str(row.created_date),
    updatedDate: str(row.updated_date),
    businessStage: row.business_stage as Lead["businessStage"],
    bestRayqServiceToPitch: str(row.best_rayq_service_to_pitch) || undefined,
    whyItMatters: str(row.why_it_matters) || undefined,
    estimatedImpact: str(row.estimated_impact) || undefined,
    whyNow: str(row.why_now) || undefined,
    croOpportunityScore: row.cro_opportunity_score === null ? undefined : num(row.cro_opportunity_score),
    paidAdsOpportunityScore: row.paid_ads_opportunity_score === null ? undefined : num(row.paid_ads_opportunity_score),
    contentOpportunityScore: row.content_opportunity_score === null ? undefined : num(row.content_opportunity_score),
    trackingOpportunityScore: row.tracking_opportunity_score === null ? undefined : num(row.tracking_opportunity_score),
    overallRayqFitScore: row.overall_rayq_fit_score === null ? undefined : num(row.overall_rayq_fit_score),
    diagnosisTags: arr(row.diagnosis_tags),
    verificationStatus: row.verification_status as Lead["verificationStatus"],
    contactDataQuality: row.contact_data_quality as Lead["contactDataQuality"],
    opportunityType: arr(row.opportunity_type) as Lead["opportunityType"],
    bestOutreachChannel: row.best_outreach_channel as Lead["bestOutreachChannel"],
    dataConfidenceScore: row.data_confidence_score === null ? undefined : num(row.data_confidence_score)
  };
}

function toDbPatch(patch: Partial<Lead>): DbLead {
  const dbPatch: DbLead = {};
  const set = (key: string, value: unknown) => {
    if (value !== undefined) dbPatch[key] = value;
  };

  set("business_name", patch.businessName);
  set("contact_person_name", patch.contactPersonName);
  set("job_title", patch.jobTitle);
  set("email", patch.email);
  set("phone_number", patch.phoneNumber);
  set("website", patch.website);
  set("instagram", patch.instagram);
  set("linkedin", patch.linkedIn);
  set("country", patch.country);
  set("city", patch.city);
  set("industry", patch.industry);
  set("business_type", patch.businessType);
  set("source", patch.source);
  set("lead_status", patch.leadStatus);
  set("priority", patch.priority);
  set("lead_score", patch.leadScore);
  set("estimated_opportunity", patch.estimatedOpportunity);
  set("monthly_ad_spend_estimate", patch.monthlyAdSpendEstimate);
  set("website_quality_score", patch.websiteQualityScore);
  set("social_media_quality_score", patch.socialMediaQualityScore);
  set("ads_presence", patch.adsPresence);
  set("tracking_quality", patch.trackingQuality);
  set("what_they_are_missing", patch.whatTheyAreMissing);
  set("how_rayq_can_help", patch.howRayqCanHelp);
  set("personalized_outreach_angle", patch.personalizedOutreachAngle);
  set("first_message_draft", patch.firstMessageDraft);
  set("follow_up_1_draft", patch.followUp1Draft);
  set("follow_up_2_draft", patch.followUp2Draft);
  set("notes", patch.notes);
  set("assigned_founder", patch.assignedFounder);
  set("last_contacted_date", patch.lastContactedDate === undefined ? undefined : dateOrNull(patch.lastContactedDate));
  set("next_follow_up_date", patch.nextFollowUpDate === undefined ? undefined : dateOrNull(patch.nextFollowUpDate));
  set("created_date", patch.createdDate === undefined ? undefined : dateOrNull(patch.createdDate));
  set("updated_date", patch.updatedDate === undefined ? undefined : dateOrNull(patch.updatedDate));
  set("business_stage", patch.businessStage);
  set("best_rayq_service_to_pitch", patch.bestRayqServiceToPitch);
  set("why_it_matters", patch.whyItMatters);
  set("estimated_impact", patch.estimatedImpact);
  set("why_now", patch.whyNow);
  set("cro_opportunity_score", patch.croOpportunityScore);
  set("paid_ads_opportunity_score", patch.paidAdsOpportunityScore);
  set("content_opportunity_score", patch.contentOpportunityScore);
  set("tracking_opportunity_score", patch.trackingOpportunityScore);
  set("overall_rayq_fit_score", patch.overallRayqFitScore);
  set("diagnosis_tags", patch.diagnosisTags);
  set("verification_status", patch.verificationStatus);
  set("contact_data_quality", patch.contactDataQuality);
  set("opportunity_type", patch.opportunityType);
  set("best_outreach_channel", patch.bestOutreachChannel);
  set("data_confidence_score", patch.dataConfidenceScore);
  return dbPatch;
}

async function readLocalLeads(): Promise<Lead[]> {
  const raw = await fs.readFile(dataPath, "utf8");
  return JSON.parse(raw) as Lead[];
}

async function writeLocalLeads(leads: Lead[]) {
  await fs.writeFile(dataPath, JSON.stringify(leads, null, 2));
}

export async function readLeads(): Promise<Lead[]> {
  if (shouldUseLocalJson()) return readLocalLeads();
  const rows = await supabaseRequest<DbLead[]>("leads?select=*&order=created_date.desc");
  return rows.map(fromDbLead);
}

export async function getLead(id: string): Promise<Lead | null> {
  if (shouldUseLocalJson()) {
    const leads = await readLocalLeads();
    return leads.find((lead) => lead.id === id) || null;
  }
  const rows = await supabaseRequest<DbLead[]>(`leads?select=*&id=eq.${encodeURIComponent(id)}&limit=1`);
  return rows[0] ? fromDbLead(rows[0]) : null;
}

export async function writeLeads(leads: Lead[]) {
  if (shouldUseLocalJson()) {
    await writeLocalLeads(leads);
    return;
  }

  await supabaseRequest("leads?id=not.is.null", { method: "DELETE" });
  if (leads.length) {
    await supabaseRequest("leads", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(leads.map(toDbLead))
    });
  }
}

export function createLead(input: LeadInput): Lead {
  const now = todayIso();
  const score = calculateLeadScore(input);
  const outreach = generateOutreach({ ...input, leadScore: score.score, priority: score.priority });

  return {
    id: `RAYQ-${randomUUID().slice(0, 8).toUpperCase()}`,
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
  const lead = createLead(input);
  if (shouldUseLocalJson()) {
    const leads = await readLocalLeads();
    leads.unshift(lead);
    await writeLocalLeads(leads);
    return lead;
  }

  const rows = await supabaseRequest<DbLead[]>("leads", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(toDbLead(lead))
  });
  return fromDbLead(rows[0]);
}

export async function updateLead(id: string, patch: Partial<Lead>) {
  const updatedDate = todayIso();
  if (shouldUseLocalJson()) {
    const leads = await readLocalLeads();
    const index = leads.findIndex((lead) => lead.id === id);
    if (index < 0) return null;
    const merged = { ...leads[index], ...patch, updatedDate };
    const score = calculateLeadScore(merged);
    leads[index] = { ...merged, leadScore: score.score, priority: score.priority };
    await writeLocalLeads(leads);
    return leads[index];
  }

  const current = await getLead(id);
  if (!current) return null;
  const merged = { ...current, ...patch, updatedDate };
  const score = calculateLeadScore(merged);
  const rows = await supabaseRequest<DbLead[]>(`leads?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(toDbPatch({ ...patch, leadScore: score.score, priority: score.priority, updatedDate }))
  });
  return rows[0] ? fromDbLead(rows[0]) : null;
}

export async function deleteLead(id: string) {
  return deleteLeads([id]);
}

export async function deleteLeads(ids: string[]) {
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
  if (!uniqueIds.length) return 0;

  if (shouldUseLocalJson()) {
    const leads = await readLocalLeads();
    const remaining = leads.filter((lead) => !uniqueIds.includes(lead.id));
    await writeLocalLeads(remaining);
    return leads.length - remaining.length;
  }

  let deleted = 0;
  for (const id of uniqueIds) {
    await supabaseRequest(`leads?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
    deleted += 1;
  }
  return deleted;
}

export async function removeDemoLeads() {
  const isDemo = (source = "") => /demo|mock data|sample/i.test(source);
  const leads = await readLeads();
  const demoIds = leads.filter((lead) => isDemo(lead.source)).map((lead) => lead.id);
  return deleteLeads(demoIds);
}
