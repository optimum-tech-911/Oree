import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Bot, BriefcaseBusiness, Building2, CalendarClock, Check, CircleAlert, Clock3, LoaderCircle, LockKeyhole, RotateCcw, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useDiagnostic } from "@/features/diagnostic/useDiagnostic";
import { activityChoices, founderChoices, priorityChoices, professionalChoices, stageChoices, structureChoices, timelineChoices, type Choice } from "@/features/diagnostic/config";
import { getLegalForm } from "@/data/legalForms";
import { leadRepository } from "@/services/supabase/repositories";
import { analytics } from "@/services/analytics";
import { usePageMeta } from "@/hooks/usePageMeta";
import { cn } from "@/lib/cn";

const stepLabels = ["Avancement", "Porteurs", "Situation", "Activité", "Priorités", "Calendrier", "Orientation", "Coordonnées"];

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

function TextInput({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return <label className="text-sm font-extrabold">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2.5 h-14 w-full rounded-[18px] border border-[var(--line)] bg-white px-4 font-normal outline-none transition focus:border-[var(--accent)]/45 focus:ring-4 focus:ring-[var(--accent)]/8" placeholder={placeholder} /></label>;
}

export default function DiagnosticPage() {
  const diagnostic = useDiagnostic();
  const reduce = useReducedMotion();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  usePageMeta("Diagnostic de création", "Décrivez votre projet et obtenez une orientation indicative vers les structures à comparer.");

  useEffect(() => { if (diagnostic.stepIndex === 0) analytics.track("diagnostic_started", { path: window.location.pathname }); }, [diagnostic.stepIndex]);

  function togglePriority(value: string) {
    const priorities = diagnostic.answers.priorities ?? [];
    diagnostic.update("priorities", priorities.includes(value) ? priorities.filter((item) => item !== value) : [...priorities, value]);
  }

  async function submit() {
    setSubmitting(true); setError(null);
    try {
      await leadRepository.submit(diagnostic.answers);
      analytics.track("lead_submitted", { stage: diagnostic.answers.stage, timeline: diagnostic.answers.timeline, forms: diagnostic.recommendation.forms });
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le projet n'a pas pu être enregistré.");
    } finally { setSubmitting(false); }
  }

  const stepTitles: Record<string, [string, string]> = {
    stage: ["Où en êtes-vous aujourd'hui ?", "Le parcours s'adapte à votre niveau de maturité, pas seulement à un statut juridique."],
    founders: ["Qui porte le projet ?", "Le nombre d'associés change la gouvernance, les documents et les structures à comparer."],
    situation: ["Quelle est votre situation actuelle ?", "Elle nous aide à distinguer création, transition et activité déjà existante."],
    activity: ["Quelle activité allez-vous exercer ?", "Le secteur permet d'anticiper des besoins, contraintes ou questions complémentaires."],
    priorities: ["Quels critères sont prioritaires pour votre projet ?", "Vous pouvez sélectionner plusieurs critères. Ils servent à expliquer l'orientation et ne constituent pas une optimisation automatique."],
    timeline: ["Quand souhaitez-vous avancer ?", "Le calendrier détermine si la prochaine étape doit être un dossier, une feuille de route ou un échange."],
    result: ["Votre orientation initiale est prête.", "Voici les structures à comparer et les sujets qui doivent encore être validés."],
    contact: ["Comment souhaitez-vous poursuivre ?", "Enregistrez le résultat pour réserver un échange ou commencer le dossier."],
  };
  const [title, description] = stepTitles[diagnostic.step] ?? stepTitles.stage!;

  if (submitted) {
    return (
      <section className="relative min-h-[820px] overflow-hidden pb-24 pt-36 sm:pt-44"><div className="absolute inset-0 grid-fade opacity-60" /><div className="container-shell relative"><Card className="mx-auto max-w-3xl overflow-hidden p-0 text-center"><div className="relative overflow-hidden bg-[var(--ink)] px-7 py-12 text-white sm:px-12 sm:py-16"><div className="absolute inset-0 hero-grid opacity-45" /><span className="relative mx-auto grid size-17 place-items-center rounded-[22px] bg-[var(--mint)] text-[color:var(--ink)] shadow-[0_18px_48px_rgba(70,214,166,.22)]"><Check className="size-7" /></span><Badge className="relative mt-7 border-white/12 bg-white/7 text-white/72">Diagnostic terminé</Badge><h1 className="relative mt-5 text-balance text-4xl font-semibold leading-[1] tracking-[-.06em] sm:text-6xl">Votre prochaine étape est définie.</h1><p className="relative mx-auto mt-5 max-w-xl text-base leading-8 text-white/72">Cette démonstration ne transmet aucune donnée personnelle à un service externe. Dans la version connectée, l'enregistrement sera effectué par une fonction serveur sécurisée.</p></div><div className="p-7 sm:p-10"><div className="grid gap-3 sm:grid-cols-2"><ButtonLink to="/rendez-vous" size="lg" variant="accent" arrow>Réserver un échange</ButtonLink><ButtonLink to="/inscription" variant="secondary" size="lg">Créer mon espace</ButtonLink></div><button onClick={() => { setSubmitted(false); diagnostic.reset(); }} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[color:var(--muted)] transition hover:text-[color:var(--ink)]"><RotateCcw className="size-4" />Recommencer le diagnostic</button></div></Card></div></section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden pb-24 pt-28 sm:pt-34 lg:pt-36">
      <div className="absolute inset-0 grid-fade opacity-60" /><div className="absolute -left-44 top-10 size-[34rem] rounded-full bg-[var(--accent)]/8 blur-[90px]" /><div className="absolute -right-32 top-1/3 size-[30rem] rounded-full bg-[var(--mint)]/10 blur-[90px]" />
      <div className="container-wide relative">
        <div className="mb-5 flex gap-2 overflow-x-auto pb-2 lg:hidden">{stepLabels.map((label, index) => <div key={label} className={cn("flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-extrabold uppercase tracking-[.08em]", index === diagnostic.stepIndex ? "border-[var(--ink)] bg-[var(--ink)] text-white" : index < diagnostic.stepIndex ? "border-[var(--mint)]/30 bg-[var(--mint-soft)] text-[color:var(--ink)]" : "border-[var(--line)] bg-white/60 text-[color:var(--muted)]")}><span className="grid size-5 place-items-center rounded-full bg-white/10">{index < diagnostic.stepIndex ? <Check className="size-3" /> : index + 1}</span>{label}</div>)}</div>
        <div className="grid gap-5 lg:grid-cols-[290px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_270px]">
          <aside className="hidden lg:block">
            <div className="sticky top-26 overflow-hidden rounded-[32px] bg-[var(--ink)] p-5 text-white shadow-[0_35px_100px_rgba(11,18,32,.2)] xl:p-6">
              <div className="absolute -right-20 -top-20 size-56 rounded-full bg-[var(--accent)]/25 blur-3xl" />
              <div className="relative"><Badge className="border-white/10 bg-white/7 text-white/72">Diagnostic · {diagnostic.progress}%</Badge><h2 className="mt-5 text-2xl font-semibold leading-[1.05] tracking-[-.045em]">Votre projet en 8 étapes courtes.</h2><div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/7"><motion.div className="h-full rounded-full bg-[linear-gradient(90deg,var(--mint),var(--sky),var(--accent))]" animate={{ width: `${diagnostic.progress}%` }} transition={{ duration: .35 }} /></div><ol className="mt-6 space-y-1">{stepLabels.map((label, index) => <li key={label} className={cn("flex items-center gap-3 rounded-[15px] px-3 py-2.5 text-xs font-bold transition", index === diagnostic.stepIndex ? "bg-white/9 text-white" : index < diagnostic.stepIndex ? "text-white/68" : "text-white/72")}><span className={cn("grid size-6 place-items-center rounded-full text-[9px] font-extrabold", index < diagnostic.stepIndex ? "bg-[var(--mint)] text-[color:var(--ink)]" : index === diagnostic.stepIndex ? "bg-[var(--accent)] text-white" : "bg-white/6")}>{index < diagnostic.stepIndex ? <Check className="size-3" /> : index + 1}</span>{label}{index === diagnostic.stepIndex ? <span className="ml-auto size-1.5 rounded-full bg-[var(--mint)]" /> : null}</li>)}</ol><div className="mt-6 rounded-[20px] border border-white/8 bg-white/[.04] p-4"><div className="flex gap-3"><LockKeyhole className="mt-0.5 size-4.5 shrink-0 text-[color:var(--mint)]" /><div><p className="text-xs font-extrabold">Sauvegarde locale</p><p className="mt-1 text-[11px] leading-5 text-white/72">Les réponses non sensibles sont conservées sur cet appareil. Aucun document n'est stocké ici.</p></div></div></div></div>
            </div>
          </aside>

          <Card className="overflow-hidden border-white/75 bg-white/78">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] bg-white/50 p-4 sm:px-7 sm:py-5"><div><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[color:var(--muted)]">Étape {diagnostic.stepIndex + 1} sur 8</p><div className="mt-2.5 h-1.5 w-40 overflow-hidden rounded-full bg-[var(--ink)]/7 lg:hidden"><motion.div className="h-full rounded-full bg-[linear-gradient(90deg,var(--mint),var(--accent))]" animate={{ width: `${diagnostic.progress}%` }} /></div></div><button onClick={diagnostic.reset} className="group inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-3 py-2 text-[10px] font-extrabold uppercase tracking-[.08em] text-[color:var(--muted)] transition hover:border-[var(--ink)]/20 hover:text-[color:var(--ink)]"><RotateCcw className="size-3.5 transition group-hover:-rotate-90" />Réinitialiser</button></div>
            <div className="min-h-[520px] p-5 sm:p-8 lg:p-10 xl:p-12">
              <AnimatePresence mode="wait"><motion.div key={diagnostic.step} initial={reduce ? false : { opacity: 0, x: 22, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={reduce ? undefined : { opacity: 0, x: -18, filter: "blur(4px)" }} transition={{ duration: .32 }}><Badge className="mb-5"><Sparkles className="size-3.5 text-[color:var(--accent)]" />Parcours adaptatif</Badge><h1 className="max-w-4xl text-balance text-3xl font-semibold leading-[1] tracking-[-.055em] sm:text-4xl lg:text-5xl xl:text-6xl">{title}</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">{description}</p><div className="mt-8 lg:mt-10">
                {diagnostic.step === "stage" ? <ChoiceGrid choices={stageChoices} value={diagnostic.answers.stage} onSelect={(value) => diagnostic.update("stage", value as never)} /> : null}
                {diagnostic.step === "founders" ? <ChoiceGrid choices={founderChoices} value={diagnostic.answers.founderMode} onSelect={(value) => diagnostic.update("founderMode", value as never)} /> : null}
                {diagnostic.step === "situation" ? <div className="space-y-9"><div><p className="mb-3 text-sm font-extrabold">Votre situation professionnelle</p><ChoiceGrid choices={professionalChoices} value={diagnostic.answers.professionalStatus} onSelect={(value) => diagnostic.update("professionalStatus", value as never)} /></div><div><p className="mb-3 text-sm font-extrabold">Exercez-vous déjà avec une structure ?</p><ChoiceGrid choices={structureChoices} value={diagnostic.answers.currentStructure} onSelect={(value) => diagnostic.update("currentStructure", value as never)} /></div></div> : null}
                {diagnostic.step === "activity" ? <div><ChoiceGrid choices={activityChoices} value={diagnostic.answers.activity} onSelect={(value) => diagnostic.update("activity", value)} /><label className="mt-5 flex cursor-pointer items-center gap-3 rounded-[22px] border border-[var(--line)] bg-[var(--paper-soft)] p-4 transition hover:bg-white"><input type="checkbox" checked={diagnostic.answers.existingClients ?? false} onChange={(event) => diagnostic.update("existingClients", event.target.checked)} className="size-5 accent-[var(--ink)]" /><span><strong className="block text-sm">J'ai déjà des clients ou des premières ventes</strong><span className="mt-1 block text-xs text-[color:var(--muted)]">Cette information aide à qualifier le niveau de maturité.</span></span></label></div> : null}
                {diagnostic.step === "priorities" ? <><ChoiceGrid multiple choices={priorityChoices} values={diagnostic.answers.priorities} onSelect={togglePriority} /><p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[color:var(--muted)]"><Sparkles className="size-3.5 text-[color:var(--accent)]" />Vous pouvez sélectionner plusieurs éléments.</p></> : null}
                {diagnostic.step === "timeline" ? <div className="space-y-7"><ChoiceGrid choices={timelineChoices} value={diagnostic.answers.timeline} onSelect={(value) => diagnostic.update("timeline", value as never)} /><div className="rounded-[24px] border border-[var(--line)] bg-[var(--paper-soft)] p-5"><TextInput label="Département principal du projet" value={diagnostic.answers.department ?? ""} onChange={(value) => diagnostic.update("department", value)} placeholder="Ex. 34 — Hérault" /></div></div> : null}
                {diagnostic.step === "result" ? <div><div className="relative overflow-hidden rounded-[30px] bg-[var(--ink)] p-6 text-white sm:p-8"><div className="absolute -right-20 -top-24 size-72 rounded-full bg-[var(--accent)]/28 blur-3xl" /><div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-white/72">Orientation indicative</p><h2 className="mt-3 text-2xl font-semibold leading-tight tracking-[-.045em] sm:text-4xl">{diagnostic.recommendation.title}</h2></div><span className="w-fit rounded-full bg-[var(--mint)] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.08em] text-[color:var(--ink)]">Complexité {diagnostic.recommendation.complexity}</span></div><div className="relative mt-6 flex flex-wrap gap-2">{diagnostic.recommendation.forms.map((code) => <span key={code} className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-extrabold">{getLegalForm(code)?.label ?? code}</span>)}</div><p className="relative mt-6 text-sm leading-7 text-white/72">{diagnostic.recommendation.explanation}</p></div><div className="mt-4 grid gap-4 lg:grid-cols-2"><div className="rounded-[25px] border border-[var(--line)] bg-white p-5 sm:p-6"><p className="text-sm font-extrabold">Pourquoi ces pistes ?</p><ul className="mt-4 space-y-3">{diagnostic.recommendation.reasons.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[color:var(--muted)]"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--mint-soft)]"><Check className="size-3 text-[color:var(--success)]" /></span>{item}</li>)}</ul></div><div className="rounded-[25px] border border-[var(--blue)]/20 bg-[var(--blue)]/8 p-5 sm:p-6"><p className="flex items-center gap-2 text-sm font-extrabold text-[color:var(--ink)]"><CircleAlert className="size-4" />Points à valider</p><ul className="mt-4 space-y-3">{diagnostic.recommendation.pointsToValidate.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[color:var(--ink)]/70"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--blue)]/80" />{item}</li>)}</ul></div></div></div> : null}
                {diagnostic.step === "contact" ? <div><div className="grid gap-4 sm:grid-cols-2"><TextInput label="Prénom" value={diagnostic.answers.firstName ?? ""} onChange={(value) => diagnostic.update("firstName", value)} placeholder="Votre prénom" /><TextInput label="Nom" value={diagnostic.answers.lastName ?? ""} onChange={(value) => diagnostic.update("lastName", value)} placeholder="Votre nom" /><TextInput type="email" label="Email" value={diagnostic.answers.email ?? ""} onChange={(value) => diagnostic.update("email", value)} placeholder="vous@exemple.fr" /><TextInput type="tel" label="Téléphone" value={diagnostic.answers.phone ?? ""} onChange={(value) => diagnostic.update("phone", value)} placeholder="06 00 00 00 00" /></div><div className="mt-5 flex gap-3 rounded-[22px] border border-[var(--line)] bg-[var(--paper-soft)] p-4"><ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-[color:var(--accent)]" /><p className="text-xs leading-5 text-[color:var(--muted)]">Ces informations servent à enregistrer votre demande et à vous recontacter au sujet du projet. Le consentement marketing doit rester séparé et facultatif.</p></div>{error ? <div className="mt-4 rounded-[18px] bg-[var(--blue)]/8 p-4 text-sm font-bold text-[color:var(--blue)]">{error}</div> : null}</div> : null}
              </div></motion.div></AnimatePresence>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] bg-white/55 p-4 sm:px-8 sm:py-5"><Button onClick={diagnostic.previous} disabled={diagnostic.stepIndex === 0} variant="ghost"><ArrowLeft className="size-4" />Retour</Button><div className="hidden items-center gap-2 text-[10px] font-bold text-[color:var(--muted)] sm:flex"><Clock3 className="size-3.5" />Progression sauvegardée</div>{diagnostic.step === "contact" ? <Button variant="accent" onClick={() => void submit()} disabled={!diagnostic.canContinue || submitting}>{submitting ? <LoaderCircle className="size-4 animate-spin" /> : null}Enregistrer mon projet</Button> : <Button variant="accent" onClick={() => { analytics.track("diagnostic_step_completed", { step: diagnostic.step, index: diagnostic.stepIndex }); diagnostic.next(); }} disabled={!diagnostic.canContinue}>{diagnostic.step === "result" ? "Continuer" : "Étape suivante"}<ArrowRight className="size-4" /></Button>}</div>
          </Card>
          <ProjectPulse diagnostic={diagnostic} />
        </div>
      </div>
    </section>
  );
}
