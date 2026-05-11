import type { Lead } from "@/types/lead";

const AGENCY_URL = "https://rayqmarketingagency.com/";
const AGENCY_NAME = "RAYQ Marketing Agency";
const RAYQ_SERVICES = "Meta, Google, TikTok, and Snapchat ads, website creation, CRO, AI-generated creatives, social media management, and email/WhatsApp marketing";

function isFashion(lead: Partial<Lead>) {
  return /fashion|apparel|clothing|boutique|retail|jewelry|luxury/i.test(lead.industry || "");
}
function isBeauty(lead: Partial<Lead>) {
  return /beauty|clinic|salon|spa|skincare|cosmetic|aesthetic/i.test(lead.industry || "");
}
function isFood(lead: Partial<Lead>) {
  return /restaurant|cafe|food|coffee|hospitality|dining/i.test(lead.industry || "");
}
function isRealEstate(lead: Partial<Lead>) {
  return /real estate|property|developer/i.test(lead.industry || "");
}

function experienceLine(lead: Partial<Lead>): string {
  if (isFashion(lead)) {
    return `We've worked with brands like Centrepoint, Babyshop, Max Fashion, Splash, and other leading fashion and retail names across the GCC and Europe. I can see exactly the type of growth opportunities ${lead.businessName || "your brand"} has right now.`;
  }
  if (isBeauty(lead)) {
    return `We've helped beauty clinics and wellness brands in the GCC scale their client base through targeted digital campaigns and high-converting landing pages.`;
  }
  if (isFood(lead)) {
    return `We've worked with F&B brands and restaurants across the GCC on performance campaigns that drive real walk-ins, delivery orders, and brand visibility.`;
  }
  if (isRealEstate(lead)) {
    return `We've worked with property brands and developers like Emaar on full-funnel digital campaigns across Meta, Google, and TikTok.`;
  }
  return `We've worked with brands across the GCC and Europe on ${RAYQ_SERVICES}.`;
}

function gap(lead: Partial<Lead>): string {
  return lead.personalizedOutreachAngle || lead.whatTheyAreMissing || "paid media strategy, website conversion, and tracking";
}
function name(lead: Partial<Lead>): string {
  return lead.contactPersonName || "there";
}
function biz(lead: Partial<Lead>): string {
  return lead.businessName || "your business";
}

export function generateOutreach(lead: Partial<Lead>) {
  const business = biz(lead);
  const opportunity = gap(lead);
  const experience = experienceLine(lead);

  const instagramDm =
    `Hi ${name(lead)}, I came across ${business} and noticed some opportunities around ${opportunity}.\n\n` +
    `I run ${AGENCY_NAME} and we help brands grow through ${RAYQ_SERVICES}.\n\n` +
    `${experience}\n\n` +
    `Would you be open to a free 20-minute audit? No commitment — just real, actionable ideas.\n\n` +
    `${AGENCY_URL}`;

  const whatsApp =
    `Hi ${name(lead)}, I came across ${business} and spotted a few growth opportunities around ${opportunity}.\n\n` +
    `I'm from ${AGENCY_NAME}. ${experience}\n\n` +
    `Would you be open to a quick free audit call this week?\n` +
    `${AGENCY_URL}`;

  const professionalEmail =
    `Subject: Growth ideas for ${business} — Free 20-minute audit\n\n` +
    `Hi ${name(lead)},\n\n` +
    `I came across ${business} and noticed a few real opportunities around ${opportunity}.\n\n` +
    `${experience}\n\n` +
    `At ${AGENCY_NAME}, we specialize in ${RAYQ_SERVICES}.\n\n` +
    `I'd love to offer you a free 20-minute audit — no strings attached — where I walk you through exactly what I would improve first and what the estimated impact would be.\n\n` +
    `Would you be open to a quick call this week?\n\n` +
    `Best regards,\n` +
    `RAYQ Marketing Agency\n` +
    `${AGENCY_URL}`;

  const linkedInConnection =
    `Hi ${name(lead)}, I came across ${business} and noticed some interesting growth opportunities around ${opportunity}.\n\n` +
    `I run ${AGENCY_NAME} — we specialize in paid media, CRO, and full-funnel growth for brands across the GCC. ${experience}\n\n` +
    `Would love to connect.`;

  const followUp1 =
    `Hi ${name(lead)}, following up on my previous message about ${business}.\n\n` +
    `I had a few specific ideas around ${opportunity} that I think could make a real difference. ` +
    `I can walk you through them in a free 20-minute call — happy to share screen and show examples from similar brands.\n\n` +
    `${AGENCY_URL}`;

  const followUp2 =
    `Hi ${name(lead)}, closing the loop here on ${business}.\n\n` +
    `If improving ${opportunity} is on your radar this quarter, I can show you the highest-impact fixes in a quick free audit. Let me know if the timing ever works.\n\n` +
    `${AGENCY_URL}`;

  const auditInvitation =
    `Book a free 20-minute RAYQ audit: we'll review ${business}'s ads performance, website conversion, creative quality, tracking setup, and the fastest growth opportunities available right now.\n\n` +
    `${AGENCY_URL}`;

  return { instagramDm, whatsApp, professionalEmail, linkedInConnection, followUp1, followUp2, auditInvitation };
}
