import { motion, useReducedMotion } from "motion/react";
import { Landmark } from "lucide-react";

const ecosystemItems = [
  { name: "INPI et République française", src: "/assets/ecosystem/inpi-republique-francaise.webp" },
  { name: "URSSAF", src: "/assets/ecosystem/urssaf.webp" },
  { name: "INSEE", src: "/assets/ecosystem/insee.webp" },
  { name: "Infogreffe", src: "/assets/ecosystem/infogreffe.webp" },
  { name: "Greffiers des tribunaux de commerce", src: "/assets/ecosystem/greffiers-tribunaux-commerce.webp" },
  { name: "Direction générale des Finances publiques", src: "/assets/ecosystem/dgfip.webp" },
  { name: "CMA France", src: "/assets/ecosystem/cma-france.webp" },
  { name: "Crédit Agricole", src: "/assets/ecosystem/credit-agricole.webp" },
  { name: "Crédit Mutuel", src: "/assets/ecosystem/credit-mutuel.webp" },
  { name: "Bpifrance", src: "/assets/ecosystem/bpifrance.webp" },
];

function RailSequence({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="ecosystem-sequence" aria-hidden={hidden || undefined} role={hidden ? undefined : "list"}>
      {ecosystemItems.map((item) => (
        <span key={item.name} className="ecosystem-item" role={hidden ? undefined : "listitem"}>
          <img src={item.src} alt={hidden ? "" : item.name} width="180" height="58" loading="lazy" className="ecosystem-logo" />
        </span>
      ))}
    </div>
  );
}

export function EcosystemRail() {
  const reduce = useReducedMotion();

  return (
    <motion.section
      className="ecosystem-rail border-y border-[var(--line)] bg-[var(--canvas)]"
      aria-labelledby="ecosystem-title"
      data-ecosystem-rail
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container-shell py-10 sm:py-12">
        <div className="grid gap-4 lg:grid-cols-[.72fr_1.28fr] lg:items-end lg:gap-12">
          <h2 id="ecosystem-title" className="max-w-2xl text-balance text-2xl font-semibold leading-tight tracking-[-.035em] sm:text-3xl">
            Les organismes et prestataires qui peuvent jalonner une création
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
            Leur rôle varie selon la structure, l'activité et les choix du projet. Cette vue situe les interlocuteurs possibles sans laisser entendre qu'ils sont tous obligatoires ou partenaires d'ORÉE.
          </p>
        </div>

        <div className="mt-8 hidden min-h-[82px] grid-cols-[215px_minmax(0,1fr)] items-stretch border-y border-[var(--line)] md:grid">
          <div className="relative z-10 flex items-center gap-3 border-r border-[var(--line)] bg-[var(--canvas)] pr-5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-[color:var(--mint)]"><Landmark className="size-4" /></span>
            <span className="text-[10px] font-semibold uppercase leading-4 tracking-[.14em] text-[color:var(--ink)]">Interlocuteurs<br />possibles</span>
          </div>
          <div className="ecosystem-viewport mask-fade-x" tabIndex={0} aria-label="Organismes susceptibles d'intervenir dans le parcours. Survolez ou sélectionnez cette zone pour suspendre le défilement.">
            <div className="ecosystem-track">
              <RailSequence />
              <RailSequence hidden />
            </div>
          </div>
        </div>

        <div className="mt-8 md:hidden" data-ecosystem-mobile>
          <div className="grid grid-cols-2 border-l border-t border-[var(--line)]" role="list">
            {ecosystemItems.map((item) => (
              <div key={item.name} role="listitem" className="grid min-h-28 place-items-center border-b border-r border-[var(--line)] bg-white p-4">
                <img src={item.src} alt={item.name} width="180" height="58" loading="lazy" className="max-h-14 w-full object-contain mix-blend-multiply" />
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] leading-5 text-[color:var(--muted)]">Les organismes et interlocuteurs concernés varient selon votre activité, votre structure et votre dossier.</p>
        </div>
        <p className="mt-4 text-[10px] leading-5 text-[color:var(--muted)]">Logos et marques cités à titre informatif pour situer l'écosystème de la création d'entreprise. Leur présence ne constitue pas l'affirmation d'un partenariat commercial avec Orée.</p>
      </div>
    </motion.section>
  );
}
