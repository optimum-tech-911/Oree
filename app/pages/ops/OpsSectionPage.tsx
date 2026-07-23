import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Check, FileCheck2, FolderKanban, Mail, Phone, Search, ShieldCheck, UsersRound } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { operationsRepository, type OpsAppointment, type OpsLead, type OpsProject, type OpsRequirement, type OpsTeamMember } from "@/services/supabase/operations";
import { usePageMeta } from "@/hooks/usePageMeta";

const configs = {
  leads: { title: "Demandes", description: "Qualifier, scorer et affecter les demandes entrantes.", icon: UsersRound },
  projets: { title: "Projets", description: "Piloter les dossiers actifs et leurs prochaines étapes.", icon: FolderKanban },
  documents: { title: "Documents", description: "Contrôler les pièces, corrections et validations.", icon: FileCheck2 },
  "rendez-vous": { title: "Rendez-vous", description: "Confirmer les demandes et consigner les résultats.", icon: CalendarDays },
  equipe: { title: "Équipe", description: "Observer les rôles et capacités autorisées.", icon: ShieldCheck },
} as const;

type Section = keyof typeof configs;
type RawRow = OpsLead | OpsProject | OpsRequirement | OpsAppointment | OpsTeamMember;
type ViewRow = { id: string; title: string; meta: string; status: string; raw: RawRow };
type StatusOption = { value: string; label: string; disabled?: boolean };

const leadStatusOptions: StatusOption[] = [
  "new", "contact_attempted", "contacted", "qualified", "appointment_booked", "proposal_sent", "converted", "lost", "invalid",
].map((value) => ({ value, label: value }));
const projectStatusOptions: StatusOption[] = [
  "draft", "orientation", "information_collection", "documents_requested", "documents_review", "awaiting_signature", "formalities_preparation", "submitted", "correction_required", "registered", "cancelled",
].map((value) => ({ value, label: value }));
const documentActionStatuses = new Set(["under_review", "changes_requested", "approved", "rejected"]);
const documentStatusOptions: StatusOption[] = [
  "not_requested", "required", "uploaded", "under_review", "changes_requested", "approved", "signed", "rejected",
].map((value) => ({ value, label: value, disabled: !documentActionStatuses.has(value) }));
const appointmentActionStatuses = new Set(["booked", "confirmed", "completed", "cancelled", "no_show"]);
const appointmentStatusOptions: StatusOption[] = [
  "requested", "booked", "confirmed", "completed", "cancelled", "no_show",
].map((value) => ({ value, label: value, disabled: !appointmentActionStatuses.has(value) }));
const teamStatusOptions: StatusOption[] = ["advisor", "admin"].map((value) => ({ value, label: value }));

function getStatusOptions(section: Section) {
  if (section === "leads") return leadStatusOptions;
  if (section === "projets") return projectStatusOptions;
  if (section === "documents") return documentStatusOptions;
  if (section === "rendez-vous") return appointmentStatusOptions;
  return teamStatusOptions;
}

function LeadContactDetails({ lead }: { lead: OpsLead }) {
  const context = [
    ["Source", lead.source],
    ["Campagne", lead.campaign],
    ["Calendrier", lead.window],
  ].filter(([, value]) => Boolean(value));

  return (
    <div className="mt-5 rounded-[20px] border border-[var(--line)] bg-[var(--paper)] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[color:var(--muted)]">Coordonnées et contexte</p>
      <div className="mt-3 space-y-2">
        {lead.email ? <a href={`mailto:${lead.email}`} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold transition hover:bg-[var(--mint-soft)]"><Mail className="size-4 shrink-0 text-[color:var(--blue)]" /><span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-[.11em] text-[color:var(--muted)]">E-mail</span><span className="block break-all">{lead.email}</span></span></a> : null}
        {lead.phone ? <a href={`tel:${lead.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold transition hover:bg-[var(--mint-soft)]"><Phone className="size-4 shrink-0 text-[color:var(--blue)]" /><span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-[.11em] text-[color:var(--muted)]">Téléphone</span><span className="block break-all">{lead.phone}</span></span></a> : null}
      </div>
      {context.length ? <dl className="mt-4 grid gap-2 border-t border-[var(--line)] pt-3 text-xs">{context.map(([label, value]) => <div key={label} className="flex items-start justify-between gap-4"><dt className="font-semibold text-[color:var(--muted)]">{label}</dt><dd className="text-right font-medium">{value}</dd></div>)}</dl> : null}
    </div>
  );
}

export default function OpsSectionPage({ section }: { section: Section }) {
  const config = configs[section];
  const Icon = config.icon;
  const client = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["ops", "dashboard"],
    queryFn: operationsRepository.getDashboard,
    refetchInterval: 15_000,
    refetchIntervalInBackground: true,
  });
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [comment, setComment] = useState("");
  const [advisorId, setAdvisorId] = useState("");
  const [active, setActive] = useState(true);
  usePageMeta(config.title, config.description);

  const rows = useMemo<ViewRow[]>(() => {
    if (!data) return [];
    if (section === "leads") return data.leads.map((row) => ({ id: row.id, title: row.name, meta: `${row.source} · ${row.stage} · ${new Date(row.createdAt).toLocaleDateString("fr-FR")}`, status: row.status, raw: row }));
    if (section === "projets") return data.projects.map((row) => ({ id: row.id, title: row.displayName, meta: `${row.legalForm} · ${row.department || "département à préciser"} · ${row.progress}%`, status: row.stage, raw: row }));
    if (section === "documents") return data.requirements.map((row) => ({ id: row.id, title: row.label, meta: `${row.projectName} · ${row.category}`, status: row.status, raw: row }));
    if (section === "rendez-vous") return data.appointments.map((row) => ({ id: row.id, title: row.projectName, meta: `${new Date(row.startsAt).toLocaleString("fr-FR")} · ${row.type}`, status: row.status, raw: row }));
    return data.team.map((row) => ({ id: row.id, title: row.name, meta: `${row.role} · ${row.availability || "disponibilité non renseignée"}`, status: row.active ? "actif" : "inactif", raw: row }));
  }, [data, section]);
  const filtered = rows.filter((row) => `${row.title} ${row.meta} ${row.status}`.toLocaleLowerCase("fr-FR").includes(query.toLocaleLowerCase("fr-FR")));
  const selected = rows.find((row) => row.id === selectedId) ?? null;

  function open(row: ViewRow) {
    setSelectedId(row.id); setStatus(row.status); setComment(""); setAdvisorId(""); setActive(row.status === "actif");
    if (section === "leads") { const raw = row.raw as OpsLead; setScore(raw.score); setAdvisorId(raw.advisorId ?? ""); }
    if (section === "projets") { const raw = row.raw as OpsProject; setProgress(raw.progress); setAdvisorId(raw.advisorId ?? ""); }
    if (section === "documents") setComment((row.raw as OpsRequirement).comment);
    if (section === "rendez-vous") { const raw = row.raw as OpsAppointment; setComment(raw.notes); setAdvisorId(raw.advisorId ?? ""); }
    if (section === "equipe") { const raw = row.raw as OpsTeamMember; setStatus(raw.role); setActive(raw.active); }
  }

  const mutation = useMutation({
    mutationFn: async () => {
      if (!selected) return;
      if (section === "leads") await operationsRepository.updateLead(selected.id, status, score, advisorId || undefined);
      else if (section === "projets") { await operationsRepository.updateProject(selected.id, status, progress); if (advisorId && advisorId !== (selected.raw as OpsProject).advisorId) await operationsRepository.assignProject(selected.id, advisorId); }
      else if (section === "documents") await operationsRepository.reviewRequirement(selected.id, status, comment);
      else if (section === "rendez-vous") await operationsRepository.manageAppointment(selected.id, status, advisorId || undefined, comment);
      else await operationsRepository.setStaffRole(selected.id, status === "admin" ? "admin" : "advisor", active);
    },
    onSuccess: async () => { await client.invalidateQueries({ queryKey: ["ops", "dashboard"] }); setSelectedId(null); },
  });

  const statusOptions = getStatusOptions(section);
  const statusIsActionable = section === "documents"
    ? documentActionStatuses.has(status)
    : section === "rendez-vous"
      ? appointmentActionStatuses.has(status)
      : true;
  const statusHint = section === "documents" && !statusIsActionable
    ? "Choisissez un statut de contrôle avant d’enregistrer."
    : section === "rendez-vous" && !statusIsActionable
      ? "Choisissez une décision opérationnelle avant d’enregistrer."
      : null;
  const advisorOptions = (data?.team ?? []).filter((member) => member.active || member.id === advisorId);

  return <div className="mx-auto max-w-[1480px] space-y-5">
    <Card className="overflow-hidden"><div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center"><div className="flex items-center gap-4"><span className="grid size-14 shrink-0 place-items-center rounded-[20px] bg-[var(--night)] text-white"><Icon className="size-5" /></span><div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[color:var(--muted)]">Orée Operations · {data?.demo ? "démo" : "Supabase"}</p><h1 className="mt-1 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">{config.title}</h1><p className="mt-1 text-sm text-[color:var(--muted)]">{config.description}</p></div></div><label className="flex h-12 items-center gap-3 rounded-[17px] border border-[var(--line)] bg-white/80 px-4 text-sm text-[color:var(--muted)]"><Search className="size-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher" className="w-full bg-transparent outline-none lg:w-72" /></label></div><div className="h-1 bg-[var(--mint)]" /></Card>
    {error ? <Card className="p-5 text-sm text-[color:var(--blue)]">{error instanceof Error ? error.message : "Chargement impossible"}</Card> : null}
    <div className="grid gap-5 xl:grid-cols-[1fr_390px]">
      <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--paper)] px-5 py-4 text-xs text-[color:var(--muted)]"><span>{isLoading ? "Chargement…" : `${filtered.length} élément(s)`}</span><span>Les mutations sensibles sont auditées</span></div><div className="divide-y divide-[var(--line)]">{filtered.map((row, index) => <button key={row.id} type="button" onClick={() => open(row)} className={`flex w-full items-center gap-4 p-5 text-left transition hover:bg-[var(--mint-soft)]/35 ${selectedId === row.id ? "bg-[var(--mint-soft)]/55" : ""}`}><span className="grid size-11 shrink-0 place-items-center rounded-[15px] bg-[var(--night)] text-xs font-bold text-white">{String(index + 1).padStart(2, "0")}</span><div className="min-w-0 flex-1"><p className="truncate font-semibold">{row.title}</p><p className="mt-1 truncate text-xs text-[color:var(--muted)]">{row.meta}</p></div><span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">{row.status}</span></button>)}{!isLoading && filtered.length === 0 ? <p className="p-12 text-center text-sm text-[color:var(--muted)]">Aucun élément accessible.</p> : null}</div></Card>
      <Card className="h-fit p-5 sm:p-6">{selected ? <><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[color:var(--muted)]">Action contrôlée</p><h2 className="mt-2 text-2xl font-semibold">{selected.title}</h2><p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{selected.meta}</p>{section === "leads" ? <LeadContactDetails lead={selected.raw as OpsLead} /> : null}<div className="mt-6 space-y-4"><label className="block text-sm font-semibold">Statut ou rôle<select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 font-normal">{statusOptions.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}</select></label>{statusHint ? <p className="rounded-2xl bg-[var(--paper)] p-3 text-xs leading-5 text-[color:var(--muted)]">{statusHint}</p> : null}{section === "leads" ? <label className="block text-sm font-semibold">Score de qualification<input type="number" min={0} max={100} value={score} onChange={(event) => setScore(Number(event.target.value))} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] px-4 font-normal" /></label> : null}{section === "projets" ? <label className="block text-sm font-semibold">Progression · {progress}%<input type="range" min={0} max={100} value={progress} onChange={(event) => setProgress(Number(event.target.value))} className="mt-3 w-full accent-[var(--blue)]" /></label> : null}{["documents","rendez-vous"].includes(section) ? <label className="block text-sm font-semibold">Commentaire<textarea rows={4} value={comment} onChange={(event) => setComment(event.target.value)} className="mt-2 w-full rounded-2xl border border-[var(--line)] p-4 font-normal" /></label> : null}{["leads","projets","rendez-vous"].includes(section) && data?.team.length ? <label className="block text-sm font-semibold">Affectation<select value={advisorId} onChange={(event) => setAdvisorId(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 font-normal">{!advisorId ? <option value="" disabled>Aucune affectation — choisissez un conseiller</option> : null}{advisorOptions.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.role}{member.active ? "" : " · inactif"}</option>)}</select></label> : null}{section === "equipe" ? <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} className="size-5 accent-[var(--blue)]" />Accès interne actif</label> : null}{mutation.error ? <p className="rounded-2xl bg-[var(--blue)]/8 p-3 text-sm text-[color:var(--blue)]">{mutation.error instanceof Error ? mutation.error.message : "Action impossible"}</p> : null}<Button onClick={() => mutation.mutate()} disabled={mutation.isPending || data?.demo || !statusIsActionable} className="w-full"><Check className="size-4" />{mutation.isPending ? "Enregistrement…" : data?.demo ? "Indisponible en démo" : "Enregistrer et auditer"}</Button></div></> : <div className="py-12 text-center"><span className="mx-auto grid size-12 place-items-center rounded-[18px] bg-[var(--mint-soft)]"><Icon className="size-5" /></span><p className="mt-5 font-semibold">Sélectionnez un élément</p><p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">Son contexte et les seules actions autorisées apparaîtront ici.</p></div>}</Card>
    </div>
  </div>;
}
