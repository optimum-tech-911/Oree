import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Check, FileCheck2, FolderKanban, Search, ShieldCheck, UsersRound } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { mockLeads } from "@/data/mock";
import { usePageMeta } from "@/hooks/usePageMeta";

const configs = {
  leads: { title: "Demandes", description: "Qualifier, affecter et suivre les demandes entrantes.", icon: UsersRound },
  projets: { title: "Projets", description: "Piloter les dossiers actifs et leurs prochaines actions.", icon: FolderKanban },
  documents: { title: "Documents", description: "Contrôler les pièces en attente, les corrections et les validations.", icon: FileCheck2 },
  "rendez-vous": { title: "Rendez-vous", description: "Organiser les disponibilités et consigner les résultats des échanges.", icon: CalendarDays },
  equipe: { title: "Équipe", description: "Suivre les affectations et les capacités de traitement.", icon: ShieldCheck },
};

const teamRows = [
  { id: "E-01", title: "Compte conseiller 01", meta: "4 projets affectés · capacité disponible", status: "Disponible", detail: "Accès conseiller actif. Les permissions sont administrées côté serveur." },
  { id: "E-02", title: "Compte conseiller 02", meta: "6 projets affectés · charge normale", status: "En activité", detail: "Accès conseiller actif. Aucun droit administrateur n'est modifiable depuis le profil." },
  { id: "E-03", title: "Compte administrateur", meta: "Supervision et contrôle des accès", status: "Actif", detail: "Compte de supervision présenté uniquement à titre démonstratif." },
];

export default function OpsSectionPage({ section }: { section: keyof typeof configs }) {
  const config = configs[section];
  const Icon = config.icon;
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  usePageMeta(config.title, config.description);

  const rows = useMemo(() => {
    if (section === "equipe") return teamRows;
    return mockLeads.map((lead) => ({
      id: lead.id,
      title: section === "leads" ? lead.name : section === "projets" ? lead.project : section === "documents" ? `${lead.project} — pièce à contrôler` : `${lead.name} — point de cadrage`,
      meta: `${lead.source} · score ${lead.score} · ${lead.age}`,
      status: lead.status,
      detail: section === "leads" ? `Intention déclarée : ${lead.intent}. Vérifier la maturité et le calendrier avant affectation.` : section === "projets" ? `Projet orienté vers ${lead.intent}. La prochaine action doit être confirmée avec le porteur.` : section === "documents" ? "Contrôler la lisibilité, la date, le titulaire et la cohérence avec le projet avant toute validation." : "Préparer l'objectif de l'échange et consigner les décisions dans le dossier après le rendez-vous.",
    }));
  }, [section]);
  const filteredRows = rows.filter((row) => `${row.title} ${row.meta} ${row.status}`.toLocaleLowerCase("fr-FR").includes(query.toLocaleLowerCase("fr-FR")));

  return <div className="mx-auto max-w-[1480px] space-y-5 sm:space-y-6">
    <Card className="overflow-hidden"><div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center"><div className="flex items-center gap-4"><span className="grid size-14 shrink-0 place-items-center rounded-[20px] bg-[var(--night)] text-white"><Icon className="size-5" /></span><div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[color:var(--muted)]">Orée Operations</p><h1 className="mt-1 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">{config.title}</h1><p className="mt-1 text-sm text-[color:var(--muted)]">{config.description}</p></div></div><label className="flex h-12 items-center gap-3 rounded-[17px] border border-[var(--line)] bg-white/80 px-4 text-sm text-[color:var(--muted)] transition focus-within:border-[var(--accent)] focus-within:ring-4 focus-within:ring-[var(--accent)]/8"><Search className="size-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Rechercher dans ${config.title.toLocaleLowerCase("fr-FR")}`} className="w-full bg-transparent outline-none lg:w-64" /></label></div><div className="h-1 bg-[var(--mint)]" /></Card>

    <Card className="overflow-hidden"><div className="flex flex-col gap-2 border-b border-[var(--line)] bg-black/[.018] px-5 py-4 text-[10px] font-bold uppercase tracking-[.12em] text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between"><span>Données de démonstration</span><span className="normal-case tracking-normal text-[color:var(--success)]">{filteredRows.length} élément{filteredRows.length > 1 ? "s" : ""} visible{filteredRows.length > 1 ? "s" : ""}</span></div><div className="divide-y divide-[var(--line)]">{filteredRows.map((row, index) => <div key={`${section}-${row.id}`} className="transition hover:bg-[var(--mint-soft)]/32"><div className="group flex flex-col gap-4 p-5 sm:flex-row sm:items-center"><span className="grid size-12 shrink-0 place-items-center rounded-[17px] bg-[var(--night)] text-xs font-extrabold text-white">{String(index + 1).padStart(2, "0")}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold sm:text-base">{row.title}</p><p className="mt-1 text-xs text-[color:var(--muted)]">{row.meta}</p></div><span className="w-fit rounded-full bg-[var(--accent)]/9 px-3 py-1.5 text-[11px] font-bold text-[color:var(--accent-deep)]">{row.status}</span><button type="button" onClick={() => setOpenId((current) => current === row.id ? null : row.id)} className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--ink)]" aria-expanded={openId === row.id}>Détails <ArrowRight className={`size-4 transition-transform ${openId === row.id ? "rotate-90" : "group-hover:translate-x-1"}`} /></button></div>{openId === row.id ? <div className="border-t border-[var(--line)] bg-white/60 px-5 py-4 text-sm leading-6 text-[color:var(--muted)] sm:pl-[84px]">{row.detail}</div> : null}</div>)}{filteredRows.length === 0 ? <div className="p-10 text-center text-sm text-[color:var(--muted)]">Aucun élément ne correspond à cette recherche.</div> : null}</div><div className="flex items-start gap-3 border-t border-[var(--line)] bg-black/[.015] p-5 text-xs leading-5 text-[color:var(--muted)]"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--mint-soft)] text-[color:var(--success)]"><Check className="size-3.5" /></span>Les actions sensibles, les affectations et les changements de statut devront être exécutés par des fonctions serveur autorisées et consignés dans un journal d'audit.</div></Card>
  </div>;
}
