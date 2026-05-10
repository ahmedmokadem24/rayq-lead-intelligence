import type { Lead } from "@/types/lead";

export function getMetrics(leads: Lead[]) {
  const total = leads.length;
  const won = leads.filter((lead) => lead.leadStatus === "Won").length;
  const contacted = leads.filter((lead) => ["Contacted", "Follow-up 1 Sent", "Follow-up 2 Sent", "Call Booked", "Proposal Sent", "Won"].includes(lead.leadStatus)).length;
  const today = new Date().toISOString().slice(0, 10);

  return {
    total,
    newLeads: leads.filter((lead) => lead.leadStatus === "New").length,
    contacted,
    callsBooked: leads.filter((lead) => lead.leadStatus === "Call Booked").length,
    proposalsSent: leads.filter((lead) => lead.leadStatus === "Proposal Sent").length,
    won,
    conversionRate: total ? Math.round((won / total) * 100) : 0,
    highPriority: leads.filter((lead) => ["High", "Very High"].includes(lead.priority)).length,
    followUpsDueToday: leads.filter((lead) => lead.nextFollowUpDate && lead.nextFollowUpDate <= today && !["Won", "Lost", "Not Relevant"].includes(lead.leadStatus)).length
  };
}

export function groupBy(leads: Lead[], key: keyof Lead) {
  return leads.reduce<Record<string, number>>((acc, lead) => {
    const value = String(lead[key] || "Unknown");
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}
