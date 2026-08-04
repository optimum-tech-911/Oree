import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  Check,
  Clock3,
  FileCheck2,
  FolderKanban,
  Mail,
  MessageCircle,
  Phone,
  PhoneIncoming,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { buildPhoneHref, buildWhatsAppHref } from "@/config/commercial-offers";
import {
  canTransitionLeadStatus,
  isLeadStatus,
  leadStatusDefinitions,
  leadStatusLabel,
  leadStatuses,
  type LeadStatus,
} from "@/config/lead-statuses";
import { operationsRepository, type OpsAppointment, type OpsLead, type OpsProject, type OpsRequirement, type OpsTeamMember } from "@/services/supabase/operations";
import { usePageMeta } from "@/hooks/usePageMeta";

const configs = {
  leads: { title: "Demandes", description: "Qualifier, relancer et convertir les demandes entrantes.", icon: UsersRound },
  projets: { title: "Projets", description: "Piloter les dossiers actifs et leurs prochaines étapes.", icon: FolderKanban },
  documents: { title: "Documents", description: "Contrôler les pièces, corrections et validations.", icon: FileCheck2 },
  "rendez-vous": { title: "Rendez-vous", description: "Confirmer les demandes et consigner les résultats.", icon: CalendarDays },
  equipe: { title: "Équipe", description: "Observer les rôles et capacités autorisées.", icon: ShieldCheck },
} as const;

type Section = keyof typeof configs;
type RawRow = OpsLead | OpsProject | OpsRequirement | OpsAppointment | OpsTeamMember;
type ViewRow = { id: string; title: string; meta: string; status: string; raw: RawRow };
type StatusOption = { value: string; label: string; disabled?: boolean };

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

function toLocalInput(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleString("fr-FR") : "—";
}

function getStatusOptions(section: Section, currentStatus: string) {
  if (section === "leads") {
    return leadStatuses.map((value) => ({
      value,
      label: leadStatusDefinitions[value].label,
      disabled: isLeadStatus(currentStatus) ? !canTransitionLeadStatus(currentStatus, value) : false,
    }));
  }
  if (section === "projets") return projectStatusOptions;
  if (section === "documents") return documentStatusOptions;
  if (section === "rendez-vous") return appointmentStatusOptions;
  return teamStatusOptions;
}

function LeadContactDetails({ lead }: { lead: OpsLead }) {
  const context = [
    ["Demande de rappel", lead.callbackRequested ? "Oui — à rappeler" : ""],
    ["Forme demandée", lead.legalForm],
    ["Activité", lead.activity],
    ["Message", lead.message],
    ["Calendrier", lead.window],
    ["Canal préféré", lead.preferredContactChannel],
    ["Landing page", lead.landingPage],
    ["Campagne", lead.campaign],
    ["Mot-clé", lead.keyword],
    ["GCLID", lead.gclid],
    ["Source", lead.source],
    ["Referrer", lead.referrer],
    ["Dernier contact", formatDate(lead.lastContactAt)],
    ["Prochaine relance", formatDate(lead.nextFollowUpAt)],
    ["Issue gagnée", formatDate(lead.customerWonAt)],
  ].filter(([, value]) => Boolean(value) && value !== "—");

  return (
    <div className="mt-5 space-y-4">
      {lead.callbackRequested ? <div className="flex items-start gap-3 rounded-[20px] border border-[var(--mint)] bg-[var(--mint-soft)] p-4"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--mint)] text-[color:var(--ink)]"><PhoneIncoming className="size-4" /></span><div><p className="text-sm font-semibold">Demande de rappel</p><p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">Cette personne a explicitement demandé à être rappelée. Son numéro et les actions de contact sont disponibles ci-dessous.</p></div></div> : null}
      <div className="rounded-[20px] border border-[var(--line)] bg-[var(--paper)] p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[color:var(--muted)]">Actions de contact</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
          {lead.phone ? <a href={buildPhoneHref(lead.phone)} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-3 text-xs font-semibold text-white"><Phone className="size-4" />Appeler</a> : null}
          {lead.phone ? <a href={buildWhatsAppHref(lead.phone, "Bonjour, je vous contacte au sujet de votre demande Orée Entreprises.")} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--mint)] px-3 text-xs font-semibold text-[color:var(--ink)]"><MessageCircle className="size-4" />WhatsApp</a> : null}
          {lead.email ? <a href={`mailto:${lead.email}`} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 text-xs font-semibold"><Mail className="size-4" />E-mail</a> : null}
        </div>
        <div className="mt-3 space-y-2">
          {lead.email ? <a href={`mailto:${lead.email}`} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold transition hover:bg-[var(--mint-soft)]"><Mail className="size-4 shrink-0 text-[color:var(--blue)]" /><span className="min-w-0 break-all">{lead.email}</span></a> : null}
          {lead.phone ? <a href={buildPhoneHref(lead.phone)} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold transition hover:bg-[var(--mint-soft)]"><Phone className="size-4 shrink-0 text-[color:var(--blue)]" /><span>{lead.phone}</span></a> : null}
        </div>
      </div>

      <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[color:var(--muted)]">Projet et acquisition</p>
        <dl className="mt-3 grid gap-2 text-xs">{context.map(([label, value]) => <div key={label} className="grid grid-cols-[110px_1fr] items-start gap-3 border-b border-[var(--line)] py-2 last:border-0"><dt className="font-semibold text-[color:var(--muted)]">{label}</dt><dd className="min-w-0 break-words text-right font-medium">{value}</dd></div>)}</dl>
      </div>

      {lead.qualificationReason || lead.lostReason ? <div className="rounded-[20px] border border-[var(--line)] bg-[var(--paper)] p-4 text-xs leading-6"><p className="font-semibold">Résultat commercial</p>{lead.qualificationReason ? <p className="mt-2"><span className="text-[color:var(--muted)]">Qualification : </span>{lead.qualificationReason}</p> : null}{lead.lostReason ? <p className="mt-2"><span className="text-[color:var(--muted)]">Perte : </span>{lead.lostReason}</p> : null}</div> : null}

      <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[color:var(--muted)]">Notes internes</p>
        <div className="mt-3 space-y-2">{lead.notes.map((note) => <div key={note.id} className="rounded-xl bg-[var(--paper)] p-3 text-xs leading-5"><p>{note.body}</p><p className="mt-1 text-[10px] text-[color:var(--muted)]">{formatDate(note.createdAt)}</p></div>)}{lead.notes.length === 0 ? <p className="text-xs text-[color:var(--muted)]">Aucune note enregistrée.</p> : null}</div>
      </div>
    </div>
  );
}

export default function OpsSectionPage({ section }: { section: Section }) {
  const config = configs[section];
  const Icon = config.icon;
  const client = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [nextFollowUpAt, setNextFollowUpAt] = useState("");
  const [qualificationReason, setQualificationReason] = useState("");
  const [lostReason, setLostReason] = useState("");
  const [advisorId, setAdvisorId] = useState("");
  const [active, setActive] = useState(true);
  usePageMeta(config.title, config.description);

  const rows = useMemo<ViewRow[]>(() => {
    if (!data) return [];
    if (section === "leads") return data.leads.map((row) => ({ id: row.id, title: row.name, meta: `${row.callbackRequested ? "Rappel demandé · " : ""}${row.legalForm} · ${row.campaign || row.source} · ${new Date(row.createdAt).toLocaleDateString("fr-FR")}`, status: row.status, raw: row }));
    if (section === "projets") return data.projects.map((row) => ({ id: row.id, title: row.displayName, meta: `${row.legalForm} · ${row.department || "département à préciser"} · ${row.progress}%`, status: row.stage, raw: row }));
    if (section === "documents") return data.requirements.map((row) => ({ id: row.id, title: row.label, meta: `${row.projectName} · ${row.category}`, status: row.status, raw: row }));
    if (section === "rendez-vous") return data.appointments.map((row) => ({ id: row.id, title: row.projectName, meta: `${new Date(row.startsAt).toLocaleString("fr-FR")} · ${row.type}`, status: row.status, raw: row }));
    return data.team.map((row) => ({ id: row.id, title: row.name, meta: `${row.role} · ${row.availability || "disponibilité non renseignée"}`, status: row.active ? "actif" : "inactif", raw: row }));
  }, [data, section]);
  const filtered = rows.filter((row) => `${row.title} ${row.meta} ${row.status}`.toLocaleLowerCase("fr-FR").includes(query.toLocaleLowerCase("fr-FR")));
  const selected = rows.find((row) => row.id === selectedId) ?? null;

  const open = useCallback((row: ViewRow) => {
    setSelectedId(row.id);
    setStatus(row.status);
    setComment("");
    setAdvisorId("");
    setNextFollowUpAt("");
    setQualificationReason("");
    setLostReason("");
    setActive(row.status === "actif");
    if (section === "leads") {
      const raw = row.raw as OpsLead;
      setScore(raw.score);
      setAdvisorId(raw.advisorId ?? "");
      setNextFollowUpAt(toLocalInput(raw.nextFollowUpAt));
      setQualificationReason(raw.qualificationReason);
      setLostReason(raw.lostReason);
      setSearchParams({ lead: row.id }, { replace: true });
    }
    if (section === "projets") { const raw = row.raw as OpsProject; setProgress(raw.progress); setAdvisorId(raw.advisorId ?? ""); }
    if (section === "documents") setComment((row.raw as OpsRequirement).comment);
    if (section === "rendez-vous") { const raw = row.raw as OpsAppointment; setComment(raw.notes); setAdvisorId(raw.advisorId ?? ""); }
    if (section === "equipe") { const raw = row.raw as OpsTeamMember; setStatus(raw.role); setActive(raw.active); }
  }, [section, setSearchParams]);

  useEffect(() => {
    const requestedLead = section === "leads" ? searchParams.get("lead") : null;
    if (!requestedLead || selectedId || !rows.length) return;
    const requestedRow = rows.find((row) => row.id === requestedLead);
    if (!requestedRow) return;
    const timer = window.setTimeout(() => open(requestedRow), 0);
    return () => window.clearTimeout(timer);
  }, [open, rows, searchParams, section, selectedId]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!selected) return;
      if (section === "leads") {
        await operationsRepository.updateLead(selected.id, {
          status,
          score,
          advisorId: advisorId || undefined,
          note: comment || undefined,
          nextFollowUpAt: nextFollowUpAt ? new Date(nextFollowUpAt).toISOString() : undefined,
          qualificationReason: qualificationReason || undefined,
          lostReason: lostReason || undefined,
        });
      } else if (section === "projets") {
        await operationsRepository.updateProject(selected.id, status, progress);
        if (advisorId && advisorId !== (selected.raw as OpsProject).advisorId) await operationsRepository.assignProject(selected.id, advisorId);
      } else if (section === "documents") await operationsRepository.reviewRequirement(selected.id, status, comment);
      else if (section === "rendez-vous") await operationsRepository.manageAppointment(selected.id, status, advisorId || undefined, comment);
      else await operationsRepository.setStaffRole(selected.id, status === "admin" ? "admin" : "advisor", active);
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ops", "dashboard"] });
      setSelectedId(null);
      if (section === "leads") setSearchParams({}, { replace: true });
    },
  });

  const statusOptions = getStatusOptions(section, selected?.status ?? "");
  const statusIsActionable = section === "documents"
    ? documentActionStatuses.has(status)
    : section === "rendez-vous"
      ? appointmentActionStatuses.has(status)
      : section === "leads"
        ? (status !== "qualified" && status !== "out_of_scope" || qualificationReason.trim().length >= 2)
          && (status !== "lost" || lostReason.trim().length >= 2)
        : true;
  const statusHint = section === "documents" && !statusIsActionable
    ? "Choisissez un statut de contrôle avant d’enregistrer."
    : section === "rendez-vous" && !statusIsActionable
      ? "Choisissez une décision opérationnelle avant d’enregistrer."
      : section === "leads" && !statusIsActionable
        ? "Ajoutez le motif requis pour enregistrer ce résultat."
        : null;
  const advisorOptions = (data?.team ?? []).filter((member) => member.active || member.id === advisorId);

  return <div className="mx-auto max-w-[1480px] space-y-5">
    <Card className="overflow-hidden"><div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center"><div className="flex items-center gap-4"><span className="grid size-14 shrink-0 place-items-center rounded-[20px] bg-[var(--night)] text-white"><Icon className="size-5" /></span><div><p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[color:var(--muted)]">Orée Operations · {data?.demo ? "démo" : "Supabase"}</p><h1 className="mt-1 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">{config.title}</h1><p className="mt-1 text-sm text-[color:var(--muted)]">{config.description}</p></div></div><label className="flex h-12 items-center gap-3 rounded-[17px] border border-[var(--line)] bg-white/80 px-4 text-sm text-[color:var(--muted)]"><Search className="size-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher" className="w-full bg-transparent outline-none lg:w-72" /></label></div><div className="h-1 bg-[var(--mint)]" /></Card>
    {error ? <Card className="p-5 text-sm text-[color:var(--blue)]">{error instanceof Error ? error.message : "Chargement impossible"}</Card> : null}
    <div className="grid gap-5 xl:grid-cols-[1fr_430px]">
      <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--paper)] px-5 py-4 text-xs text-[color:var(--muted)]"><span>{isLoading ? "Chargement…" : `${filtered.length} élément(s)`}</span><span>Les mutations sensibles sont auditées</span></div><div className="divide-y divide-[var(--line)]">{filtered.map((row, index) => { const callbackRequested = section === "leads" && (row.raw as OpsLead).callbackRequested; return <button key={row.id} type="button" onClick={() => open(row)} className={`flex w-full items-center gap-4 p-5 text-left transition hover:bg-[var(--mint-soft)]/35 ${selectedId === row.id ? "bg-[var(--mint-soft)]/55" : ""}`}><span className="grid size-11 shrink-0 place-items-center rounded-[15px] bg-[var(--night)] text-xs font-semibold text-white">{callbackRequested ? <PhoneIncoming className="size-4" /> : String(index + 1).padStart(2, "0")}</span><div className="min-w-0 flex-1"><p className="truncate font-semibold">{row.title}</p><p className="mt-1 truncate text-xs text-[color:var(--muted)]">{row.meta}</p></div><div className="flex shrink-0 flex-col items-end gap-1.5">{callbackRequested ? <span className="rounded-full bg-[var(--mint)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[.08em] text-[color:var(--ink)]">À rappeler</span> : null}<span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">{section === "leads" ? leadStatusLabel(row.status) : row.status}</span></div></button>; })}{!isLoading && filtered.length === 0 ? <p className="p-12 text-center text-sm text-[color:var(--muted)]">Aucun élément accessible.</p> : null}</div></Card>
      <Card className="h-fit p-5 sm:p-6">{selected ? <><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[color:var(--muted)]">Action contrôlée</p><h2 className="mt-2 text-2xl font-semibold">{selected.title}</h2><p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{selected.meta}</p>{section === "leads" ? <LeadContactDetails lead={selected.raw as OpsLead} /> : null}<div className="mt-6 space-y-4">
        {section === "leads" ? <div className="grid grid-cols-2 gap-2">{([
          ["qualified", "Marquer qualifié"],
          ["won", "Marquer gagné"],
          ["lost", "Marquer perdu"],
          ["out_of_scope", "Hors cible"],
        ] as Array<[LeadStatus, string]>).map(([value, label]) => <button key={value} type="button" disabled={isLeadStatus(selected.status) && !canTransitionLeadStatus(selected.status, value)} onClick={() => setStatus(value)} className="min-h-10 rounded-xl border border-[var(--line)] bg-white px-3 text-xs font-semibold transition hover:border-[var(--blue)]/35 disabled:cursor-not-allowed disabled:opacity-35">{label}</button>)}</div> : null}
        <label className="block text-sm font-semibold">Statut ou rôle<select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 font-normal">{statusOptions.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}</select></label>
        {statusHint ? <p className="rounded-2xl bg-[var(--paper)] p-3 text-xs leading-5 text-[color:var(--muted)]">{statusHint}</p> : null}
        {section === "leads" ? <><label className="block text-sm font-semibold">Score de qualification<input type="number" min={0} max={100} value={score} onChange={(event) => setScore(Number(event.target.value))} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] px-4 font-normal" /></label><label className="block text-sm font-semibold">Prochaine relance<span className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-white px-4"><Clock3 className="size-4 text-[color:var(--muted)]" /><input type="datetime-local" value={nextFollowUpAt} onChange={(event) => setNextFollowUpAt(event.target.value)} className="h-12 min-w-0 flex-1 bg-transparent font-normal outline-none" /></span></label><label className="block text-sm font-semibold">Motif de qualification ou hors cible<textarea rows={3} value={qualificationReason} onChange={(event) => setQualificationReason(event.target.value)} className="mt-2 w-full rounded-2xl border border-[var(--line)] p-4 font-normal" /></label>{status === "lost" ? <label className="block text-sm font-semibold">Motif de perte<textarea rows={3} value={lostReason} onChange={(event) => setLostReason(event.target.value)} className="mt-2 w-full rounded-2xl border border-[var(--line)] p-4 font-normal" /></label> : null}<label className="block text-sm font-semibold">Ajouter une note interne<textarea rows={3} value={comment} onChange={(event) => setComment(event.target.value)} className="mt-2 w-full rounded-2xl border border-[var(--line)] p-4 font-normal" /></label></> : null}
        {section === "projets" ? <label className="block text-sm font-semibold">Progression · {progress}%<input type="range" min={0} max={100} value={progress} onChange={(event) => setProgress(Number(event.target.value))} className="mt-3 w-full accent-[var(--blue)]" /></label> : null}
        {["documents","rendez-vous"].includes(section) ? <label className="block text-sm font-semibold">Commentaire<textarea rows={4} value={comment} onChange={(event) => setComment(event.target.value)} className="mt-2 w-full rounded-2xl border border-[var(--line)] p-4 font-normal" /></label> : null}
        {["leads","projets","rendez-vous"].includes(section) && data?.team.length ? <label className="block text-sm font-semibold">Affectation<select value={advisorId} onChange={(event) => setAdvisorId(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 font-normal">{!advisorId ? <option value="" disabled>Aucune affectation — choisissez un conseiller</option> : null}{advisorOptions.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.role}{member.active ? "" : " · inactif"}</option>)}</select></label> : null}
        {section === "equipe" ? <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} className="size-5 accent-[var(--blue)]" />Accès interne actif</label> : null}
        {mutation.error ? <p className="rounded-2xl bg-[var(--blue)]/8 p-3 text-sm text-[color:var(--blue)]">{mutation.error instanceof Error ? mutation.error.message : "Action impossible"}</p> : null}
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || data?.demo || !statusIsActionable} className="w-full"><Check className="size-4" />{mutation.isPending ? "Enregistrement…" : data?.demo ? "Indisponible en démo" : "Enregistrer et auditer"}</Button>
      </div></> : <div className="py-12 text-center"><span className="mx-auto grid size-12 place-items-center rounded-[18px] bg-[var(--mint-soft)]"><Icon className="size-5" /></span><p className="mt-5 font-semibold">Sélectionnez un élément</p><p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">Son contexte et les seules actions autorisées apparaîtront ici.</p></div>}</Card>
    </div>
  </div>;
}
