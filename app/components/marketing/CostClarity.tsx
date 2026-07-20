import { ArrowRight, Building2, CircleDollarSign, Layers3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/marketing/Reveal";
import { cn } from "@/lib/cn";

const costLayers = [
  {
    icon: CircleDollarSign,
    title: "Honoraires ORÉE",
    status: "Devis avant engagement",
    description: "Le prix du service dépend du périmètre réellement retenu. Il doit être validé avec ses inclusions et exclusions avant toute commande.",
  },
  {
    icon: Building2,
    title: "Frais légaux",
    status: "Facturés selon la formalité",
    description: "Annonce légale, immatriculation et autres frais applicables sont distingués des honoraires de la plateforme.",
  },
  {
    icon: Layers3,
    title: "Services tiers",
    status: "Optionnels et identifiés",
    description: "Domiciliation, compte, dépôt de capital ou autre prestation ne doivent apparaître que s'ils sont utiles et expressément choisis.",
  },
];

export function CostClarity({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("rounded-[24px] border border-[var(--line)] bg-white/70 p-5 shadow-[0_18px_55px_rgba(11,18,32,.055)] sm:p-7", !compact && "sm:rounded-[30px] lg:p-9")}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge>Comprendre le coût</Badge>
          <h2 className={cn("mt-5 max-w-3xl text-balance font-semibold leading-[1.02] tracking-[-.045em]", compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-5xl")}>Trois lignes séparées, aucune promesse de prix inventée.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">Les montants définitifs exigent la validation des tarifs, de la TVA et du périmètre commercial par ORÉE.</p>
        </div>
        <Link to="/tarifs" className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[color:var(--blue)]">Voir la méthode tarifaire <ArrowRight className="size-4 transition group-hover:translate-x-1" /></Link>
      </div>
      <div className={cn("mt-7 grid gap-3", compact ? "lg:grid-cols-3" : "sm:mt-9 lg:grid-cols-3")}>
        {costLayers.map((item, index) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.title} delay={index * .05}>
              <article className="h-full rounded-[18px] border border-[var(--line)] bg-[var(--paper)] p-5">
                <div className="flex items-start justify-between gap-3"><span className="grid size-10 place-items-center rounded-[13px] bg-[var(--ink)] text-white"><Icon className="size-4" /></span><span className="rounded-full bg-[var(--mint-soft)] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[.08em]">{item.status}</span></div>
                <h3 className="mt-5 text-lg font-semibold tracking-[-.025em]">{item.title}</h3>
                <p className="mt-2 text-xs leading-6 text-[color:var(--muted)]">{item.description}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
