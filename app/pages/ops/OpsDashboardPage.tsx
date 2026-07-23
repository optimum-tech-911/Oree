import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, CalendarCheck2, FileWarning, MessageSquareText, Sparkles, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { operationsRepository } from "@/services/supabase/operations";
import { usePageMeta } from "@/hooks/usePageMeta";

const qualifiedStatuses = new Set(["qualified", "appointment_booked", "proposal_sent", "converted"]);

export default function OpsDashboardPage() {
  usePageMeta("Pilotage opérationnel", "Suivez les demandes, dossiers, documents et rendez-vous à partir des données autorisées.");
  const { data, isLoading, error } = useQuery({
    queryKey: ["ops", "dashboard"],
    queryFn: operationsRepository.getDashboard,
    refetchInterval: 15_000,
    refetchIntervalInBackground: true,
  });
  const leads = data?.leads ?? [];
  const [renderedAt] = useState(() => Date.now());
  const since = renderedAt - 7 * 24 * 60 * 60 * 1_000;
  const metrics = [
    { label: "Nouveaux leads · 7 j", value: leads.filter((lead) => Date.parse(lead.createdAt) >= since).length, icon: Sparkles, href: "/ops/leads" },
    { label: "Leads qualifiés", value: leads.filter((lead) => qualifiedStatuses.has(lead.status)).length, icon: UserCheck, href: "/ops/leads" },
    { label: "Documents à traiter", value: (data?.requirements ?? []).filter((item) => ["uploaded", "under_review", "changes_requested"].includes(item.status)).length, icon: FileWarning, href: "/ops/documents" },
    { label: "Rendez-vous à venir", value: (data?.appointments ?? []).filter((item) => Date.parse(item.startsAt) > renderedAt && !["cancelled", "completed", "no_show"].includes(item.status)).length, icon: CalendarCheck2, href: "/ops/rendez-vous" },
  ];
  const funnel = [
    ["Reçus", leads.length],
    ["Contactés", leads.filter((lead) => !["new", "invalid"].includes(lead.status)).length],
    ["Qualifiés", leads.filter((lead) => qualifiedStatuses.has(lead.status)).length],
    ["Convertis", leads.filter((lead) => lead.status === "converted").length],
  ] as const;

  return <div className="mx-auto max-w-[1540px] space-y-5 sm:space-y-6">
    <section className="hero-grid surface-noise relative overflow-hidden rounded-[32px] bg-[var(--night)] p-6 text-white sm:p-8 lg:p-10"><div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.13em] text-white/72"><span className="size-2 rounded-full bg-[var(--mint)]" />{data?.demo ? "Mode démonstration" : "Données Supabase · accès filtré"}</div><h2 className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-[.96] tracking-[-.06em] sm:text-5xl lg:text-6xl">Une vue d’ensemble pour décider <span className="gradient-text">quoi traiter maintenant.</span></h2><p className="mt-5 max-w-2xl text-sm leading-7 text-white/72">Demandes, dossiers, documents et rendez-vous sont regroupés sans exposer de données au-delà du rôle connecté.</p></div><div className="flex flex-wrap gap-2"><ButtonLink to="/ops/messages" variant="dark"><MessageSquareText className="size-4" />Répondre aux clients</ButtonLink><ButtonLink to="/ops/leads" variant="accent">Ouvrir la file <ArrowRight className="size-4" /></ButtonLink></div></div></section>

    {error ? <Card className="border-[var(--blue)]/20 p-5 text-sm text-[color:var(--blue)]">Impossible de charger le pilotage : {error instanceof Error ? error.message : "erreur inconnue"}</Card> : null}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => { const Icon = metric.icon; return <ButtonLink key={metric.label} to={metric.href} variant="ghost" className="h-auto justify-start p-0"><Card className="interactive-card w-full p-5 text-left sm:p-6"><span className="grid size-11 place-items-center rounded-[16px] bg-[var(--night)] text-white"><Icon className="size-4.5" /></span><p className="mt-6 text-4xl font-semibold tracking-[-.055em]">{isLoading ? "—" : metric.value}</p><p className="mt-2 text-sm font-semibold">{metric.label}</p></Card></ButtonLink>; })}</div>

    <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
      <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-[var(--line)] p-5 sm:p-6"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[color:var(--muted)]">File commerciale</p><h3 className="mt-2 text-2xl font-semibold">Demandes récentes</h3></div><ButtonLink to="/ops/leads" variant="ghost" size="sm">Tout voir <ArrowRight className="size-4" /></ButtonLink></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-[var(--paper)] text-[10px] uppercase tracking-[.1em] text-[color:var(--muted)]"><tr><th className="px-5 py-3">Prospect</th><th className="px-5 py-3">Source</th><th className="px-5 py-3">Intention</th><th className="px-5 py-3">Score</th><th className="px-5 py-3">Statut</th></tr></thead><tbody>{leads.slice(0, 8).map((lead) => <tr key={lead.id} className="border-t border-[var(--line)]"><td className="px-5 py-4"><p className="font-semibold">{lead.name}</p><p className="mt-1 text-xs text-[color:var(--muted)]">{new Date(lead.createdAt).toLocaleString("fr-FR")}</p></td><td className="px-5 py-4">{lead.source}</td><td className="px-5 py-4">{lead.stage}</td><td className="px-5 py-4 font-semibold">{lead.score}</td><td className="px-5 py-4"><span className="rounded-full bg-[var(--mint-soft)] px-3 py-1.5 text-xs font-semibold">{lead.status}</span></td></tr>)}{!isLoading && leads.length === 0 ? <tr><td colSpan={5} className="px-5 py-12 text-center text-[color:var(--muted)]">Aucune demande accessible pour ce compte.</td></tr> : null}</tbody></table></div></Card>
      <Card className="p-5 sm:p-6"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[color:var(--muted)]">Entonnoir commercial</p><h3 className="mt-2 text-2xl font-semibold">De la demande au projet</h3><div className="mt-7 space-y-5">{funnel.map(([label, value]) => { const width = leads.length ? Math.max(4, Math.round((value / leads.length) * 100)) : 0; return <div key={label}><div className="flex items-center justify-between text-sm"><span>{label}</span><strong>{value}</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--ink)]/7"><div className="h-full rounded-full bg-[var(--mint)]" style={{ width: `${width}%` }} /></div></div>; })}</div><ButtonLink to="/ops/analytics" variant="secondary" className="mt-7 w-full">Analyser sources et conversions</ButtonLink></Card>
    </div>
  </div>;
}
