import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, FileText, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";

const steps = [
  { label: "Projet", detail: "Activité, porteurs et calendrier", meta: "Complet" },
  { label: "Orientation", detail: "SASU et EURL à comparer", meta: "En cours" },
  { label: "Informations", detail: "8 éléments sur 11 renseignés", meta: "73%" },
  { label: "Documents", detail: "3 pièces seront demandées", meta: "À venir" },
];

const insights = [
  { title: "Point à valider", copy: "Le mode de rémunération peut modifier la comparaison entre SASU et EURL." },
  { title: "Prochaine action", copy: "Précisez si vous conservez une activité salariée au lancement." },
  { title: "Dossier anticipé", copy: "Aucun document sensible n'est nécessaire pour commencer le diagnostic." },
  { title: "Accompagnement", copy: "Un conseiller peut reprendre exactement là où vous vous êtes arrêté." },
];

export function HeroCockpit() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(1);

  return (
    <div className="relative mx-auto w-full max-w-[660px] lg:translate-x-3">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 34, rotateY: -8, rotateX: 3 }}
        animate={{ opacity: 1, y: 0, rotateY: 0, rotateX: 0 }}
        transition={{ duration: .95, delay: .14, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 overflow-hidden rounded-[34px] border border-white/12 bg-white/[.045] p-2.5 shadow-[0_58px_160px_rgba(11,18,32,.42)] backdrop-blur-2xl sm:p-3.5 lg:rounded-[42px]"
      >
        <div className="relative overflow-hidden rounded-[27px] border border-white/8 bg-[var(--ink)] p-4 sm:p-5 lg:rounded-[34px] lg:p-6">
          <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-55" />
          <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-[var(--blue)]/24 blur-[80px]" />

          <div className="relative flex items-center justify-between border-b border-white/8 pb-4">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-[15px] bg-[var(--mint)] text-[color:var(--ink)]"><Sparkles className="size-4.5" /></span>
              <div><p className="text-[9px] font-extrabold uppercase tracking-[.18em] text-white/72">Dossier de création</p><p className="mt-1 text-sm font-extrabold text-white sm:text-base">Studio Horizon</p></div>
            </div>
            <div className="text-right"><p className="text-[9px] font-extrabold uppercase tracking-[.16em] text-white/72">Progression</p><p className="mt-1 text-lg font-extrabold tracking-[-.04em] text-[color:var(--mint)]">64%</p></div>
          </div>

          <div className="relative mt-5 grid gap-3 lg:grid-cols-[1.08fr_.92fr]">
            <div className="relative rounded-[24px] border border-white/8 bg-white/[.035] p-3">
              <div className="absolute bottom-8 left-[29px] top-8 w-px bg-white/9" />
              <div className="space-y-2">
                {steps.map((step, index) => {
                  const selected = active === index;
                  const complete = index < active;
                  return (
                    <button
                      type="button"
                      key={step.label}
                      onClick={() => setActive(index)}
                      className={`group relative flex w-full items-center gap-3 rounded-[18px] border p-3 text-left transition duration-300 ${selected ? "border-[var(--blue)]/55 bg-[var(--blue)]/15" : "border-transparent hover:border-white/8 hover:bg-white/[.035]"}`}
                    >
                      <span className={`relative z-10 grid size-9 shrink-0 place-items-center rounded-full border text-[10px] font-extrabold transition ${complete ? "border-[var(--mint)] bg-[var(--mint)] text-[color:var(--ink)]" : selected ? "border-[var(--blue)] bg-[var(--blue)] text-white" : "border-white/12 bg-[var(--ink)] text-white/72"}`}>
                        {complete ? <Check className="size-4" /> : `0${index + 1}`}
                      </span>
                      <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="text-xs font-extrabold text-white sm:text-sm">{step.label}</p><span className={`text-[9px] font-extrabold uppercase tracking-[.1em] ${selected ? "text-[color:var(--mint)]" : "text-white/72"}`}>{step.meta}</span></div><p className="mt-1 truncate text-[10px] text-white/72 sm:text-[11px]">{step.detail}</p></div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex min-h-[278px] flex-col gap-3">
              <div className="relative flex-1 overflow-hidden rounded-[24px] border border-white/8 bg-white/[.045] p-5 pb-17">
                <div className="absolute inset-x-5 top-0 h-px kinetic-line bg-white/8" />
                <div className="flex items-center justify-between"><span className="text-[9px] font-extrabold uppercase tracking-[.16em] text-white/72">Lecture du projet</span><ShieldCheck className="size-4 text-[color:var(--mint)]" /></div>
                <AnimatePresence mode="wait">
                  <motion.div key={active} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -8 }} transition={{ duration: .28 }} className="mt-5">
                    <span className="inline-flex rounded-full border border-[var(--blue)]/28 bg-[var(--blue)]/12 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.12em] text-white/66">{insights[active]?.title}</span>
                    <p className="mt-4 text-balance text-lg font-extrabold leading-[1.18] tracking-[-.04em] text-white sm:text-xl">{insights[active]?.copy}</p>
                  </motion.div>
                </AnimatePresence>
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-t border-white/8 pt-4"><span className="text-[10px] text-white/72">Orientation indicative</span><ArrowUpRight className="size-4 text-white/72" /></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[20px] border border-white/8 bg-white/[.035] p-4"><FileText className="size-4 text-[color:var(--mint)]" /><p className="mt-4 text-xl font-extrabold tracking-[-.045em] text-white">3 / 6</p><p className="mt-1 text-[9px] uppercase tracking-[.12em] text-white/72">Pièces prévues</p></div>
                <div className="rounded-[20px] border border-white/8 bg-white/[.035] p-4"><MessageSquareText className="size-4 text-[color:var(--blue)]" /><p className="mt-4 text-xl font-extrabold tracking-[-.045em] text-white">Au besoin</p><p className="mt-1 text-[9px] uppercase tracking-[.12em] text-white/72">Relais humain demandé</p></div>
              </div>
            </div>
          </div>

          <div className="relative mt-3 flex items-center justify-between rounded-[18px] border border-white/8 bg-white/[.035] px-4 py-3"><div className="flex items-center gap-2"><span className="relative size-2 rounded-full bg-[var(--mint)]"><span className="assistant-pulse" /></span><span className="text-[10px] font-bold text-white/72">Guide Orée prêt à répondre sur cette étape</span></div><span className="hidden text-[9px] uppercase tracking-[.12em] text-white/72 sm:inline">⌘ K</span></div>
        </div>
      </motion.div>

      <motion.div initial={reduce ? false : { opacity: 0, x: -20, y: 18 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: .72, delay: .72 }} className="absolute -bottom-8 -left-4 z-20 hidden w-[250px] rounded-[22px] border border-[var(--line)] bg-white p-4 text-[color:var(--ink)] shadow-[0_24px_70px_rgba(11,18,32,.18)] sm:block lg:-left-10">
        <div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--mint)] text-[color:var(--ink)]"><Check className="size-4" /></span><div><p className="text-xs font-extrabold">Aucune décision masquée</p><p className="mt-1 text-[10px] leading-4 text-[color:var(--muted)]">Les points à confirmer restent visibles dans le parcours.</p></div></div>
      </motion.div>
    </div>
  );
}
