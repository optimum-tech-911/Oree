import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  Check,
  CircleAlert,
  LoaderCircle,
  LockKeyhole,
  PhoneCall,
  RotateCcw,
  UsersRound,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useDiagnostic, type DiagnosticStep } from "@/features/diagnostic/useDiagnostic";
import {
  activityChoices,
  founderChoices,
  priorityChoices,
  professionalChoices,
  remunerationChoices,
  startingChoices,
  structureChoices,
  supportChoices,
  timelineChoices,
  type Choice,
} from "@/features/diagnostic/config";
import { getLegalForm } from "@/data/legalForms";
import { leadRepository } from "@/services/supabase/repositories";
import { analytics } from "@/services/analytics";
import { savePendingLeadContinuation } from "@/services/leadContinuation";
import { usePageMeta } from "@/hooks/usePageMeta";
import { cn } from "@/lib/cn";
import type { DiagnosticAnswers } from "@/types";
import { CompanyOfferCard } from "@/components/marketing/CommercialOfferCard";
import {
  buildPhoneHref,
  commercialOffers,
  isSupportedCompanyForm,
} from "@/config/commercial-offers";

const stepLabels: Record<DiagnosticStep, string> = {
  starting: "Point de départ",
  founders: "Porteurs du projet",
  situation: "Situation actuelle",
  activity: "Activité",
  priorities: "Priorités",
  timeline: "Calendrier",
  support: "Accompagnement",
  blockage: "Blocage",
  result: "Première recommandation",
  contact: "Coordonnées",
};

function ChoiceGrid({
  choices,
  value,
  values,
  onSelect,
  multiple = false,
}: {
  choices: Choice[];
  value?: string;
  values?: string[];
  onSelect: (value: string) => void;
  multiple?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {choices.map((choice, index) => {
        const active = multiple ? values?.includes(choice.value) : value === choice.value;
        const Icon = choice.icon;
        return (
          <motion.button
            key={choice.value}
            type="button"
            onClick={() => onSelect(choice.value)}
            aria-pressed={Boolean(active)}
            whileHover={reduce ? undefined : { y: -2 }}
            whileTap={reduce ? undefined : { scale: .99 }}
            className={cn(
              "group relative min-h-[96px] rounded-[14px] border px-4 py-4 text-left transition sm:px-5",
              active
                ? "border-[var(--ink)] bg-[var(--ink)] text-white shadow-[0_14px_36px_rgba(11,18,32,.14)]"
                : "border-[var(--line-strong)] bg-white hover:border-[var(--blue)]/38",
            )}
          >
            <div className="flex items-start gap-3">
              {Icon
                ? <Icon className={cn("mt-0.5 size-4.5 shrink-0", active ? "text-[color:var(--mint)]" : "text-[color:var(--blue)]")} />
                : <span className={cn("mt-0.5 shrink-0 text-xs font-semibold", active ? "text-[color:var(--mint)]" : "text-[color:var(--muted)]")}>0{index + 1}</span>}
              <div className="min-w-0 pr-5">
                <p className="font-semibold tracking-[-.015em]">{choice.label}</p>
                {choice.description ? <p className={cn("mt-1.5 text-sm leading-6", active ? "text-white/72" : "text-[color:var(--muted)]")}>{choice.description}</p> : null}
              </div>
            </div>
            {active ? <span className="absolute right-3 top-3 text-[color:var(--mint)]"><Check className="size-4" /></span> : null}
          </motion.button>
        );
      })}
    </div>
  );
}

function ProjectSummary({ diagnostic }: { diagnostic: ReturnType<typeof useDiagnostic> }) {
  const forms = diagnostic.recommendation.forms.slice(0, 2);
  const items = [
    { icon: Building2, label: "Structure à comparer", value: forms.length ? forms.map((code) => getLegalForm(code)?.label ?? code).join(" / ") : "À déterminer" },
    { icon: UsersRound, label: "Porteurs", value: diagnostic.answers.founderMode === "multiple" ? "Plusieurs associés" : diagnostic.answers.founderMode === "solo" ? "Projet solo" : "À préciser" },
    { icon: BriefcaseBusiness, label: "Activité", value: diagnostic.answers.activity ? activityChoices.find((choice) => choice.value === diagnostic.answers.activity)?.label ?? diagnostic.answers.activity : "À préciser" },
    { icon: CalendarClock, label: "Calendrier", value: diagnostic.answers.timeline ? timelineChoices.find((choice) => choice.value === diagnostic.answers.timeline)?.label ?? diagnostic.answers.timeline : "À préciser" },
  ];

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 border-l border-[var(--line-strong)] pl-7">
        <p className="text-sm font-semibold text-[color:var(--blue)]">Votre projet</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-.035em]">D’après vos réponses</h2>
        <dl className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="py-3.5">
                <dt className="flex items-center gap-2 text-xs text-[color:var(--muted)]"><Icon className="size-3.5" />{item.label}</dt>
                <dd className="mt-1.5 text-sm font-semibold leading-5">{item.value}</dd>
              </div>
            );
          })}
        </dl>
        <div className="mt-6">
          <p className="text-xs leading-5 text-[color:var(--muted)]">Cette première recommandation évolue lorsque vous précisez le projet.</p>
          <a
            href={buildPhoneHref()}
            data-phone-number={commercialOffers.contact.displayPhone}
            onClick={() => analytics.track("phone_click", { location: "diagnostic_summary", step: diagnostic.step })}
            className="button-on-action mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[13px] bg-[var(--blue)] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            <PhoneCall className="size-4" />Besoin d’aide&nbsp;? Appeler
          </a>
          <p className="mt-2 text-center text-xs font-semibold">{commercialOffers.contact.displayPhone}</p>
        </div>
      </div>
    </aside>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  maxLength?: number;
  autoComplete?: string;
}) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className="mt-2.5 h-13 w-full rounded-[12px] border border-[var(--line-strong)] bg-white px-4 font-normal outline-none transition focus:border-[var(--blue)]/55 focus:ring-4 focus:ring-[var(--blue)]/8"
        placeholder={placeholder}
      />
    </label>
  );
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
  const initializedIntent = useRef<string | null>(null);
  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const abandonedRef = useRef(false);
  const leadFormStartedRef = useRef(false);
  const submittedRef = useRef(false);
  const submissionIdRef = useRef<string | null>(null);
  const currentStepRef = useRef(diagnostic.step);
  const currentStepIndexRef = useRef(diagnostic.stepIndex);

  usePageMeta("Diagnostic de création de société", "Décrivez votre situation et obtenez une première recommandation avant de constituer votre dossier.");

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
    setSubmitting(true);
    setError(null);
    try {
      submissionIdRef.current ??= globalThis.crypto.randomUUID();
      const recommendedForm = diagnostic.recommendation.forms.find((form) => isSupportedCompanyForm(form));
      const leadAnswers: DiagnosticAnswers = {
        ...diagnostic.answers,
        preferredContactChannel: diagnostic.answers.wantsCallback ? "phone" : "email",
        legalFormInterest: recommendedForm,
        activityDetails: diagnostic.answers.activity,
        creationTimeline: diagnostic.answers.timeline,
        message: diagnostic.answers.blockedMessage,
      };
      const result = await leadRepository.submit(leadAnswers, {
        result: diagnostic.recommendation,
        submissionId: submissionIdRef.current,
        anonymousSessionId: submissionIdRef.current,
        honeypot,
      });
      analytics.trackOnce("lead_submitted", result.id, { stage: diagnostic.answers.stage, timeline: diagnostic.answers.timeline, forms: diagnostic.recommendation.forms });
      savePendingLeadContinuation(result, diagnostic.answers);
      setSubmissionDemo(result.demo);
      submittedRef.current = true;
      setSubmitted(true);
    } catch (cause) {
      if (import.meta.env.DEV) console.error("diagnostic-submit", cause);
      setError("Nous n’avons pas pu transmettre votre demande. Vérifiez votre connexion, puis réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  const stepTitles: Record<DiagnosticStep, [string, string]> = {
    starting: ["Quel est le point de départ de votre projet ?", "Commencez par votre situation réelle. Les statuts à comparer apparaîtront ensuite."],
    founders: ["Qui porte le projet ?", "Le nombre d’associés change la gouvernance, les documents et les structures à comparer."],
    situation: ["Quelle est votre situation actuelle ?", "Elle nous aide à distinguer création, transition et activité déjà existante."],
    activity: ["Quelle activité allez-vous exercer ?", "Le secteur permet d’anticiper les besoins, contraintes ou questions complémentaires."],
    priorities: ["Quels critères sont prioritaires pour votre projet ?", "Vous pouvez en sélectionner plusieurs. Ils servent à expliquer la recommandation."],
    timeline: ["Quand souhaitez-vous avancer ?", "Le calendrier aide à déterminer si la prochaine étape doit être un dossier, une préparation ou un échange."],
    support: ["Quel accompagnement vous serait utile ?", "Un échange peut être demandé pour reprendre les points qui restent à confirmer."],
    blockage: ["Quel est le blocage rencontré ?", "Décrivez le message reçu sans transmettre de document sensible, de coordonnées bancaires ou de pièce d’identité."],
    result: ["Votre première recommandation est prête.", "Voici les structures à comparer et les sujets qui doivent encore être validés."],
    contact: ["Recevez votre synthèse.", "Vos coordonnées servent à transmettre et traiter la demande. Aucun appel n’est demandé sans votre accord."],
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
      <section className="min-h-[760px] pb-24 pt-36 sm:pt-44">
        <div className="container-copy">
          <div className="overflow-hidden rounded-[18px] border border-[var(--line-strong)] bg-white text-center">
            <div className="bg-[var(--ink)] px-7 py-12 text-white sm:px-12 sm:py-15">
              <span className="mx-auto grid size-13 place-items-center rounded-full bg-[var(--mint)] text-[color:var(--ink)]"><Check className="size-6" /></span>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1] tracking-[-.05em] sm:text-5xl">Votre demande est bien enregistrée.</h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-white/72">
                {submissionDemo
                  ? "Mode démonstration : aucune donnée personnelle n’a quitté votre navigateur et aucune demande externe n’a été créée."
                  : "Votre demande a été transmise à l’équipe. Un rappel sera demandé seulement si vous avez choisi cette option."}
              </p>
            </div>
            <div className="p-7 sm:p-9">
              <div className="grid gap-3 sm:grid-cols-2">
                <a href={buildPhoneHref()} data-phone-number={commercialOffers.contact.displayPhone} onClick={() => analytics.track("phone_click", { location: "diagnostic_success" })} className="button-on-action inline-flex min-h-14 items-center justify-center gap-2 rounded-[14px] bg-[var(--blue)] px-6 text-sm font-semibold text-white"><PhoneCall className="size-4" />Appeler l’équipe</a>
                <ButtonLink to="/inscription" variant="secondary" size="lg">Créer mon espace</ButtonLink>
              </div>
              <button onClick={() => { setSubmitted(false); setSubmissionDemo(false); startedRef.current = false; completedRef.current = false; abandonedRef.current = false; diagnostic.reset(); }} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--muted)] transition hover:text-[color:var(--ink)]"><RotateCcw className="size-4" />Recommencer le diagnostic</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pb-24 pt-28 sm:pt-34 lg:pt-36">
      <div className="container-shell">
        <div className="mb-6 flex flex-col gap-4 border-b border-[var(--line-strong)] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[color:var(--blue)]">Diagnostic de création de société</p>
            <p className="mt-2 text-sm text-[color:var(--muted)]">Question {diagnostic.stepIndex + 1} sur {diagnostic.steps.length} · {stepLabels[diagnostic.step]}</p>
          </div>
          <a href={buildPhoneHref()} data-phone-number={commercialOffers.contact.displayPhone} onClick={() => analytics.track("phone_click", { location: "diagnostic_mobile_help", step: diagnostic.step })} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[color:var(--blue)] lg:hidden"><PhoneCall className="size-4" />Besoin d’aide&nbsp;? Appeler</a>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_270px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-14">
          <article className="overflow-hidden rounded-[18px] border border-[var(--line-strong)] bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-4 py-4 sm:px-7">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="shrink-0 text-xs font-semibold">{diagnostic.stepIndex + 1}/{diagnostic.steps.length}</span>
                <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[var(--ink)]/8" aria-label={`Progression ${diagnostic.progress}%`}>
                  <motion.div className="h-full rounded-full bg-[var(--blue)]" animate={{ width: `${diagnostic.progress}%` }} transition={{ duration: reduce ? 0 : .3 }} />
                </div>
              </div>
              <button onClick={diagnostic.reset} className="inline-flex min-h-10 shrink-0 items-center gap-2 px-2 text-xs font-semibold text-[color:var(--muted)] transition hover:text-[color:var(--ink)]"><RotateCcw className="size-3.5" />Recommencer</button>
            </div>

            <div className="min-h-[500px] p-5 sm:p-8 lg:p-10 xl:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={diagnostic.step}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: .25 }}
                >
                  <p className="text-sm font-semibold text-[color:var(--blue)]">{stepLabels[diagnostic.step]}</p>
                  <h1 className="mt-3 max-w-4xl text-balance text-3xl font-semibold leading-[1.02] tracking-[-.05em] sm:text-4xl lg:text-5xl">{title}</h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">{description}</p>

                  <div className="mt-8 lg:mt-10">
                    {diagnostic.step === "starting" ? <ChoiceGrid choices={startingChoices} value={diagnostic.answers.startingSituation} onSelect={(value) => diagnostic.update("startingSituation", value as never)} /> : null}
                    {diagnostic.step === "founders" ? <ChoiceGrid choices={founderChoices} value={diagnostic.answers.founderMode} onSelect={(value) => diagnostic.update("founderMode", value as never)} /> : null}
                    {diagnostic.step === "situation" ? <div className="space-y-9"><div><p className="mb-3 text-sm font-semibold">Votre situation professionnelle</p><ChoiceGrid choices={professionalChoices} value={diagnostic.answers.professionalStatus} onSelect={(value) => diagnostic.update("professionalStatus", value as never)} /></div><div><p className="mb-3 text-sm font-semibold">Exercez-vous déjà avec une structure ?</p><ChoiceGrid choices={structureChoices} value={diagnostic.answers.currentStructure} onSelect={(value) => diagnostic.update("currentStructure", value as never)} /></div></div> : null}
                    {diagnostic.step === "activity" ? <div><ChoiceGrid choices={activityChoices} value={diagnostic.answers.activity} onSelect={(value) => diagnostic.update("activity", value)} /><label className="mt-5 flex cursor-pointer items-center gap-3 border-t border-[var(--line)] pt-5"><input type="checkbox" checked={diagnostic.answers.existingClients ?? false} onChange={(event) => diagnostic.update("existingClients", event.target.checked)} className="size-5 accent-[var(--ink)]" /><span><strong className="block text-sm font-semibold">J’ai déjà des clients ou des premières ventes</strong><span className="mt-1 block text-xs text-[color:var(--muted)]">Cette information aide à situer l’avancement du projet.</span></span></label></div> : null}
                    {diagnostic.step === "priorities" ? <><ChoiceGrid multiple choices={priorityChoices} values={diagnostic.answers.priorities} onSelect={togglePriority} /><p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[color:var(--muted)]"><Check className="size-3.5 text-[color:var(--success)]" />Vous pouvez sélectionner plusieurs éléments.</p></> : null}
                    {diagnostic.step === "timeline" ? <div className="space-y-7"><ChoiceGrid choices={timelineChoices} value={diagnostic.answers.timeline} onSelect={(value) => diagnostic.update("timeline", value as never)} /><div className="border-t border-[var(--line)] pt-6"><TextInput label="Numéro du département principal" value={diagnostic.answers.department ?? ""} onChange={(value) => diagnostic.update("department", value.toUpperCase())} placeholder="Ex. 34" maxLength={3} autoComplete="address-level1" /><p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">Indiquez uniquement le code du département, par exemple 34, 2A ou 971.</p></div></div> : null}
                    {diagnostic.step === "support" ? <div className="space-y-8"><div><p className="mb-3 text-sm font-semibold">Envisagez-vous une rémunération dès le démarrage ?</p><ChoiceGrid choices={remunerationChoices} value={diagnostic.answers.remunerationTiming} onSelect={(value) => diagnostic.update("remunerationTiming", value as never)} /></div><div><p className="mb-3 text-sm font-semibold">Quel niveau d’accompagnement recherchez-vous ?</p><ChoiceGrid choices={supportChoices} value={diagnostic.answers.supportLevel} onSelect={(value) => diagnostic.update("supportLevel", value as never)} /></div></div> : null}
                    {diagnostic.step === "blockage" ? <div className="space-y-7"><ChoiceGrid choices={[{ value: "identite", label: "Identité ou justificatif" }, { value: "statuts", label: "Statuts ou décisions" }, { value: "capital", label: "Capital ou apports" }, { value: "annonce", label: "Annonce ou dépôt" }, { value: "autre", label: "Autre demande" }]} value={diagnostic.answers.blockedStage} onSelect={(value) => diagnostic.update("blockedStage", value)} /><label className="block text-sm font-semibold">Décrivez le message ou la demande reçue<textarea value={diagnostic.answers.blockedMessage ?? ""} onChange={(event) => diagnostic.update("blockedMessage", event.target.value)} rows={6} className="mt-2.5 w-full resize-y rounded-[12px] border border-[var(--line-strong)] bg-white p-4 font-normal leading-6 outline-none transition focus:border-[var(--blue)]/55 focus:ring-4 focus:ring-[var(--blue)]/8" placeholder="Copiez le message reçu ou décrivez ce qui vous empêche d’avancer…" /><span className="mt-2 block text-xs font-normal leading-5 text-[color:var(--muted)]">Ne transmettez pas ici de pièce d’identité, de coordonnées bancaires ou de document sensible.</span></label></div> : null}

                    {diagnostic.step === "result" ? <div>
                      <div className="rounded-[16px] bg-[var(--ink)] p-6 text-white sm:p-8">
                        <p className="text-sm font-semibold text-[color:var(--mint)]">Notre première recommandation</p>
                        <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-[-.04em] sm:text-4xl">{diagnostic.recommendation.title}</h2>
                        <p className="mt-4 text-sm font-semibold text-white/82">{diagnostic.recommendation.forms.map((code) => getLegalForm(code)?.label ?? code).join(" · ")}</p>
                        <p className="mt-5 text-sm leading-7 text-white/72">{diagnostic.recommendation.explanation}</p>
                      </div>
                      <div className="mt-7 grid gap-7 border-y border-[var(--line)] py-7 lg:grid-cols-2 lg:divide-x lg:divide-[var(--line)]">
                        <div className="lg:pr-7"><p className="text-sm font-semibold">Pourquoi ces pistes ?</p><ul className="mt-4 space-y-3">{diagnostic.recommendation.reasons.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[color:var(--muted)]"><Check className="mt-1 size-3.5 shrink-0 text-[color:var(--success)]" />{item}</li>)}</ul></div>
                        <div className="lg:pl-7"><p className="flex items-center gap-2 text-sm font-semibold"><CircleAlert className="size-4 text-[color:var(--blue)]" />À vérifier ensemble</p><ul className="mt-4 space-y-3">{diagnostic.recommendation.pointsToValidate.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[color:var(--muted)]"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--blue)]" />{item}</li>)}</ul></div>
                      </div>
                      {(() => { const form = diagnostic.recommendation.forms.find((code) => isSupportedCompanyForm(code)); return form ? <div className="mt-6"><CompanyOfferCard form={form} compact showCta={false} trackingLocation="diagnostic_result" /></div> : null; })()}
                    </div> : null}

                    {diagnostic.step === "contact" ? <div>
                      <label aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">Votre site internet<input type="url" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} /></label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <TextInput label="Prénom" value={diagnostic.answers.firstName ?? ""} onChange={(value) => diagnostic.update("firstName", value)} placeholder="Votre prénom" autoComplete="given-name" />
                        <TextInput label="Nom" value={diagnostic.answers.lastName ?? ""} onChange={(value) => diagnostic.update("lastName", value)} placeholder="Votre nom" autoComplete="family-name" />
                        <TextInput type="email" label="E-mail pour transmettre la synthèse" value={diagnostic.answers.email ?? ""} onChange={(value) => diagnostic.update("email", value)} placeholder="vous@exemple.fr" autoComplete="email" />
                        <TextInput type="tel" label="Téléphone facultatif" value={diagnostic.answers.phone ?? ""} onChange={(value) => diagnostic.update("phone", value)} placeholder="06 00 00 00 00" autoComplete="tel" />
                      </div>
                      <p className="mt-3 text-xs leading-5 text-[color:var(--muted)]">Ces coordonnées ne sont pas enregistrées dans le brouillon local. Le téléphone devient nécessaire uniquement si vous demandez un rappel.</p>
                      <label className="mt-6 flex cursor-pointer items-start gap-3 border-t border-[var(--line)] pt-5"><input type="checkbox" checked={diagnostic.answers.wantsCallback ?? false} onChange={(event) => diagnostic.update("wantsCallback", event.target.checked)} className="mt-0.5 size-5 accent-[var(--blue)]" /><span><strong className="block text-sm font-semibold">Je souhaite être rappelé au sujet de mon projet</strong><span className="mt-1 block text-xs leading-5 text-[color:var(--muted)]">Cette option est facultative et distincte de l’envoi de la synthèse.</span></span></label>
                      <label className="mt-5 flex cursor-pointer items-start gap-3 border-t border-[var(--line)] pt-5"><input type="checkbox" checked={diagnostic.answers.privacyAccepted ?? false} onChange={(event) => diagnostic.update("privacyAccepted", event.target.checked)} className="mt-0.5 size-5 accent-[var(--blue)]" /><span><strong className="block text-sm font-semibold">J’accepte le traitement de mes données pour transmettre et traiter cette demande.</strong><span className="mt-1 block text-xs leading-5 text-[color:var(--muted)]">Consultez la politique de confidentialité pour connaître les finalités, accès et durées de conservation.</span></span></label>
                      {error ? <div role="alert" className="mt-5 border-l-4 border-[var(--blue)] bg-[var(--blue)]/7 p-4 text-sm font-semibold text-[color:var(--ink)]">{error}</div> : null}
                    </div> : null}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] bg-[var(--paper)]/55 p-4 sm:px-8 sm:py-5">
              <Button onClick={diagnostic.previous} disabled={diagnostic.stepIndex === 0} variant="ghost"><ArrowLeft className="size-4" />Retour</Button>
              <div className="hidden items-center gap-2 text-xs text-[color:var(--muted)] md:flex"><LockKeyhole className="size-3.5" />Choix non sensibles sauvegardés</div>
              {diagnostic.step === "contact"
                ? <Button variant="accent" onClick={() => void submit()} disabled={!diagnostic.canContinue || submitting}>{submitting ? <LoaderCircle className="size-4 animate-spin" /> : null}Transmettre ma demande</Button>
                : <Button variant="accent" onClick={continueDiagnostic} disabled={!diagnostic.canContinue}>{diagnostic.step === "result" ? "Continuer" : "Étape suivante"}<ArrowRight className="size-4" /></Button>}
            </div>
          </article>

          <ProjectSummary diagnostic={diagnostic} />
        </div>
      </div>
    </section>
  );
}
