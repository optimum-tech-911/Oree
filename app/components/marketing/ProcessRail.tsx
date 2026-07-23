import { useEffect, useState } from "react";
import { Check, FileCheck2, Fingerprint, Landmark, Scale, Send } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { ArtDirectedPicture } from "@/components/media/ArtDirectedPicture";
import { imagery } from "@/content/imagery";

const process = [
  { icon: Fingerprint, title: "Diagnostic", description: "Votre situation, votre activité, les porteurs et le calendrier sont réunis sans vous imposer un statut trop tôt.", output: "Projet structuré" },
  { icon: Scale, title: "Orientation", description: "Les formes pertinentes sont comparées avec leurs différences et les sujets qui nécessitent une validation humaine.", output: "Pistes expliquées" },
  { icon: FileCheck2, title: "Dossier", description: "Les informations et justificatifs sont demandés au bon moment, avec un état visible pour chaque élément.", output: "Pièces centralisées" },
  { icon: Landmark, title: "Capital & signatures", description: "Les étapes spécifiques à votre structure s'activent uniquement lorsqu'elles sont nécessaires.", output: "Décisions tracées" },
  { icon: Send, title: "Formalité", description: "Le dossier préparé peut être transmis puis suivi sans perdre les échanges, versions ou corrections.", output: "Transmission suivie" },
  { icon: Check, title: "Immatriculation", description: "Les éléments officiels sont rattachés au projet et restent accessibles dans le même espace.", output: "Projet finalisé" },
];

export function ProcessRail() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % process.length), 4200);
    return () => window.clearInterval(timer);
  }, [reduce]);

  const selected = process[active]!;
  const Icon = selected.icon;

  return (
    <div className="grid gap-5 lg:grid-cols-[.76fr_1.24fr]">
      <div className="route-map relative overflow-hidden rounded-[34px] border border-[var(--line)] p-6 sm:p-8 lg:min-h-[500px] lg:p-10">
        <div className="absolute inset-x-0 top-0 h-52 overflow-hidden sm:h-60 lg:h-[46%]">
          <ArtDirectedPicture asset={imagery.projectOrganisation} sizes="(max-width: 1023px) 100vw, 42vw" className="size-full" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,32,.08),rgba(11,18,32,.12)_45%,var(--canvas)_100%)]" />
          <span className="absolute left-5 top-5 rounded-full bg-[var(--ink)]/86 px-3 py-2 text-[9px] font-semibold tracking-[.04em] text-white">Situation illustrative · contrôle documentaire</span>
        </div>
        <div className="absolute right-6 top-5 z-10 rounded-full border border-white/20 bg-[var(--canvas)]/92 px-3 py-2 text-[10px] font-semibold text-[color:var(--ink)] shadow-sm backdrop-blur-md sm:right-8">0{active + 1} / 06</div>
        <motion.div key={selected.title} initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }} className="relative flex h-full flex-col pt-44 sm:pt-52 lg:pt-44">
          <span className="grid size-16 place-items-center rounded-[22px] bg-[var(--ink)] text-[color:var(--mint)] shadow-[0_18px_48px_rgba(11,18,32,.18)]"><Icon className="size-6" /></span>
          <div className="mt-auto pt-8 lg:pt-10">
            <p className="text-[10px] font-semibold tracking-[.04em] text-[color:var(--action)]">{selected.output}</p>
            <h3 className="mt-4 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">{selected.title}</h3>
            <p className="mt-5 max-w-xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">{selected.description}</p>
          </div>
        </motion.div>
        <div className="pointer-events-none absolute bottom-8 right-8 hidden size-24 rounded-full border border-[var(--blue)]/12 lg:block"><div className="absolute inset-3 rounded-full border border-[var(--blue)]/12" /><motion.div className="absolute inset-0 rounded-full border-t border-[var(--blue)]" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} /></div>
      </div>

      <div className="relative rounded-[34px] bg-[var(--ink)] p-3 text-white shadow-[0_32px_100px_rgba(11,18,32,.2)] sm:p-4">
        <div className="absolute bottom-9 left-[38px] top-9 w-px bg-white/8 sm:left-[45px]" />
        <div className="grid gap-1.5">
          {process.map((item, index) => {
            const StepIcon = item.icon;
            const isActive = active === index;
            const isPast = index < active;
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => setActive(index)}
                className={cn("group relative flex items-center gap-4 rounded-[23px] border p-3.5 text-left transition duration-300 sm:p-4", isActive ? "border-[var(--blue)]/52 bg-[var(--blue)]/14" : "border-transparent hover:border-white/8 hover:bg-white/[.035]")}
              >
                <span className={cn("relative z-10 grid size-12 shrink-0 place-items-center rounded-[17px] border transition", isPast ? "border-[var(--mint)] bg-[var(--mint)] text-[color:var(--ink)]" : isActive ? "border-[var(--blue)] bg-[var(--blue)] text-white" : "border-white/10 bg-[var(--ink)] text-white/72 group-hover:text-white/65")}>{isPast ? <Check className="size-5" /> : <StepIcon className="size-5" />}</span>
                <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-4"><h3 className={cn("font-extrabold tracking-[-.025em]", isActive ? "text-white" : "text-white/68")}>{item.title}</h3><span className={cn("text-[9px] font-extrabold uppercase tracking-[.13em]", isActive ? "text-[color:var(--mint)]" : "text-white/72")}>Étape 0{index + 1}</span></div><p className="mt-1 line-clamp-1 text-xs text-white/72">{item.output}</p></div>
                {isActive ? <motion.span layoutId="process-active" className="absolute right-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-l-full bg-[var(--mint)]" /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
