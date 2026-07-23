import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Compass, Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { operationsRepository } from "@/services/supabase/operations";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function OpsAnalyticsPage() {
  usePageMeta("Analyse acquisition", "Analysez les sources, campagnes et résultats commerciaux sans données personnelles publicitaires.");
  const { data, error } = useQuery({
    queryKey: ["ops", "dashboard"],
    queryFn: operationsRepository.getDashboard,
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
  });
  const leads = useMemo(() => data?.leads ?? [], [data?.leads]);
  const sources = useMemo(() => Object.entries(leads.reduce<Record<string, number>>((acc, lead) => { const key = lead.source || "Accès direct"; acc[key] = (acc[key] ?? 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]), [leads]);
  const campaigns = useMemo(() => Object.entries(leads.reduce<Record<string, number>>((acc, lead) => { const key = lead.campaign || "Sans campagne"; acc[key] = (acc[key] ?? 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]), [leads]);
  const converted = leads.filter((lead) => lead.status === "converted").length;
  const qualified = leads.filter((lead) => ["qualified","appointment_booked","proposal_sent","converted"].includes(lead.status)).length;
  return <div className="mx-auto max-w-[1400px] space-y-5"><section className="hero-grid surface-noise rounded-[32px] bg-[var(--night)] p-7 text-white sm:p-10"><span className="grid size-13 place-items-center rounded-[18px] bg-[var(--mint)] text-[color:var(--ink)]"><BarChart3 className="size-5" /></span><h1 className="mt-6 text-4xl font-semibold tracking-[-.055em] sm:text-5xl">Acquisition et résultats</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">Cette vue relie l’origine des demandes aux statuts qualifié et converti. Aucun email, téléphone ou contenu de dossier n’est envoyé aux plateformes publicitaires.</p></section>{error ? <Card className="p-5 text-[color:var(--blue)]">{error instanceof Error ? error.message : "Chargement impossible"}</Card> : null}<div className="grid gap-4 sm:grid-cols-3">{[["Demandes", leads.length, Compass],["Qualifiées", qualified, Target],["Converties", converted, BarChart3]].map(([label,value,Icon]) => { const IconComponent = Icon as typeof Compass; return <Card key={String(label)} className="p-6"><span className="grid size-11 place-items-center rounded-[16px] bg-[var(--mint-soft)]"><IconComponent className="size-5" /></span><p className="mt-5 text-4xl font-semibold">{String(value)}</p><p className="mt-2 text-sm font-semibold">{String(label)}</p></Card>; })}</div><div className="grid gap-5 lg:grid-cols-2"><Card className="p-6"><h2 className="text-2xl font-semibold">Sources d’acquisition</h2><div className="mt-6 space-y-4">{sources.map(([label, value]) => <div key={label}><div className="flex justify-between text-sm"><span>{label}</span><strong>{value}</strong></div><div className="mt-2 h-2 rounded-full bg-[var(--ink)]/7"><div className="h-full rounded-full bg-[var(--mint)]" style={{ width: `${leads.length ? Math.max(4, value / leads.length * 100) : 0}%` }} /></div></div>)}{sources.length === 0 ? <p className="text-sm text-[color:var(--muted)]">Aucune attribution disponible.</p> : null}</div></Card><Card className="p-6"><h2 className="text-2xl font-semibold">Campagnes</h2><div className="mt-6 divide-y divide-[var(--line)]">{campaigns.map(([label, value]) => <div key={label} className="flex items-center justify-between py-4 first:pt-0"><span className="text-sm">{label}</span><strong className="rounded-full bg-[var(--paper)] px-3 py-1.5 text-sm">{value}</strong></div>)}{campaigns.length === 0 ? <p className="text-sm text-[color:var(--muted)]">Aucune campagne disponible.</p> : null}</div></Card></div></div>;
}
