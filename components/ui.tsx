import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("surface-card", className)}>{children}</div>;
}

export function CardHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <h3 className="section-title">{title}</h3>
        {description ? <p className="mt-1 text-sm leading-6 text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 76
      ? "border-clay/40 bg-clay/22 text-[#ffd9c7]"
      : score >= 56
        ? "border-champagne/35 bg-champagne/16 text-[#f7dfaa]"
        : score >= 31
          ? "border-moss/30 bg-moss/16 text-[#dce8d0]"
          : "border-white/10 bg-white/[0.06] text-linen";

  return <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-black", tone)}>{score}/100</span>;
}
