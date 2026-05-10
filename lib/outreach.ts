import type { Lead } from "@/types/lead";

function angle(lead: Partial<Lead>) {
  return (
    lead.personalizedOutreachAngle ||
    lead.whatTheyAreMissing ||
    "paid media, website conversion, tracking, and content strategy"
  );
}

function name(lead: Partial<Lead>) {
  return lead.contactPersonName || "there";
}

function business(lead: Partial<Lead>) {
  return lead.businessName || "your business";
}

export function generateOutreach(lead: Partial<Lead>) {
  const businessName = business(lead);
  const gap = angle(lead);

  return {
    linkedInConnection: `Hi ${name(lead)}, I came across ${businessName} and noticed a few growth opportunities around ${gap}. I run RAYQ Marketing Agency and would love to connect.`,
    instagramDm: `Hi ${name(lead)}, I found ${businessName} and noticed some quick wins around ${gap}. At RAYQ, we help brands improve ads, websites, creatives, and tracking. Open to a free 20-minute audit?`,
    professionalEmail: `Subject: Quick growth ideas for ${businessName}\n\nHi ${name(lead)},\n\nI came across ${businessName} and noticed a few practical opportunities around ${gap}.\n\nI run RAYQ Marketing Agency. We help brands grow through Meta, Google, TikTok ads, landing pages, CRO, tracking, dashboards, and AI creative production.\n\nWould you be open to a free 20-minute audit where I show you what I would improve first?\n\nBest,\nRAYQ Marketing Agency`,
    whatsApp: `Hi ${name(lead)}, I came across ${businessName} and noticed a few opportunities around ${gap}. I run RAYQ Marketing Agency. Would you be open to a quick free 20-minute audit?`,
    followUp1: `Hi ${name(lead)}, quick follow-up. I had a few specific ideas for ${businessName} around ${gap}. Happy to share them in a short audit call if useful.`,
    followUp2: `Hi ${name(lead)}, closing the loop here. If improving ${gap} is a priority this quarter, I can show you the highest-impact fixes in a free 20-minute audit.`,
    auditInvitation: `Book a free 20-minute RAYQ audit: we will review ${businessName}'s website, ads funnel, creative quality, tracking setup, and the fastest growth opportunities.`
  };
}
