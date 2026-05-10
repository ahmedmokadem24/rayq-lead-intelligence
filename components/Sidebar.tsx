"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bookmark,
  CalendarDays,
  FileDown,
  LayoutDashboard,
  Mail,
  Plus,
  Search,
  Settings,
  Sparkles,
  Telescope,
  Table2
} from "lucide-react";
import { cn } from "@/lib/utils";

  const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/automated-discovery", label: "Automated Discovery", icon: Search },
  { href: "/discovery", label: "Lead Discovery", icon: Telescope },
  { href: "/opportunity-feed", label: "Opportunity Feed", icon: BarChart3 },
  { href: "/saved-searches", label: "Saved Searches", icon: Bookmark },
  { href: "/leads", label: "All Leads", icon: Table2 },
  { href: "/add-lead", label: "Add Lead", icon: Plus },
  { href: "/analyzer", label: "Analyzer", icon: Search },
  { href: "/outreach", label: "Outreach", icon: Mail },
  { href: "/calendar", label: "Follow-ups", icon: CalendarDays },
  { href: "/import", label: "Import CSV", icon: FileDown },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-white/10 bg-ink/92 px-4 py-4 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-[260px] lg:shrink-0 lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
      <div className="mb-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#f0d18a] to-gold text-ink shadow-[0_16px_34px_rgba(216,184,111,0.2)]">
          <Sparkles size={20} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-champagne">RAYQ</p>
          <h1 className="text-base font-black tracking-tight text-pearl">Lead Intelligence</h1>
        </div>
      </div>
      <nav className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-muted transition hover:bg-white/[0.065] hover:text-pearl",
                active && "bg-gradient-to-r from-champagne to-gold text-ink shadow-[0_14px_30px_rgba(216,184,111,0.18)] hover:text-ink"
              )}
            >
              <Icon size={18} className={cn("shrink-0", active ? "text-ink" : "text-champagne/75 group-hover:text-champagne")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm leading-6 text-muted">
        <div className="mb-2 flex items-center gap-2 font-bold text-pearl">
          <BarChart3 size={16} />
          Compliance mode
        </div>
        Uses manual imports, public info, and approved APIs only. Outreach drafts stay review-first.
      </div>
    </aside>
  );
}
