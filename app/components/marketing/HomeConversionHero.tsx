import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, MessageCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { HeroCockpit } from "@/components/marketing/HeroCockpit";
import { ArtDirectedPicture } from "@/components/media/ArtDirectedPicture";
import { imagery } from "@/content/imagery";
import { analytics } from "@/services/analytics";

const reassurance = [
  "Une première orientation avant de créer un compte",
  "Honoraires, frais légaux et options présentés séparément",
  "Aucun document sensible nécessaire pour commencer",
];

export function HomeConversionHero() {
  const reduce = useReducedMotion();

  return (
    <section data-home-conversion-hero className="hero-grid relative overflow-hidden bg-[var(--ink)] pb-14 pt-32 text-white sm:pb-20 sm:pt-38 lg:min-h-[780px] lg:pb-24 lg:pt-40">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[68%] lg:block" aria-hidden="true">
        <ArtDirectedPicture asset={imagery.homeHero} sizes="68vw" className="size-full opacity-70" imageClassName="object-[78%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--ink)_0%,rgba(11,18,32,.88)_22%,rgba(11,18,32,.28)_68%,rgba(11,18,32,.62)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,32,.18)_0%,transparent_38%,rgba(11,18,32,.9)_100%)]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_16%,rgba(36,87,255,.2),transparent_30%),radial-gradient(circle_at_84%_70%,rgba(70,214,166,.1),transparent_28%)]" />
      <div className="container-shell relative grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
        <div className="max-w-3xl">
          <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="border-white/12 bg-white/[.06] text-white/72">
              <Sparkles className="size-3.5 text-[color:var(--mint)]" />SASU · EURL · SAS · SARL
            </Badge>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .06, duration: .72, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-balance text-[clamp(2.65rem,5.25vw,6.1rem)] font-semibold leading-[.94] tracking-[-.06em]"
          >
            Créez votre société avec un parcours <span className="editorial-mark text-[color:var(--mint)]">clair et piloté.</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .15, duration: .58 }}
            className="mt-6 max-w-2xl text-pretty text-base leading-7 text-white/72 sm:text-lg sm:leading-8"
          >
            ORÉE relie votre situation à une orientation indicative, un dossier organisé et une prochaine action visible — sans vous demander de choisir un statut au hasard.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .22, duration: .58 }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <ButtonLink
              to="/diagnostic"
              onClick={() => analytics.track("primary_cta_clicked", { path: "/", location: "hero", intent: "general_orientation" })}
              variant="dark"
              size="lg"
              className="w-full sm:w-auto"
              data-primary-cta
              arrow
            >
              Faire le diagnostic
            </ButtonLink>
            <ButtonLink to="/comment-ca-marche" variant="ghost" size="lg" className="hidden border border-white/14 text-white hover:bg-white/[.08] sm:inline-flex">
              Voir le parcours
            </ButtonLink>
            <a href="#contact" onClick={() => analytics.track("primary_cta_clicked", { path: "/", location: "hero", intent: "direct_contact" })} className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border border-white/14 px-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-[var(--mint)]/70 hover:bg-white/[.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mint)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)] sm:h-14">
              <MessageCircle className="size-4 text-[color:var(--mint)]" aria-hidden="true" />Parler à l’équipe
            </a>
          </motion.div>

          <motion.ul
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .32, duration: .58 }}
            className="mt-7 space-y-2.5"
          >
            {reassurance.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[12px] leading-5 text-white/72 sm:text-[13px]">
                <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[var(--mint)] text-[color:var(--ink)]"><Check className="size-2.5" /></span>
                {item}
              </li>
            ))}
          </motion.ul>

          <div className="mt-8 lg:hidden" aria-label="Aperçu animé du parcours Orée">
            <HeroCockpit compact />
          </div>
        </div>

        <div className="relative hidden lg:block">
          <HeroCockpit />
          <div className="pointer-events-none absolute -bottom-7 -right-4 z-30 w-44 overflow-hidden rounded-[18px] border border-white/20 bg-[var(--ink)] shadow-[0_24px_70px_rgba(11,18,32,.4)] sm:w-52">
            <ArtDirectedPicture asset={imagery.homeHero} sizes="208px" className="aspect-[4/3]" imageClassName="object-[78%_center]" />
            <p className="px-3 py-2.5 text-[9px] font-bold uppercase tracking-[.12em] text-white/72">Un projet, des décisions visibles</p>
          </div>
        </div>
      </div>

      <a href="#parcours" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] font-semibold uppercase tracking-[.13em] text-white/72 lg:flex">
        Choisir mon point de départ <ArrowRight className="size-3.5 rotate-90" />
      </a>
    </section>
  );
}
