import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Hammer, Store, Truck, Utensils, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ArtDirectedPicture } from "@/components/media/ArtDirectedPicture";
import { imagery, type ImageryAsset } from "@/content/imagery";
import { cn } from "@/lib/cn";

type Activity = {
  id: string;
  label: string;
  description: string;
  asset: ImageryAsset;
  icon: typeof Hammer;
};

const activities: Activity[] = [
  { id: "artisan", label: "Artisanat", description: "Un atelier, des commandes, des achats et une activité à faire grandir.", asset: imagery.artisanActivity, icon: Hammer },
  { id: "commerce", label: "Commerce", description: "Une clientèle, un lieu de vente et un quotidien qui laisse peu de place à l'administratif.", asset: imagery.localShopActivity, icon: Store },
  { id: "service", label: "Services terrain", description: "Une activité mobile, du matériel et des journées organisées autour des interventions.", asset: imagery.fieldServiceActivity, icon: Wrench },
  { id: "restauration", label: "Restauration", description: "Un rythme soutenu, une équipe et des décisions à rendre lisibles avant de se lancer.", asset: imagery.restaurantActivity, icon: Utensils },
  { id: "logistique", label: "Logistique", description: "Des tournées, des contrats et une organisation déjà très concrète.", asset: imagery.logisticsActivity, icon: Truck },
];

export function ActivitySpotlight() {
  const [activeId, setActiveId] = useState(activities[0]!.id);
  const reduce = useReducedMotion();
  const active = activities.find((activity) => activity.id === activeId) ?? activities[0]!;

  return (
    <div data-activity-spotlight className="grid items-stretch gap-5 lg:grid-cols-[.78fr_1.22fr]">
      <div className="rounded-[30px] border border-[var(--line)] bg-white p-6 shadow-[0_18px_58px_rgba(11,18,32,.06)] sm:p-8">
        <Badge>Des réalités concrètes</Badge>
        <h2 className="mt-5 text-balance text-4xl font-semibold leading-[1] tracking-[-.05em] sm:text-5xl">Votre activité ne ressemble pas à <span className="editorial-mark text-[color:var(--blue)]">un modèle unique.</span></h2>
        <p className="mt-5 max-w-xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">Le point de départ peut être un atelier, un magasin, une tournée, un restaurant ou un projet construit à côté de votre quotidien. Le diagnostic s'adapte à cette réalité.</p>

        <div className="mt-7 grid gap-2 sm:grid-cols-2 lg:grid-cols-1" role="list" aria-label="Exemples de réalités professionnelles">
          {activities.map((activity) => {
            const Icon = activity.icon;
            const selected = activity.id === active.id;
            return (
              <div key={activity.id} role="listitem">
                <button type="button" aria-pressed={selected} onClick={() => setActiveId(activity.id)} className={cn("group flex min-h-15 w-full items-center gap-3 rounded-[18px] border p-3 text-left transition duration-300", selected ? "border-[var(--action)] bg-[var(--action)] text-white shadow-[0_10px_28px_rgba(36,87,255,.16)]" : "border-transparent bg-[var(--paper)] hover:border-[var(--line-strong)] hover:bg-white")}>
                  <span className={cn("grid size-10 shrink-0 place-items-center rounded-[13px] transition", selected ? "bg-white text-[color:var(--ink)]" : "bg-[var(--mint-soft)] text-[color:var(--ink)]")}><Icon className="size-4" /></span>
                  <span className="min-w-0"><span className="block text-sm font-semibold tracking-[-.02em]">{activity.label}</span><span className={cn("mt-0.5 block line-clamp-1 text-[11px] leading-4", selected ? "text-white/72" : "text-[color:var(--muted)]")}>{activity.description}</span></span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative min-h-[430px] overflow-hidden rounded-[30px] bg-[var(--ink)] shadow-[0_28px_86px_rgba(11,18,32,.18)] sm:min-h-[520px]">
        <AnimatePresence mode="wait">
          <motion.figure key={active.id} initial={reduce ? false : { opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} exit={reduce ? undefined : { opacity: 0, scale: .99 }} transition={{ duration: .48, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0">
            <ArtDirectedPicture asset={active.asset} sizes="(max-width: 1023px) 100vw, 56vw" className="size-full" imageClassName="size-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,32,.02)_30%,rgba(11,18,32,.88)_100%)]" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7"><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[color:var(--mint)]">Situation illustrative</p><h3 className="mt-2 text-3xl font-semibold tracking-[-.045em] sm:text-4xl">{active.label}</h3><p className="mt-3 max-w-lg text-sm leading-6 text-white/78">{active.description}</p></figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
    </div>
  );
}
