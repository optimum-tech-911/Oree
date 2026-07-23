import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Bot, BriefcaseBusiness, Building2, CalendarClock, Check, CircleAlert, Clock3, LoaderCircle, LockKeyhole, RotateCcw, Sparkles, UsersRound } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { TurnstileChallenge } from "@/components/security/TurnstileChallenge";
import { turnstileSiteKey } from "@/config/security";
import { useDiagnostic, type DiagnosticStep } from "@/features/diagnostic/useDiagnostic";
import { activityChoices, founderChoices, priorityChoices, professionalChoices, remunerationChoices, startingChoices, structureChoices, supportChoices, timelineChoices, type Choice } from "@/features/diagnostic/config";
import { getLegalForm } from "@/data/legalForms";
import { leadRepository } from "@/services/supabase/repositories";
import { isSupabaseConfigured } from "@/services/supabase/client";
import { analytics } from "@/services/analytics";
import { savePendingLeadContinuation } from "@/services/leadContinuation";
import { usePageMeta } from "@/hooks/usePageMeta";
import { cn } from "@/lib/cn";
import type { DiagnosticAnswers } from "@/types";

const stepLabels: Record<DiagnosticStep, string> = {
  starting: "Départ",
  founders: "Porteurs",
  situation: "Situation",
  activity: "Activité",
  priorities: "Priorités",
  timeline: "Calendrier",
  support: "Accompagnement",
  blockage: "Blocage",
  result: "Orientation",
  contact: "Synthèse",
};

function ChoiceGrid({ choices, value, values, onSelect, multiple = false }: { choices: Choice[]; value?: string; values?: string[]; onSelect: (value: string) => void; multiple?: boolean }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {choices.map((choice, index) => {
        const active = multiple ? values?.includes(choice.value) : value === choice.value;
        const Icon = choice.icon;
        return (
          <motion.button
            key={choice.value}
            type="button"
            onClick={() => onSelect(choice.value)}
            aria-pressed={Boolean(active)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: .985 }}
            className={cn("interactive-card group relative min-h-[112px] rounded-[24px] border p-4 text-left sm:p-5", active ? "border-[var(--ink)] bg-[var(--ink)] text-white shadow-[0_22px_65px_rgba(11,18,32,.18)]" : "border-[var(--line)] bg-white/82")}
          >
            <div className="flex items-start gap-4">
              {Icon ? <span className={cn("grid size-11 shrink-0 place-items-center rounded-[16px] transition duration-300", active ? "bg-white/9 text-[color:var(--mint)]" : "bg-[var(--paper)] text-[color:var(--ink)] group-hover:bg-[var(--mint-soft)]")}><Icon className="size-4.5" /></span> : <span className={cn("grid size-9 shrink-0 place-items-center rounded-full text-[10px] font-extrabold", active ? "bg-white/9 text-white" : "bg-[var(--paper)] text-[color:var(--muted)]")}>0{index + 1}</span>}
              <div className="min-w-0 pr-6"><p className="font-extrabold tracking-[-.02em]">{choice.label}</p>{choice.description ? <p className={cn("mt-1.5 text-sm leading-6", active ? "text-white/72" : "text-[color:var(--muted)]")}>{choice.description}</p> : null}</div>
            </div>
            {active ? <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-[var(--mint)] text-[color:var(--ink)] shadow-[0_8px_22px_rgba(70,214,166,.22)]"><Check className="size-3.5" /></motion.span> : null}
          </motion.button>
        );
      })}
    </div>
  );
}

function ProjectPulse({ diagnostic }: { diagnostic: ReturnType<typeof useDiagnostic> }) {
  const forms = diagnostic.recommendation.forms.slice(0, 2);
  const items = [
    { icon: Building2, label: "Structure", value: forms.length ? forms.map((code) => getLegalForm(code)?.label ?? code).join(" / ") : "À déterminer" },
    { icon: UsersRound, label: "Porteurs", value: diagnostic.answers.founderMode === "multiple" ? "Plusieurs associés" : diagnostic.answers.founderMode === "solo" ? "Projet solo" : "À préciser" },
    { icon: BriefcaseBusiness, label: "Activité", value: diagnostic.answers.activity ? activityChoices.find((choice) => choice.value === diagnostic.answers.activity)?.label ?? diagnostic.answers.activity : "À préciser" },
    { icon: CalendarClock, label: "Calendrier", value: diagnostic.answers.timeline ? timelineChoices.find((choice) => choice.value === diagnostic.answers.timeline)?.label ?? diagnostic.answers.timeline : "À préciser" },
  ];

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-26 space-y-4">
        <div className="route-map overflow-hidden rounded-[28px] border border-[var(--line)] bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between"><div><p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-[color:var(--muted)]">Projet en direct</p><p className="mt-2 text-lg font-extrabold tracking-[-.04em]">Votre feuille de route</p></div><span className="relative grid size-10 place-items-center rounded-[14px] bg-[var(--mint)]"><Sparkles className="size-4" /><span className="assistant-pulse" /></span></div>
          <div className="mt-5 space-y-2.5">{items.map((item) => { const Icon = item.icon; return <div key={item.label} className="flex items-center gap-3 rounded-[17px] border border-[var(--line)] bg-white/88 p-3"><span className="grid size-8 shrink-0 place-items-center rounded-[11px] bg-[var(--paper)]"><Icon className="size-3.5" /></span><div className="min-w-0"><p className="text-[8px] font-extrabold uppercase tracking-[.1em] text-[color:var(--muted)]">{item.label}</p><p className="mt-1 truncate text-[11px] font-extrabold">{item.value}</p></div></div>; })}</div>
          <div className="mt-5 rounded-[18px] bg-[var(--ink)] p-4 text-white"><p className="text-[9px] font-extrabold uppercase tracking-[.12em] text-white/72">Lecture actuelle</p><p className="mt-2 text-sm font-extrabold leading-5">{diagnostic.recommendation.title}</p><p className="mt-2 text-[10px] leading-5 text-white/72">L'orientation évolue à mesure que vous précisez le projet.</p></div>
        </div>
        <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("oree:assistant-open"))} className="group flex w-full items-center gap-3 rounded-[22px] bg-[var(--blue)] p-4 text-left text-white shadow-[0_20px_55px_rgba(36,87,255,.22)] transition hover:-translate-y-1"><span className="grid size-10 place-items-center rounded-[14px] bg-white text-[color:var(--ink)]"><Bot className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-xs font-extrabold">Une question pendant le parcours ?</span><span className="mt-1 block text-[9px] text-white/72">Le Guide connaît chaque étape.</span></span><ArrowRight className="size-4 transition group-hover:translate-x-1" /></button>
      </div>
    </aside>
  );
}

function TextInput({ label, value, onChange, placeholder, type = "text", maxLength, autoComplete }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string; maxLength?: number; autoComplete?: string }) {
  return <label className="text-sm font-extrabold">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} maxLength={maxLength} autoComplete={autoComplete} className="mt-2.5 h-14 w-full rounded-[18px] border border-[var(--line)] bg-white px-4 font-normal outline-none transition focus:border-[var(--accent)]/45 focus:ring-4 focus:ring-[var(--accent)]/8" placeholder={placeholder} /></label>;
}

export default function DiagnosticPage() {
  const diagnostic = useDiagnostic();
  const [searchParams] = useSearchParams();
  const beginFromSituation = diagnostic.beginFromSituation;
  const reduce = useReducedMotion();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionDemo, setSubmissionDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [turnstileUnavailable, setTurnstileUnavailable] = useState(false);
  const initializedIntent = useRef<string | null>(null);
  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const abandonedRef = useRef(false);
  const leadFormStartedRef = useRef(false);
  const submittedRef = useRef(false);
  const submissionIdRef = useRef<string | null>(null);
  const currentStepRef = useRef(diagnostic.step);
  const currentStepIndexRef = useRef(diagnostic.stepIndex);
  usePageMeta("Diagnostic de création de société", "Décrivez votre situation et obtenez une orientation indicative avant de constituer votre dossier.");

  useEffect(() => {
    currentStepRef.current = diagnostic.step;
    currentStepIndexRef.current = diagnostic.stepIndex;
    submittedRef.current = submitted;
  }, [diagnostic.step, diagnostic.stepIndex, submitted]);

  useEffect(() => {
    const intent = searchParams.get("intent");
    const startByIntent: Record<string, NonNullable<DiagnosticAnswers["startingSituation"]>> = {
      blocked_dossier: "blocked",
      job_seeker_creation: "job-seeker",
      micro_to_company: "micro",
      multi_founder: "multiple",
      employee_transition: "employee",
      creation_sasu: "solo",
      creation_eurl: "solo",
      creation_sas: "multiple",
      creation_sarl: "multiple",
      solo_founder: "solo",
    };
    const intentStartingSituation = intent ? startByIntent[intent] : undefined;
    if (!intent || !intentStartingSituation || initializedIntent.current === intent) return;
    initializedIntent.current = intent;
    beginFromSituation(intentStartingSituation);
  }, [beginFromSituation, searchParams]);

  useEffect(() => {
    if (diagnostic.step === "contact" && !leadFormStartedRef.current) {
      leadFormStartedRef.current = true;
      analytics.track("lead_form_started", { path: window.location.pathname });
    }
  }, [diagnostic.step]);

  useEffect(() => {
    if (diagnostic.step === "result" && !completedRef.current) {
      completedRef.current = true;
      analytics.track("diagnostic_completed", { forms: diagnostic.recommendation.forms, complexity: diagnostic.recommendation.complexity });
      analytics.track("orientation_viewed", { forms: diagnostic.recommendation.forms, complexity: diagnostic.recommendation.complexity });
    }
  }, [diagnostic.recommendation.complexity, diagnostic.recommendation.forms, diagnostic.step]);

  useEffect(() => {
    const trackAbandonment = () => {
      if (!startedRef.current || completedRef.current || submittedRef.current || abandonedRef.current) return;
      abandonedRef.current = true;
      analytics.track("diagnostic_abandoned", { step: currentStepRef.current, index: currentStepIndexRef.current });
    };
    window.addEventListener("pagehide", trackAbandonment);
    return () => {
      window.removeEventListener("pagehide", trackAbandonment);
      trackAbandonment();
    };
  }, []);

  function togglePriority(value: string) {
    const priorities = diagnostic.answers.priorities ?? [];
    diagnostic.update("priorities", priorities.includes(value) ? priorities.filter((item) => item !== value) : [...priorities, value]);
  }

  async function submit() {
    if (isSupabaseConfigured && !turnstileSiteKey) {
      setError("La vérification de sécurité n’est pas configurée. La transmission est temporairement indisponible.");
      return;
    }
    if (isSupabaseConfigured && !turnstileToken) {
      setError("Terminez la vérification anti-robot avant de transmettre la demande.");
      return;
    }
    setSubmitting(true); setError(null);
    try {
      submissionIdRef.current ??= globalThis.crypto.randomUUID();
      const result = await leadRepository.submit(diagnostic.answers, {
        result: diagnostic.recommendation,
        submissionId: submissionIdRef.current,
        anonymousSessionId: submissionIdRef.current,
        turnstileToken,
        honeypot,
      });
      analytics.track("lead_submitted", { stage: diagnostic.answers.stage, timeline: diagnostic.answers.timeline, forms: diagnostic.recommendation.forms });
      savePendingLeadContinuation(result, diagnostic.answers);
      setSubmissionDemo(result.demo);
      submittedRef.current = true;
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le projet n'a pas pu être enregistré.");
      if (isSupabaseConfigured) {
        setTurnstileToken("");
        setTurnstileUnavailable(false);
        setTurnstileReset((value) => value + 1);
      }
    } finally { setSubmitting(false); }
  }

  const stepTitles: Record<DiagnosticStep, [string, string]> = {
    starting: ["Quel est le point de départ de votre projet ?", "Commencez par votre situation réelle. Les statuts à comparer apparaîtront ensuite."],
    founders: ["Qui porte le projet ?", "Le nombre d'associés change la gouvernance, les documents et les structures à comparer."],
    situation: ["Quelle est votre situation actuelle ?", "Elle nous aide à distinguer création, transition et activité déjà existante."],
    activity: ["Quelle activité allez-vous exercer ?", "Le secteur permet d'anticiper des besoins, contraintes ou questions complémentaires."],
    priorities: ["Quels critères sont prioritaires pour votre projet ?", "Vous pouvez sélectionner plusieurs critères. Ils servent à expliquer l'orientation et ne constituent pas une optimisation automatique."],
    timeline: ["Quand souhaitez-vous avancer ?", "Le calendrier détermine si la prochaine étape doit être un dossier, une feuille de route ou un échange."],
    support: ["Quel accompagnement vous serait utile ?", "La synthèse reste indicative ; un échange peut être demandé pour les points à confirmer."],
    blockage: ["Quel est le blocage rencontré ?", "Décrivez le message reçu sans transmettre de document sensible, de coordonnées bancaires ou de pièce d’identité."],
    result: ["Votre orientation initiale est prête.", "Voici les structures à comparer et les sujets qui doivent encore être validés."],
    contact: ["Votre synthèse est prête.", "Les coordonnées servent à transmettre la synthèse et à traiter la demande. Aucun appel n’est demandé sans votre choix explicite."],
  };
  const [title, description] = stepTitles[diagnostic.step];

  function continueDiagnostic() {
    if (!startedRef.current) {
      startedRef.current = true;
      analytics.track("diagnostic_started", { path: window.location.pathname, intent: searchParams.get("intent") ?? "direct" });
    }
    analytics.track("diagnostic_step_completed", { step: diagnostic.step, index: diagnostic.stepIndex });
    diagnostic.next();
  }

  if (submitted) {
    return (
        <section className="relative min-h-[820px] overflow-hidden pb-24 pt-36 sm:pt-44"><div className="absolute inset-0 grid-fade opacity-60" /><div className="container-shell relative"><Card className="mx-auto max-w-3xl overflow-hidden p-0 text-center"><div className="relative overflow-hidden bg-[var(--ink)] px-7 py-12 text-white sm:px-12 sm:py-16"><div className="absolute inset-0 hero-grid opacity-45" /><span className="relative mx-auto grid size-17 place-items-center rounded-[22px] bg-[var(--mint)] text-[color:var(--ink)] shadow-[0_18px_48px_rgba(70,214,166,.22)]"><Check className="size-7" /></span><Badge className="relative mt-7 border-white/12 bg-white/7 text-white/72">Demande enregistrée</Badge><h1 className="relative mt-5 text-balance text-4xl font-semibold leading-[1] tracking-[-.06em] sm:text-6xl">Votre prochaine étape est définie.</h1><p className="relative mx-auto mt-5 max-w-xl text-base leading-8 text-white/72">{submissionDemo ? "Mode démonstration : aucune donnée personnelle n'a quitté votre navigateur et aucune demande externe n'a été créée." : "Votre demande a été transmise par la fonction serveur sécurisée. Un rappel n'est demandé que si vous avez choisi cette option."}</p></div><div className="p-7 sm:p-10"><div className="grid gap-3 sm:grid-cols-2"><ButtonLink to="/rendez-vous" size="lg" variant="accent" arrow>Demander un échange</ButtonLink><ButtonLink to="/inscription" variant="secondary" size="lg">Créer mon espace</ButtonLink></div><button onClick={() => { setSubmitted(false); setSubmissionDemo(false); startedRef.current = false; completedRef.current = false; abandonedRef.current = false; diagnostic.reset(); }} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[color:var(--muted)] transition hover:text-[color:var(--ink)]"><RotateCcw className="size-4" />Recommencer le diagnostic</button></div></Card></div></section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden pb-24 pt-28 sm:pt-34 lg:pt-36">
      <div className="absolute inset-0 grid-fade opacity-60" /><div className="absolute -left-44 top-10 size-[34rem] rounded-full bg-[var(--accent)]/8 blur-[90px]" /><div className="absolute -right-32 top-1/3 size-[30rem] rounded-full bg-[var(--mint)]/10 blur-[90px]" />
      <div className="container-wide relative">
        <div className="mb-5 flex gap-2 overflow-x-auto pb-2 lg:hidden">{diagnostic.steps.map((step, index) => <div key={step} className={cn("flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-extrabold uppercase tracking-[.08em]", index === diagnostic.stepIndex ? "border-[var(--ink)] bg-[var(--ink)] text-white" : index < diagnostic.stepIndex ? "border-[var(--mint)]/30 bg-[var(--mint-soft)] text-[color:var(--ink)]" : "border-[var(--line)] bg-white/60 text-[color:var(--muted)]")}><span className="grid size-5 place-items-center rounded-full bg-white/10">{index < diagnostic.stepIndex ? <Check className="size-3" /> : index + 1}</span>{stepLabels[step]}</div>)}</div>
        <div className="grid gap-5 lg:grid-cols-[290px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_270px]">
          <aside className="hidden lg:block">
            <div className="sticky top-26 overflow-hidden rounded-[32px] bg-[var(--ink)] p-5 text-white shadow-[0_35px_100px_rgba(11,18,32,.2)] xl:p-6">
              <div className="absolute -right-20 -top-20 size-56 rounded-full bg-[var(--accent)]/25 blur-3xl" />
              <div className="relative"><Badge className="border-white/10 bg-white/7 text-white/72">Diagnostic · {diagnostic.progress}%</Badge><h2 className="mt-5 text-2xl font-semibold leading-[1.05] tracking-[-.045em]">Votre projet en {diagnostic.steps.length} étapes courtes.</h2><div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/7"><motion.div className="h-full rounded-full bg-[linear-gradient(90deg,var(--mint),var(--sky),var(--accent))]" animate={{ width: `${diagnostic.progress}%` }} transition={{ duration: .35 }} /></div><ol className="mt-6 space-y-1">{diagnostic.steps.map((step, index) => <li key={step} className={cn("flex items-center gap-3 rounded-[15px] px-3 py-2.5 text-xs font-bold transition", index === diagnostic.stepIndex ? "bg-white/9 text-white" : index < diagnostic.stepIndex ? "text-white/68" : "text-white/72")}><span className={cn("grid size-6 place-items-center rounded-full text-[9px] font-extrabold", index < diagnostic.stepIndex ? "bg-[var(--mint)] text-[color:var(--ink)]" : index === diagnostic.stepIndex ? "bg-[var(--accent)] text-white" : "bg-white/6")}>{index < diagnostic.stepIndex ? <Check className="size-3" /> : index + 1}</span>{stepLabels[step]}{index === diagnostic.stepIndex ? <span className="ml-auto size-1.5 rounded-full bg-[var(--mint)]" /> : null}</li>)}</ol><div className="mt-6 rounded-[20px] border border-white/8 bg-white/[.04] p-4"><div className="flex gap-3"><LockKeyhole className="mt-0.5 size-4.5 shrink-0 text-[color:var(--mint)]" /><div><p className="text-xs font-extrabold">Sauvegarde locale</p><p className="mt-1 text-[11px] leading-5 text-white/72">Les réponses non sensibles sont conservées sur cet appareil. Aucun document n'est stocké ici.</p></div></div></div></div>
            </div>
          </aside>

          <Card className="overflow-hidden border-white/75 bg-white/78">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] bg-white/50 p-4 sm:px-7 sm:py-5"><div><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[color:var(--muted)]">Étape {diagnostic.stepIndex + 1} sur {diagnostic.steps.length}</p><div className="mt-2.5 h-1.5 w-40 overflow-hidden rounded-full bg-[var(--ink)]/7 lg:hidden"><motion.div className="h-full rounded-full bg-[linear-gradient(90deg,var(--mint),var(--accent))]" animate={{ width: `${diagnostic.progress}%` }} /></div></div><button onClick={diagnostic.reset} className="group inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-3 py-2 text-[10px] font-extrabold uppercase tracking-[.08em] text-[color:var(--muted)] transition hover:border-[var(--ink)]/20 hover:text-[color:var(--ink)]"><RotateCcw className="size-3.5 transition group-hover:-rotate-90" />Réinitialiser</button></div>
            <div className="min-h-[520px] p-5 sm:p-8 lg:p-10 xl:p-12">
              <AnimatePresence mode="wait"><motion.div key={diagnostic.step} initial={reduce ? false : { opacity: 0, x: 22, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={reduce ? undefined : { opacity: 0, x: -18, filter: "blur(4px)" }} transition={{ duration: .32 }}><Badge className="mb-5"><Sparkles className="size-3.5 text-[color:var(--accent)]" />Parcours adaptatif</Badge><h1 className="max-w-4xl text-balance text-3xl font-semibold leading-[1] tracking-[-.055em] sm:text-4xl lg:text-5xl xl:text-6xl">{title}</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">{description}</p><div className="mt-8 lg:mt-10">
                {diagnostic.step === "starting" ? <ChoiceGrid choices={startingChoices} value={diagnostic.answers.startingSituation} onSelect={(value) => diagnostic.update("startingSituation", value as never)} /> : null}
                {diagnostic.step === "founders" ? <ChoiceGrid choices={founderChoices} value={diagnostic.answers.founderMode} onSelect={(value) => diagnostic.update("founderMode", value as never)} /> : null}
                {diagnostic.step === "situation" ? <div className="space-y-9"><div><p className="mb-3 text-sm font-extrabold">Votre situation professionnelle</p><ChoiceGrid choices={professionalChoices} value={diagnostic.answers.professionalStatus} onSelect={(value) => diagnostic.update("professionalStatus", value as never)} /></div><div><p className="mb-3 text-sm font-extrabold">Exercez-vous déjà avec une structure ?</p><ChoiceGrid choices={structureChoices} value={diagnostic.answers.currentStructure} onSelect={(value) => diagnostic.update("currentStructure", value as never)} /></div></div> : null}
                {diagnostic.step === "activity" ? <div><ChoiceGrid choices={activityChoices} value={diagnostic.answers.activity} onSelect={(value) => diagnostic.update("activity", value)} /><label className="mt-5 flex cursor-pointer items-center gap-3 rounded-[22px] border border-[var(--line)] bg-[var(--paper-soft)] p-4 transition hover:bg-white"><input type="checkbox" checked={diagnostic.answers.existingClients ?? false} onChange={(event) => diagnostic.update("existingClients", event.target.checked)} className="size-5 accent-[var(--ink)]" /><span><strong className="block text-sm">J'ai déjà des clients ou des premières ventes</strong><span className="mt-1 block text-xs text-[color:var(--muted)]">Cette information aide à qualifier le niveau de maturité.</span></span></label></div> : null}
                {diagnostic.step === "priorities" ? <><ChoiceGrid multiple choices={priorityChoices} values={diagnostic.answers.priorities} onSelect={togglePriority} /><p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[color:var(--muted)]"><Sparkles className="size-3.5 text-[color:var(--accent)]" />Vous pouvez sélectionner plusieurs éléments.</p></> : null}
                {diagnostic.step === "timeline" ? <div className="space-y-7"><ChoiceGrid choices={timelineChoices} value={diagnostic.answers.timeline} onSelect={(value) => diagnostic.update("timeline", value as never)} /><div className="rounded-[24px] border border-[var(--line)] bg-[var(--paper-soft)] p-5"><TextInput label="Numéro du département principal" value={diagnostic.answers.department ?? ""} onChange={(value) => diagnostic.update("department", value.toUpperCase())} placeholder="Ex. 34" maxLength={3} autoComplete="address-level1" /><p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">Indiquez uniquement le code du département, par exemple 34, 2A ou 971.</p></div></div> : null}
                {diagnostic.step === "support" ? <div className="space-y-8"><div><p className="mb-3 text-sm font-extrabold">Envisagez-vous une rémunération dès le démarrage ?</p><ChoiceGrid choices={remunerationChoices} value={diagnostic.answers.remunerationTiming} onSelect={(value) => diagnostic.update("remunerationTiming", value as never)} /></div><div><p className="mb-3 text-sm font-extrabold">Quel niveau d’accompagnement recherchez-vous ?</p><ChoiceGrid choices={supportChoices} value={diagnostic.answers.supportLevel} onSelect={(value) => diagnostic.update("supportLevel", value as never)} /></div></div> : null}
                {diagnostic.step === "blockage" ? <div className="space-y-7"><ChoiceGrid choices={[{ value: "identite", label: "Identité ou justificatif" }, { value: "statuts", label: "Statuts ou décisions" }, { value: "capital", label: "Capital ou apports" }, { value: "annonce", label: "Annonce ou dépôt" }, { value: "autre", label: "Autre demande" }]} value={diagnostic.answers.blockedStage} onSelect={(value) => diagnostic.update("blockedStage", value)} /><label className="block text-sm font-extrabold">Décrivez le message ou la demande reçue<textarea value={diagnostic.answers.blockedMessage ?? ""} onChange={(event) => diagnostic.update("blockedMessage", event.target.value)} rows={6} className="mt-2.5 w-full resize-y rounded-[18px] border border-[var(--line)] bg-white p-4 font-normal leading-6 outline-none transition focus:border-[var(--blue)]/45 focus:ring-4 focus:ring-[var(--blue)]/8" placeholder="Copiez le message reçu ou décrivez ce qui vous empêche d’avancer…" /><span className="mt-2 block text-xs font-normal leading-5 text-[color:var(--muted)]">Ne transmettez pas ici de pièce d’identité, de coordonnées bancaires ou de document sensible.</span></label></div> : null}
                {diagnostic.step === "result" ? <div><div className="relative overflow-hidden rounded-[30px] bg-[var(--ink)] p-6 text-white sm:p-8"><div className="absolute -right-20 -top-24 size-72 rounded-full bg-[var(--accent)]/28 blur-3xl" /><div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-white/72">Orientation indicative</p><h2 className="mt-3 text-2xl font-semibold leading-tight tracking-[-.045em] sm:text-4xl">{diagnostic.recommendation.title}</h2></div><span className="w-fit rounded-full bg-[var(--mint)] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.08em] text-[color:var(--ink)]">Complexité {diagnostic.recommendation.complexity}</span></div><div className="relative mt-6 flex flex-wrap gap-2">{diagnostic.recommendation.forms.map((code) => <span key={code} className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-extrabold">{getLegalForm(code)?.label ?? code}</span>)}</div><p className="relative mt-6 text-sm leading-7 text-white/72">{diagnostic.recommendation.explanation}</p></div><div className="mt-4 grid gap-4 lg:grid-cols-2"><div className="rounded-[25px] border border-[var(--line)] bg-white p-5 sm:p-6"><p className="text-sm font-extrabold">Pourquoi ces pistes ?</p><ul className="mt-4 space-y-3">{diagnostic.recommendation.reasons.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[color:var(--muted)]"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--mint-soft)]"><Check className="size-3 text-[color:var(--success)]" /></span>{item}</li>)}</ul></div><div className="rounded-[25px] border border-[var(--blue)]/20 bg-[var(--blue)]/8 p-5 sm:p-6"><p className="flex items-center gap-2 text-sm font-extrabold text-[color:var(--ink)]"><CircleAlert className="size-4" />Points à valider</p><ul className="mt-4 space-y-3">{diagnostic.recommendation.pointsToValidate.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[color:var(--ink)]/70"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--blue)]/80" />{item}</li>)}</ul></div></div></div> : null}
                {diagnostic.step === "contact" ? <div><label aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">Votre site internet<input type="url" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} /></label><div className="grid gap-4 sm:grid-cols-2"><TextInput label="Prénom" value={diagnostic.answers.firstName ?? ""} onChange={(value) => diagnostic.update("firstName", value)} placeholder="Votre prénom" autoComplete="given-name" /><TextInput label="Nom" value={diagnostic.answers.lastName ?? ""} onChange={(value) => diagnostic.update("lastName", value)} placeholder="Votre nom" autoComplete="family-name" /><TextInput type="email" label="E-mail pour transmettre la synthèse" value={diagnostic.answers.email ?? ""} onChange={(value) => diagnostic.update("email", value)} placeholder="vous@exemple.fr" autoComplete="email" /><TextInput type="tel" label="Téléphone facultatif" value={diagnostic.answers.phone ?? ""} onChange={(value) => diagnostic.update("phone", value)} placeholder="06 00 00 00 00" autoComplete="tel" /></div><p className="mt-3 text-xs leading-5 text-[color:var(--muted)]">Ces coordonnées ne sont jamais enregistrées dans le brouillon local. Le téléphone devient nécessaire uniquement si vous demandez un rappel.</p><label className="mt-5 flex cursor-pointer items-start gap-3 rounded-[22px] border border-[var(--line)] bg-[var(--paper-soft)] p-4"><input type="checkbox" checked={diagnostic.answers.wantsCallback ?? false} onChange={(event) => diagnostic.update("wantsCallback", event.target.checked)} className="mt-0.5 size-5 accent-[var(--blue)]" /><span><strong className="block text-sm">Je souhaite être rappelé au sujet de mon projet</strong><span className="mt-1 block text-xs leading-5 text-[color:var(--muted)]">Cette option est facultative et distincte de la transmission de la synthèse.</span></span></label><label className="mt-3 flex cursor-pointer items-start gap-3 rounded-[22px] border border-[var(--line)] bg-white p-4"><input type="checkbox" checked={diagnostic.answers.privacyAccepted ?? false} onChange={(event) => diagnostic.update("privacyAccepted", event.target.checked)} className="mt-0.5 size-5 accent-[var(--blue)]" /><span><strong className="block text-sm">J’accepte le traitement de mes données pour transmettre et traiter cette demande.</strong><span className="mt-1 block text-xs leading-5 text-[color:var(--muted)]">Consultez la politique de confidentialité pour connaître les finalités, accès et durées de conservation.</span></span></label>{isSupabaseConfigured ? <div className="mt-4 rounded-[20px] border border-[var(--line)] bg-[var(--paper-soft)] p-4"><div className="mb-3 flex items-center gap-2 text-xs font-extrabold"><LockKeyhole className="size-4 text-[color:var(--blue)]" />Protection anti-robot</div>{turnstileSiteKey ? <TurnstileChallenge key={turnstileReset} onVerify={(token) => { setTurnstileToken(token); setTurnstileUnavailable(false); if (token) setError(null); }} onExpire={() => { setTurnstileToken(""); setError("La vérification anti-robot a expiré. Effectuez-la de nouveau avant l’envoi."); }} onUnavailable={() => { setTurnstileToken(""); setTurnstileUnavailable(true); setError("La vérification anti-robot n’a pas pu se charger. Vérifiez votre connexion puis réessayez."); }} /> : <p role="alert" className="text-xs leading-5 text-[color:var(--blue)]">La transmission est indisponible tant que la clé publique Turnstile n’est pas configurée.</p>}{turnstileUnavailable ? <button type="button" className="mt-3 text-xs font-extrabold text-[color:var(--blue)] underline underline-offset-4" onClick={() => { setTurnstileUnavailable(false); setError(null); setTurnstileReset((value) => value + 1); }}>Réessayer la vérification</button> : null}</div> : null}{error ? <div role="alert" className="mt-4 rounded-[18px] bg-[var(--blue)]/8 p-4 text-sm font-bold text-[color:var(--blue)]">{error}</div> : null}</div> : null}
              </div></motion.div></AnimatePresence>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] bg-white/55 p-4 sm:px-8 sm:py-5"><Button onClick={diagnostic.previous} disabled={diagnostic.stepIndex === 0} variant="ghost"><ArrowLeft className="size-4" />Retour</Button><div className="hidden items-center gap-2 text-[10px] font-bold text-[color:var(--muted)] sm:flex"><Clock3 className="size-3.5" />Choix non sensibles sauvegardés</div>{diagnostic.step === "contact" ? <Button variant="accent" onClick={() => void submit()} disabled={!diagnostic.canContinue || submitting}>{submitting ? <LoaderCircle className="size-4 animate-spin" /> : null}Transmettre ma demande</Button> : <Button variant="accent" onClick={continueDiagnostic} disabled={!diagnostic.canContinue}>{diagnostic.step === "result" ? "Continuer" : "Étape suivante"}<ArrowRight className="size-4" /></Button>}</div>
          </Card>
          <ProjectPulse diagnostic={diagnostic} />
        </div>
      </div>
    </section>
  );
}
