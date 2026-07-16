import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function AppPageHero({
  icon: Icon,
  eyebrow,
  title,
  description,
  action,
  stat,
}: {
  icon: ComponentType<LucideProps>;
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
  stat?: { value: string; label: string };
}) {
  return (
    <section className="hero-grid surface-noise relative overflow-hidden rounded-[32px] bg-[var(--night)] p-6 text-white shadow-[0_30px_90px_rgba(11,18,32,.18)] sm:p-8 lg:p-10">
      <div className="glow-mint -right-44 -top-44 opacity-50" />
      <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <Badge className="border-white/12 bg-white/[.06] text-white/68"><Icon className="size-3.5 text-[color:var(--mint)]" />{eyebrow}</Badge>
          <h2 className="mt-5 text-balance text-3xl font-semibold leading-[.97] tracking-[-.058em] sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">{description}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {stat ? <div className="rounded-[18px] border border-white/[.08] bg-white/[.045] px-4 py-3"><p className="text-xl font-semibold tracking-[-.04em]">{stat.value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[.1em] text-white/72">{stat.label}</p></div> : null}
          {action}
        </div>
      </div>
    </section>
  );
}
