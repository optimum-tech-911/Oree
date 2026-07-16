import { Check, CircleAlert, FileCheck2, Landmark, LockKeyhole, PenTool, Send, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AppPageHero } from "@/components/app/AppPageHero";
import { ButtonLink } from "@/components/ui/Button";
import { usePageMeta } from "@/hooks/usePageMeta";

const steps = [
  { title: "Informations société", state: "done", description: "Dénomination, activité, calendrier et capital renseignés.", icon: FileCheck2 },
  { title: "Contrôle documentaire", state: "current", description: "Une correction est demandée sur le justificatif de siège.", icon: ShieldCheck },
  { title: "Projet de statuts", state: "locked", description: "Disponible après validation des informations et des parties prenantes.", icon: PenTool },
  { title: "Capital & justificatifs", state: "locked", description: "Étape à configurer selon le prestataire et la structure retenue.", icon: Landmark },
  { title: "Signatures & mandat", state: "locked", description: "Le mandat sera généré et signé dans le parcours connecté.", icon: LockKeyhole },
  { title: "Transmission de la formalité", state: "locked", description: "Déclenchée uniquement lorsque le dossier est complet et validé.", icon: Send },
];

export default function FormalitiesPage() {
  usePageMeta("Formalités", "Suivez les étapes de préparation, validation, signature et transmission de la formalité.");
  return <div className="mx-auto max-w-6xl space-y-5">
    <AppPageHero icon={FileCheck2} eyebrow="Parcours de formalités" title={<>Une progression conditionnée par <span className="gradient-text">des prérequis explicites.</span></>} description="Chaque étape devient accessible lorsque les informations et les documents nécessaires ont été validés, afin de prévenir toute signature ou transmission sur un dossier incomplet." stat={{ value: "2 / 6", label: "Étape active" }} />
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]"><Card className="p-5 sm:p-7"><div className="space-y-3">{steps.map((step, index) => { const Icon = step.icon; return <article key={step.title} className={`relative rounded-[24px] border p-5 ${step.state === "current" ? "border-[var(--blue)] bg-blue-50/60" : step.state === "done" ? "border-[var(--mint)] bg-[var(--mint-soft)]/45" : "border-[var(--line)] bg-white opacity-72"}`}><div className="flex items-start gap-4"><span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${step.state === "current" ? "bg-[var(--blue)] text-white" : step.state === "done" ? "bg-[var(--mint)]" : "bg-[var(--paper)] text-[color:var(--muted)]"}`}>{step.state === "done" ? <Check className="size-5" /> : step.state === "locked" ? <LockKeyhole className="size-5" /> : <Icon className="size-5" />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{step.title}</h3><span className="text-xs font-bold text-[color:var(--muted)]">0{index + 1}</span></div><p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{step.description}</p>{step.state === "current" ? <ButtonLink to="/app/documents" className="mt-4" size="sm">Résoudre la correction</ButtonLink> : null}</div></div></article>; })}</div></Card><div className="space-y-5"><Card className="border-[var(--blue)]/20 bg-[var(--blue)]/8 p-5"><div className="flex items-center gap-2 text-[color:var(--ink)]"><CircleAlert className="size-5" /><h3 className="font-semibold">Blocage actuel</h3></div><p className="mt-3 text-sm leading-6 text-[color:var(--ink)]/70">Le justificatif de siège doit être remplacé. Les étapes suivantes restent verrouillées pour éviter un dossier incohérent.</p><ButtonLink to="/app/documents" className="mt-5 w-full">Voir le document</ButtonLink></Card><Card className="p-5"><p className="text-xs font-semibold uppercase tracking-[.13em] text-[color:var(--muted)]">Responsabilités</p><div className="mt-4 space-y-4">{[["Vous", "Fournir les éléments et valider les choix."], ["Orée", "Contrôler, préparer et suivre selon le périmètre du service."], ["Administration", "Traiter la formalité selon ses délais et procédures."]].map(([title, description]) => <div key={title}><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">{description}</p></div>)}</div></Card></div></div>
  </div>;
}
