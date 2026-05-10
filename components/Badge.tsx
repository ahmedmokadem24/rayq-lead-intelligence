import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  Low: "border-white/10 bg-white/[0.06] text-linen",
  Medium: "border-moss/25 bg-moss/15 text-[#dce8d0]",
  High: "border-champagne/30 bg-champagne/15 text-[#f7dfaa]",
  "Very High": "border-clay/35 bg-clay/20 text-[#ffd9c7]",
  New: "border-white/10 bg-white/[0.06] text-linen",
  Researched: "border-moss/25 bg-moss/15 text-[#dce8d0]",
  Contacted: "border-champagne/30 bg-champagne/15 text-[#f7dfaa]",
  "Follow-up 1 Sent": "border-champagne/30 bg-champagne/15 text-[#f7dfaa]",
  "Follow-up 2 Sent": "border-champagne/30 bg-champagne/15 text-[#f7dfaa]",
  "Call Booked": "border-sky-400/25 bg-sky-400/15 text-sky-100",
  "Proposal Sent": "border-violet-300/25 bg-violet-400/15 text-violet-100",
  Won: "border-emerald-400/25 bg-emerald-500/15 text-emerald-100",
  Lost: "border-red-400/25 bg-red-500/15 text-red-100",
  "Not Relevant": "border-white/10 bg-white/[0.04] text-muted",
  Growing: "border-moss/25 bg-moss/15 text-[#dce8d0]",
  "Mid-sized": "border-champagne/30 bg-champagne/15 text-[#f7dfaa]",
  "Weak CTA": "border-clay/25 bg-clay/15 text-[#ffd9c7]",
  "Weak landing page": "border-clay/25 bg-clay/15 text-[#ffd9c7]",
  "No WhatsApp button": "border-champagne/30 bg-champagne/15 text-[#f7dfaa]",
  "Weak product descriptions": "border-white/10 bg-white/[0.06] text-linen",
  "Weak SEO": "border-white/10 bg-white/[0.06] text-linen",
  "Poor mobile experience": "border-clay/25 bg-clay/15 text-[#ffd9c7]",
  "No clear funnel": "border-clay/25 bg-clay/15 text-[#ffd9c7]",
  "Weak social proof": "border-white/10 bg-white/[0.06] text-linen",
  "No email capture": "border-champagne/30 bg-champagne/15 text-[#f7dfaa]",
  "No retargeting setup": "border-clay/25 bg-clay/15 text-[#ffd9c7]",
  "Tracking unclear": "border-violet-300/25 bg-violet-400/15 text-violet-100",
  "Do Not Contact": "border-red-400/25 bg-red-500/15 text-red-100",
  "Needs Manual Review": "border-champagne/30 bg-champagne/15 text-[#f7dfaa]",
  Verified: "border-emerald-400/25 bg-emerald-500/15 text-emerald-100",
  "Partially verified": "border-champagne/30 bg-champagne/15 text-[#f7dfaa]",
  "Needs review": "border-champagne/30 bg-champagne/15 text-[#f7dfaa]",
  "Demo data": "border-red-400/25 bg-red-500/15 text-red-100",
  Strong: "border-emerald-400/25 bg-emerald-500/15 text-emerald-100",
  Weak: "border-clay/25 bg-clay/15 text-[#ffd9c7]",
  Missing: "border-red-400/25 bg-red-500/15 text-red-100",
  Email: "border-white/10 bg-white/[0.06] text-linen",
  WhatsApp: "border-emerald-400/25 bg-emerald-500/15 text-emerald-100",
  LinkedIn: "border-sky-400/25 bg-sky-400/15 text-sky-100",
  "Instagram DM": "border-violet-300/25 bg-violet-400/15 text-violet-100",
  Call: "border-champagne/30 bg-champagne/15 text-[#f7dfaa]"
};

export function Badge({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold", styles[value] || "border-white/10 bg-white/[0.06] text-linen", className)}>
      {value}
    </span>
  );
}
