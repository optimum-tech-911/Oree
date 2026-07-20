import { useQuery } from "@tanstack/react-query";
import { Check, CircleAlert, FileCheck2, Landmark, LockKeyhole, PenTool, Send, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AppPageHero } from "@/components/app/AppPageHero";
import { ButtonLink } from "@/components/ui/Button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { portalRepository } from "@/services/supabase/portal";

const steps = [
  { title: "Informations société", description: "Dénomination, activité, calendrier, forme et parties prenantes.", icon: FileCheck2 },
  { title: "Contrôle documentaire", description: "Collecte puis vérification des pièces nécessaires.", icon: ShieldCheck },
  { title: "Projet de statuts", description: "Préparation selon le périmètre réel du prestataire et la structure retenue.", icon: PenTool },
  { title: "Capital & justificatifs", description: "Traitement des éléments relatifs au capital et au siège.", icon: Landmark },
  { title: "Signatures & mandat", description: "Signature des éléments définitifs après validation du dossier.", icon: LockKeyhole },
  { title: "Transmission de la formalité", description: "Transmission uniquement lorsque le dossier est complet et autorisé.", icon: Send },
];
const stageIndex: Record<string, number> = {
  draft: 0, orientation: 0, information_collection: 0, documents_requested: 1, documents_review: 1,
  correction_required: 1, awaiting_signature: 4, formalities_preparation: 4, submitted: 5, registered: 6, cancelled: 0,
};

export default function FormalitiesPage() {
  usePageMeta("Formalités", "Suivez les étapes de préparation, validation, signature et transmission de la formalité.");
  const { data, error } = useQuery({ queryKey: ["portal", "snapshot"], queryFn: portalRepository.getSnapshot });
  const activeIndex = stageIndex[data?.project?.status ?? "draft"] ?? 0;
  const blockingDocuments = (data?.documents ?? []).filter((document) => ["changes_requested", "rejected"].includes(document.status));
  const pendingDocuments = (data?.documents ?? []).filter((document) => !["approved", "signed"].includes(document.status));
  const activeTasks = (data?.tasks ?? []).filter((task) => task.status !== "done");
  const completedSteps = activeIndex >= steps.length ? steps.length : activeIndex;

  return <div className="mx-auto max-w-6xl space-y-5">
    <AppPageHero icon={FileCheck2} eyebrow="Parcours de formalités" title={<>Une progression fondée sur <span className="gradient-text">l’état réel du dossier.</span></>} description="Chaque étape s’ouvre quand les informations, documents et contrôles correspondants sont terminés. L’espace ne simule ni signature ni transmission administrative." stat={{ value: `${completedSteps} / ${steps.length}`, label: activeIndex >= steps.length ? "Parcours terminé" : "Étapes franchies" }} />
    {error ? <Card className="border-[var(--blue)]/20 bg-[var(--blue)]/8 p-5 text-sm">{error instanceof Error ? error.message : "Chargement impossible"}</Card> : null}
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <Card className="p-5 sm:p-7"><div className="space-y-3">{steps.map((step, index) => { const state = activeIndex >= steps.length || index < activeIndex ? "done" : index === activeIndex ? "current" : "locked"; const Icon = step.icon; return <article key={step.title} className={`rounded-[24px] border p-5 ${state === "current" ? "border-[var(--blue)] bg-blue-50/60" : state === "done" ? "border-[var(--mint)] bg-[var(--mint-soft)]/45" : "border-[var(--line)] bg-white opacity-72"}`}><div className="flex items-start gap-4"><span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${state === "current" ? "bg-[var(--blue)] text-white" : state === "done" ? "bg-[var(--mint)]" : "bg-[var(--paper)] text-[color:var(--muted)]"}`}>{state === "done" ? <Check className="size-5" /> : state === "locked" ? <LockKeyhole className="size-5" /> : <Icon className="size-5" />}</span><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{step.title}</h3><span className="text-xs font-bold text-[color:var(--muted)]">0{index + 1}</span></div><p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{step.description}</p></div></div></article>; })}</div></Card>
      <div className="space-y-5">
        <Card className={`p-5 ${blockingDocuments.length ? "border-[var(--blue)]/20 bg-[var(--blue)]/8" : "border-[var(--mint)] bg-[var(--mint-soft)]/45"}`}><div className="flex items-center gap-2">{blockingDocuments.length ? <CircleAlert className="size-5" /> : <Check className="size-5" />}<h3 className="font-semibold">{blockingDocuments.length ? "Correction documentaire" : "État documentaire"}</h3></div><p className="mt-3 text-sm leading-6 text-[color:var(--ink)]/70">{blockingDocuments.length ? `${blockingDocuments.length} pièce${blockingDocuments.length > 1 ? "s nécessitent" : " nécessite"} une correction avant de poursuivre.` : pendingDocuments.length ? `${pendingDocuments.length} pièce${pendingDocuments.length > 1 ? "s restent" : " reste"} à déposer ou à faire valider.` : "Toutes les pièces demandées sont validées."}</p><ButtonLink to="/app/documents" className="mt-5 w-full">Ouvrir les documents</ButtonLink></Card>
        <Card className="p-5"><p className="text-xs font-semibold uppercase tracking-[.13em] text-[color:var(--muted)]">Actions en cours</p><div className="mt-4 space-y-3">{activeTasks.length ? activeTasks.slice(0, 5).map((task) => <div key={task.id} className="rounded-2xl bg-[var(--paper)] p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold">{task.title}</p><span className="text-[10px] font-bold uppercase text-[color:var(--muted)]">{task.priority}</span></div>{task.description ? <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">{task.description}</p> : null}</div>) : <p className="text-sm leading-6 text-[color:var(--muted)]">Aucune tâche opérationnelle ouverte pour le moment.</p>}</div></Card>
      </div>
    </div>
  </div>;
}
