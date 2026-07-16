import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileCheck2,
  FileText,
  MessageSquareText,
  Radar,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Card } from "@/components/ui/Card";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { projectRepository } from "@/services/supabase/repositories";
import { mockDocuments, mockTimeline } from "@/data/mock";
import { usePageMeta } from "@/hooks/usePageMeta";

const commandSteps = [
  { label: "Projet", state: "done" },
  { label: "Orientation", state: "done" },
  { label: "Informations", state: "done" },
  { label: "Documents", state: "current" },
  { label: "Formalités", state: "next" },
  { label: "Immatriculation", state: "next" },
] as const;

const metrics = [
  { label: "Éléments validés", value: "7/9", detail: "2 restent à traiter", icon: FileCheck2 },
  { label: "Délai estimé", value: "12 j", detail: "selon pièces reçues", icon: Clock3 },
  { label: "Dernier échange", value: "09:42", detail: "message de l'équipe", icon: MessageSquareText },
] as const;

export default function DashboardPage() {
  usePageMeta("Vue d'ensemble du projet", "Suivez la progression, les documents et les prochaines actions de votre projet.");
  const reduce = useReducedMotion();
  const { data: project } = useQuery({ queryKey: ["project", "current"], queryFn: projectRepository.getCurrent });
  const current = project;

  return (
    <div className="mx-auto max-w-[1540px] space-y-5">
      <section className="hero-grid surface-noise relative overflow-hidden rounded-[36px] bg-[var(--ink)] p-5 text-white shadow-[0_38px_110px_rgba(11,18,32,.2)] sm:p-8 lg:p-10 xl:p-12">
        <div className="absolute -bottom-40 left-[42%] size-96 rounded-full bg-[var(--mint)]/9 blur-[88px]" />
        <div className="relative grid gap-9 xl:grid-cols-[1fr_420px] xl:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.055] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.14em] text-white/72">
                <span className="relative size-2 rounded-full bg-[var(--mint)]"><span className="absolute inset-0 animate-ping rounded-full bg-[var(--mint)] opacity-45" /></span>
                Centre de pilotage
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[.12em] text-white/72">Mise à jour il y a 4 min</span>
            </div>
            <h2 className="mt-6 max-w-5xl text-balance text-[clamp(2.5rem,5vw,5.8rem)] font-extrabold leading-[.91] tracking-[-.075em]">
              Une correction documentaire <span className="font-editorial italic text-[color:var(--mint)]">conditionne la prochaine étape.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
              {current?.displayName ?? "Studio Horizon"} est en cours de vérification documentaire. Transmettez un justificatif de siège récent afin de poursuivre le contrôle du dossier.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/app/documents" variant="accent" size="lg" arrow><UploadCloud className="size-4" />Remplacer le justificatif</ButtonLink>
              <Button type="button" variant="dark" size="lg" onClick={() => window.dispatchEvent(new CustomEvent("oree:assistant-open"))}><Bot className="size-4" />Demander au Guide</Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[.055] p-5 backdrop-blur-xl sm:p-6">
            <div className="absolute -right-16 -top-20 size-52 rounded-full bg-[var(--blue)]/28 blur-3xl" />
            <div className="relative flex items-start justify-between gap-5">
              <div><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-white/72">Progression globale</p><p className="mt-3 text-2xl font-extrabold tracking-[-.045em]">Dossier en cours de vérification</p></div>
              <ProgressRing value={current?.progress ?? 64} size={112} />
            </div>
            <div className="relative mt-6 grid grid-cols-6 gap-1.5">
              {commandSteps.map((step, index) => (
                <div key={step.label} className="min-w-0">
                  <div className="relative h-1.5 overflow-hidden rounded-full bg-white/7">
                    {step.state !== "next" ? <motion.div initial={reduce ? false : { width: 0 }} animate={{ width: "100%" }} transition={{ delay: index * .08, duration: .7 }} className={step.state === "done" ? "h-full rounded-full bg-[var(--mint)]" : "kinetic-line h-full rounded-full bg-[var(--blue)]"} /> : null}
                  </div>
                  <p className={`mt-2 truncate text-[8px] font-bold uppercase tracking-[.06em] ${step.state === "next" ? "text-white/72" : "text-white/72"}`}>{step.label}</p>
                </div>
              ))}
            </div>
            <div className="relative mt-5 flex items-center gap-3 rounded-[18px] border border-white/8 bg-[var(--ink)]/48 p-3.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-[13px] bg-[var(--mint)] text-[color:var(--ink)]"><Radar className="size-4" /></span>
              <div className="min-w-0"><p className="text-xs font-extrabold">Étape active · Documents</p><p className="mt-1 truncate text-[10px] text-white/72">1 correction requise avant contrôle final</p></div>
              <ChevronRight className="ml-auto size-4 text-white/72" />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div key={metric.label} initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .08 }}>
              <Card className="group flex h-full items-center gap-4 p-4 transition hover:-translate-y-1 hover:border-[var(--blue)]/22 sm:p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-[16px] bg-[var(--paper)] transition group-hover:bg-[var(--mint-soft)]"><Icon className="size-4.5" /></span>
                <div className="min-w-0"><p className="text-[9px] font-extrabold uppercase tracking-[.12em] text-[color:var(--muted)]">{metric.label}</p><div className="mt-1 flex items-baseline gap-2"><p className="text-xl font-extrabold tracking-[-.04em]">{metric.value}</p><p className="truncate text-[10px] text-[color:var(--muted)]">{metric.detail}</p></div></div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.38fr_.62fr]">
        <div className="space-y-5">
          <Card className="route-map relative overflow-hidden p-5 sm:p-7">
            <div className="absolute right-0 top-0 h-full w-1.5 bg-[var(--blue)]" />
            <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.14em] text-[color:var(--blue)]"><CircleAlert className="size-3.5" />Action prioritaire</div>
                <h3 className="mt-3 text-3xl font-extrabold leading-[.98] tracking-[-.06em] sm:text-4xl">Transmettez un justificatif conforme pour poursuivre l'instruction.</h3>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">Le document transmis date de plus de trois mois. La nouvelle version doit afficher le nom du titulaire, l'adresse complète et une date lisible.</p>
                <div className="mt-5 flex flex-wrap gap-3"><ButtonLink to="/app/documents" variant="accent" arrow><UploadCloud className="size-4" />Ajouter une version</ButtonLink><Link to="/app/messages" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-extrabold transition hover:bg-white">Poser une question <ArrowRight className="size-4" /></Link></div>
              </div>
              <div className="hidden min-w-[180px] rounded-[24px] border border-[var(--line)] bg-white/88 p-5 text-center shadow-soft lg:block"><span className="mx-auto grid size-12 place-items-center rounded-[17px] bg-[var(--blue)] text-white"><FileText className="size-5" /></span><p className="mt-4 text-[10px] font-extrabold uppercase tracking-[.12em] text-[color:var(--muted)]">Temps estimé</p><p className="mt-1 text-3xl font-extrabold tracking-[-.05em]">2 min</p><p className="mt-1 text-[10px] text-[color:var(--muted)]">pour déposer le fichier</p></div>
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-[1.08fr_.92fr]">
            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[color:var(--muted)]">Documents</p><h3 className="mt-2 text-2xl font-extrabold tracking-[-.045em]">Derniers éléments</h3></div><ButtonLink to="/app/documents" variant="ghost" size="sm">Tout voir <ChevronRight className="size-4" /></ButtonLink></div>
              <div className="mt-5 divide-y divide-[var(--line)]">{mockDocuments.slice(0, 4).map((document) => <Link key={document.id} to="/app/documents" className="group flex items-center gap-3 py-3.5 first:pt-0 last:pb-0"><span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-[var(--paper)] transition group-hover:bg-[var(--mint-soft)]"><FileText className="size-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold">{document.label}</p><p className="mt-1 text-[10px] text-[color:var(--muted)]">{document.category} · {document.updatedAt ?? "À fournir"}</p></div><StatusBadge status={document.status} /></Link>)}</div>
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[color:var(--muted)]">Progression</p><h3 className="mt-2 text-2xl font-extrabold tracking-[-.045em]">Votre parcours</h3></div><span className="rounded-full bg-[var(--mint-soft)] px-3 py-1.5 text-[10px] font-extrabold text-[color:var(--ink)]">2 étapes validées</span></div>
              <div className="relative mt-6 space-y-5 before:absolute before:bottom-4 before:left-[13px] before:top-4 before:w-px before:bg-[var(--line)]">{mockTimeline.slice(0, 4).map((event, index) => <div key={event.id} className="relative flex gap-4"><span className={`relative z-10 mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-[9px] font-extrabold ${event.state === "done" ? "bg-[var(--mint)] text-[color:var(--ink)]" : event.state === "current" ? "bg-[var(--blue)] text-white shadow-[0_0_0_5px_rgba(36,87,255,.1)]" : "border border-[var(--line)] bg-white text-[color:var(--muted)]"}`}>{event.state === "done" ? <Check className="size-3" /> : index + 1}</span><div><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-extrabold">{event.title}</p><span className="text-[9px] font-bold uppercase tracking-[.08em] text-[color:var(--muted)]">{event.date}</span></div><p className="mt-1 text-[11px] leading-5 text-[color:var(--muted)]">{event.description}</p></div></div>)}</div>
              <ButtonLink to="/app/suivi" variant="secondary" size="sm" className="mt-6 w-full" arrow>Voir toute la chronologie</ButtonLink>
            </Card>
          </div>
        </div>

        <div className="space-y-5">
          <Card className="overflow-hidden p-0">
            <div className="relative overflow-hidden bg-[var(--ink)] p-5 text-white"><div className="absolute -right-12 -top-16 size-40 rounded-full bg-[var(--blue)]/30 blur-3xl" /><div className="relative flex items-center justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-white/72">Suivi du projet</p><p className="mt-2 text-xl font-extrabold">Équipe Orée</p><p className="mt-1 text-[11px] text-white/72">Accompagnement et contrôle du dossier</p></div><span className="grid size-14 place-items-center rounded-full bg-[var(--mint)] text-sm font-extrabold text-[color:var(--ink)]">OR</span></div><div className="relative mt-5 flex items-center gap-2 text-[10px] font-bold text-white/72"><span className="size-2 rounded-full bg-[var(--mint)]" />Une conversation est associée à ce projet</div></div>
            <div className="p-5"><p className="text-sm leading-7 text-[color:var(--muted)]">Consultez les demandes de correction et posez vos questions dans la conversation liée au dossier.</p><ButtonLink to="/app/messages" variant="secondary" className="mt-5 w-full" arrow><MessageSquareText className="size-4" />Ouvrir la conversation</ButtonLink></div>
          </Card>

          <Card className="p-5"><div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-[16px] bg-[var(--mint-soft)]"><CalendarDays className="size-4.5" /></span><span className="rounded-full bg-[var(--mint-soft)] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[.08em] text-[color:var(--ink)]">Confirmé</span></div><p className="mt-5 text-[10px] font-extrabold uppercase tracking-[.14em] text-[color:var(--muted)]">Prochain rendez-vous</p><h3 className="mt-2 text-2xl font-extrabold tracking-[-.045em]">Jeudi 16 juillet</h3><div className="mt-3 flex items-center gap-2 text-sm font-bold text-[color:var(--muted)]"><Clock3 className="size-4" />16:30 · 30 minutes</div><ButtonLink to="/app/rendez-vous" variant="secondary" className="mt-5 w-full" arrow>Gérer le rendez-vous</ButtonLink></Card>

          <Card className="p-5"><div className="flex items-center justify-between"><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[color:var(--muted)]">Résumé du projet</p><Sparkles className="size-4 text-[color:var(--blue)]" /></div><div className="mt-4 grid grid-cols-2 gap-2">{[["Structure", current?.legalForm ?? "SASU"], ["Département", current?.department ?? "34"], ["Activité", "Conseil"], ["Échéance", "30 sept."]].map(([label, value]) => <div key={label} className="rounded-[16px] bg-[var(--paper)] p-3"><p className="text-[9px] font-bold uppercase tracking-[.08em] text-[color:var(--muted)]">{label}</p><p className="mt-1.5 text-xs font-extrabold">{value}</p></div>)}</div><ButtonLink to="/app/projet" variant="ghost" className="mt-4 w-full" arrow>Voir les informations</ButtonLink></Card>
        </div>
      </div>
    </div>
  );
}
