export const leadStatuses = [
  "New",
  "Researched",
  "Contacted",
  "Follow-up 1 Sent",
  "Follow-up 2 Sent",
  "Call Booked",
  "Proposal Sent",
  "Won",
  "Lost",
  "Not Relevant",
  "Do Not Contact",
  "Needs Manual Review"
] as const;

export const priorities = ["Low", "Medium", "High", "Very High"] as const;

export const founders = ["Omar", "Youssef", "Ahmed"] as const;

export type LeadStatus = (typeof leadStatuses)[number];
export type Priority = (typeof priorities)[number];
export type Founder = (typeof founders)[number];

export type Lead = {
  id: string;
  businessName: string;
  contactPersonName: string;
  jobTitle: string;
  email: string;
  phoneNumber: string;
  website: string;
  instagram: string;
  linkedIn: string;
  country: string;
  city: string;
  industry: string;
  businessType: string;
  source: string;
  leadStatus: LeadStatus;
  priority: Priority;
  leadScore: number;
  estimatedOpportunity: string;
  monthlyAdSpendEstimate: string;
  websiteQualityScore: number;
  socialMediaQualityScore: number;
  adsPresence: string;
  trackingQuality: string;
  whatTheyAreMissing: string;
  howRayqCanHelp: string;
  personalizedOutreachAngle: string;
  firstMessageDraft: string;
  followUp1Draft: string;
  followUp2Draft: string;
  notes: string;
  assignedFounder: Founder;
  lastContactedDate: string;
  nextFollowUpDate: string;
  createdDate: string;
  updatedDate: string;
  businessStage?: BusinessStage;
  bestRayqServiceToPitch?: string;
  whyItMatters?: string;
  estimatedImpact?: string;
  whyNow?: string;
  croOpportunityScore?: number;
  paidAdsOpportunityScore?: number;
  contentOpportunityScore?: number;
  trackingOpportunityScore?: number;
  overallRayqFitScore?: number;
  diagnosisTags?: string[];
  verificationStatus?: VerificationStatus;
  contactDataQuality?: ContactDataQuality;
  opportunityType?: OpportunityType[];
  bestOutreachChannel?: BestOutreachChannel;
  dataConfidenceScore?: number;
};

export type LeadInput = Partial<Omit<Lead, "id" | "createdDate" | "updatedDate">> & {
  businessName: string;
};

export type AnalyzerInput = {
  businessName?: string;
  website?: string;
  industry?: string;
  country?: string;
  instagram?: string;
  notes?: string;
};

export type AnalyzerResult = {
  websiteQualityScore: number;
  croOpportunityScore: number;
  socialContentOpportunityScore: number;
  paidAdsOpportunityScore: number;
  contentOpportunityScore: number;
  trackingOpportunityScore: number;
  overallRayqFitScore: number;
  tags: string[];
  priority: Priority;
  mainProblems: string[];
  rayqOffers: string[];
  suggestedFirstOutreach: string;
  score: number;
};

export const businessStages = ["New", "Growing", "Mid-sized"] as const;

export type BusinessStage = (typeof businessStages)[number];

export type DiscoveryFilters = {
  country: string;
  city: string;
  industry: string;
  businessType: string;
  businessStage: string;
  leadSource: string;
  minimumOpportunityScore: number;
  serviceToPitch: string;
  query?: string;
  websiteList?: string;
  instagramUrl?: string;
  linkedInUrl?: string;
  sourceMode?: "Google Places" | "Search API / SerpAPI" | "DEMO";
  resultsLimit?: number;
};

export const verificationStatuses = ["Verified", "Partially verified", "Needs review", "Demo data"] as const;
export const contactDataQualities = ["Strong", "Medium", "Weak", "Missing"] as const;
export const opportunityTypes = [
  "New business",
  "Growing business",
  "Mid-sized business",
  "Weak website",
  "Weak ads",
  "Weak content",
  "Weak tracking",
  "High-ticket opportunity"
] as const;
export const bestOutreachChannels = ["Email", "WhatsApp", "LinkedIn", "Instagram DM", "Call"] as const;

export type VerificationStatus = (typeof verificationStatuses)[number];
export type ContactDataQuality = (typeof contactDataQualities)[number];
export type OpportunityType = (typeof opportunityTypes)[number];
export type BestOutreachChannel = (typeof bestOutreachChannels)[number];

export type FieldConfidence = {
  businessName: number;
  website: number;
  phone: number;
  email: number;
  address: number;
  city: number;
  country: number;
  category: number;
  rating: number;
  googleMapsUrl: number;
  sourceUrl: number;
  launchSignal: number;
};

export type OpportunityDiagnosis = {
  whatTheyAreMissing: string;
  whyItMatters: string;
  whatRayqCanDo: string;
  bestRayqServiceToPitch: string;
  estimatedImpact: string;
  whyNow: string;
  personalizedAuditAngle: string;
  suggestedFirstMessage: string;
};

export type DiscoveredLead = {
  id: string;
  businessName: string;
  website: string;
  country: string;
  city: string;
  industry: string;
  businessType: string;
  businessStage: BusinessStage;
  source: string;
  verificationStatus: VerificationStatus;
  contactDataQuality: ContactDataQuality;
  opportunityType: OpportunityType[];
  bestOutreachChannel: BestOutreachChannel;
  dataConfidenceScore: number;
  fieldConfidence: FieldConfidence;
  address: string;
  category: string;
  rating: number | null;
  googleMapsUrl: string;
  sourceUrl?: string;
  launchSignal?: string;
  signalType?: string;
  opportunityScore: number;
  priority: Priority;
  missingOpportunities: string[];
  bestRayqServiceToPitch: string;
  suggestedOutreachAngle: string;
  contactEmail: string;
  phone: string;
  websiteQualityScore: number;
  croOpportunityScore: number;
  paidAdsOpportunityScore: number;
  contentOpportunityScore: number;
  trackingOpportunityScore: number;
  overallRayqFitScore: number;
  tags: string[];
  diagnosis: OpportunityDiagnosis;
};

export type SavedSearch = {
  id: string;
  name: string;
  country: string;
  city: string;
  industry: string;
  businessType: string;
  minimumOpportunityScore: number;
  serviceToPitch: string;
  lastRunDate: string;
  leadsFound: number;
  leadsSaved: number;
};
