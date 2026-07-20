import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check, CircleHelp, GitCompareArrows, Scale, Sparkles, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { LegalFormCards } from "@/components/marketing/LegalFormCards";
import { Reveal } from "@/components/marketing/Reveal";
import { Faq } from "@/components/marketing/Faq";
import { HeroMedia } from "@/components/media/HeroMedia";
import { imagery } from "@/content/imagery";
import { usePageMeta } from "@/hooks/usePageMeta";
import { cn } from "@/lib/cn";

const priorities = [
  ["simplicity", "Simplicité de fonctionnement", "Un cadre lisible pour démarrer sans complexité inutile."],
  ["growth", "Croissance et associés", "Anticiper l'entrée de nouveaux profils et la montée en puissance."],
  ["framework", "Cadre juridique balisé", "Privilégier une organisation plus encadrée et prévisible."],
  ["investors", "Investisseurs et financement", "Préparer une structure plus souple pour les opérations futures."],
] as const;

const dimensions = [
  [UsersRound, "Associés et gouvernance", "Nombre d'associés, répartition des pouvoirs, décisions et évolution du capital."],
  [Scale, "Dirigeant et protection", "Régime social, rémunération, responsabilités et fonctionnement quotidien."],
  [CircleHelp, "Activité et économie", "Clients, charges, investissements, recrutement, marge et besoin de financement."],
  [Sparkles, "Trajectoire future", "Arrivée d'associés, transmission, levée de fonds ou changement d'échelle."],
] as const;

export default function ChooseStatusPage() {
  const [founders, setFounders] = useState<"solo" | "multiple">("solo");
  const [priority, setPriority] = useState<(typeof priorities)[number][0]>("simplicity");
  usePageMeta("Choisir son statut juridique", "Comparez les principales structures selon votre situation, votre équipe et vos priorités.");

  const recommendation = useMemo(() => {
    if (founders === "multiple") return priority === "investors" || priority === "growth" ? ["SAS", "SARL"] : ["SARL", "SAS"];
    if (priority === "growth" || priority === "investors") return ["SASU", "EURL"];
    return ["EURL", "SASU", "EI", "MICRO"];
  }, [founders, priority]);

  return (
    <>
      <section className="hero-grid surface-noise relative overflow-hidden bg-[var(--night)] pb-20 pt-34 text-white sm:pt-42 lg:min-h-[860px] lg:pb-24 lg:pt-44">
        <div className="glow-mint -left-52 top-40 opacity-80" />
        <div className="container-shell relative z-10 grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-18">
          <div>
            <Badge className="border-white/12 bg-white/[.06] text-white/72"><GitCompareArrows className="size-3.5 text-[color:var(--mint)]" />Comparateur d'orientation</Badge>
            <h1 className="mt-7 max-w-4xl text-balance text-[clamp(3.4rem,6.7vw,7.7rem)] font-semibold leading-[.9] tracking-[-.075em]">
              Le choix du statut organise <span className="gradient-text">la gouvernance, la protection et l'évolution du projet.</span>
            </h1>
            <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-white/72 sm:text-xl">
              Explorez les premières options en quelques secondes, puis approfondissez avec un diagnostic qui tient compte de votre activité, de votre situation et de votre trajectoire.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/diagnostic" variant="dark" size="lg" arrow>Faire le diagnostic complet</ButtonLink>
              <ButtonLink to="/rendez-vous" variant="ghost" size="lg" className="border border-white/12 text-white hover:bg-white/[.08]">Demander une revue</ButtonLink>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-white/72">
              {["Résultat explicable", "Réponses modifiables", "Sans compte au départ"].map((item) => <span key={item} className="inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-[var(--mint)]" />{item}</span>)}
            </div>
          </div>

          <HeroMedia asset={imagery.chooseStatusHero} contentClassName="pb-1 sm:pb-2">
            <div className="w-full origin-bottom scale-[.88] sm:scale-[.79] lg:scale-[.74]">
            <div className="absolute -inset-8 rounded-[46px] bg-[radial-gradient(circle_at_50%_20%,rgba(36,87,255,.3),transparent_60%)] blur-2xl" />
            <div className="glass-panel relative rounded-[38px] p-5 sm:p-7 lg:p-8">
              <div className="flex items-start justify-between gap-5">
                <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-white/72">Orientation express</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.045em] sm:text-3xl">Votre point de départ</h2></div>
                <span className="animate-pulse-ring grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--mint)] text-[color:var(--ink)]"><Sparkles className="size-5" /></span>
              </div>

              <div className="mt-8">
                <p className="text-sm font-semibold text-white/76">Combien serez-vous au capital ?</p>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  {[["solo", "Je crée seul", "SASU, EURL, EI…"], ["multiple", "Nous sommes plusieurs", "SAS, SARL…"]].map(([value, label, sub]) => (
                    <button key={value} onClick={() => setFounders(value as "solo" | "multiple")} className={cn("group rounded-[18px] border p-4 text-left transition duration-300", founders === value ? "border-[var(--action)] bg-[var(--action)] text-white shadow-[0_16px_40px_rgba(36,87,255,.22)]" : "border-white/10 bg-white/[.045] text-white hover:-translate-y-0.5 hover:border-white/22 hover:bg-white/[.08]") }>
                      <span className="block text-sm font-bold">{label}</span><span className="mt-1.5 block text-[11px] text-white/72">{sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7">
                <p className="text-sm font-semibold text-white/76">Votre priorité dominante aujourd'hui ?</p>
                <div className="mt-3 grid gap-2.5">
                  {priorities.map(([value, label, description]) => (
                    <button key={value} onClick={() => setPriority(value)} className={cn("flex items-center justify-between gap-4 rounded-[20px] border px-4 py-3.5 text-left transition duration-300", priority === value ? "border-white/22 bg-white/[.11]" : "border-white/[.07] bg-white/[.025] hover:border-white/16 hover:bg-white/[.055]") }>
                      <span><span className="block text-sm font-semibold text-white/86">{label}</span><span className="mt-1 block text-[11px] leading-4 text-white/72">{description}</span></span>
                      <span className={cn("grid size-7 shrink-0 place-items-center rounded-full transition", priority === value ? "bg-[var(--action)] text-white" : "border border-white/12 text-transparent")}><Check className="size-3.5" /></span>
                    </button>
                  ))}
                </div>
              </div>

              <motion.div layout className="mt-7 overflow-hidden rounded-[25px] border border-white/10 bg-black/20 p-5">
                <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[.14em] text-white/72">Structures à approfondir</p><span className="text-[10px] font-semibold text-[color:var(--mint)]">MIS À JOUR</span></div>
                <motion.div layout className="mt-4 flex flex-wrap gap-2">
                  {recommendation.map((code, index) => <motion.span layout initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * .05 }} key={code} className="rounded-full border border-white/12 bg-white/[.08] px-3.5 py-2 text-sm font-bold text-white">{code}</motion.span>)}
                </motion.div>
                <ButtonLink to="/diagnostic" variant="ghost" className="mt-4 h-auto p-0 text-[12px] text-white/72 hover:border-transparent hover:bg-transparent hover:text-white">Affiner avec toutes les dimensions <ArrowRight className="size-3.5" /></ButtonLink>
              </motion.div>
            </div>
            </div>
          </HeroMedia>
        </div>
      </section>

      <Section className="overflow-hidden bg-[var(--paper-soft)]">
        <div className="container-shell">
          <SectionHeader eyebrow="Vue d'ensemble" title={<>Une comparaison claire des <span className="gradient-text-dark">principales structures.</span></>} description="Chaque fiche présente les situations auxquelles la structure peut correspondre ainsi que les points qui exigent une validation complémentaire." />
          <LegalFormCards codes={["SASU", "EURL", "SAS", "SARL"]} />
        </div>
      </Section>

      <Section className="overflow-hidden">
        <div className="container-shell">
          <SectionHeader eyebrow="Décision multidimensionnelle" title={<>Quatre angles qui changent <span className="text-[color:var(--muted)]">réellement le choix.</span></>} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {dimensions.map(([Icon, title, description], index) => (
              <Reveal key={title} delay={index * .06}>
                <article className="interactive-card soft-panel h-full rounded-[30px] p-6 sm:p-7">
                  <div className="flex items-center justify-between"><span className="grid size-13 place-items-center rounded-[19px] bg-[var(--night)] text-white"><Icon className="size-5" /></span><span className="text-4xl font-semibold tracking-[-.06em] text-[color:var(--ink)]/[.06]">0{index + 1}</span></div>
                  <h3 className="mt-8 text-xl font-semibold tracking-[-.025em]">{title}</h3><p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section className="hero-grid surface-noise overflow-hidden bg-[var(--night)] text-white">
        <div className="container-shell relative z-10 grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div><Badge className="border-white/12 bg-white/[.06] text-white/65">Diagnostic adaptatif</Badge><h2 className="mt-6 max-w-5xl text-balance text-[clamp(2.8rem,5.4vw,6.3rem)] font-semibold leading-[.93] tracking-[-.065em]">Passez de la comparaison générale à <span className="gradient-text">votre situation réelle.</span></h2><p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">Le diagnostic sauvegarde vos réponses, explique son orientation et liste les points qui nécessitent une validation humaine.</p></div>
          <ButtonLink to="/diagnostic" variant="dark" size="lg" arrow>Démarrer maintenant</ButtonLink>
        </div>
      </Section>

      <Section>
        <div className="container-shell grid gap-12 lg:grid-cols-[.68fr_1.32fr]">
          <div><Badge>Questions fréquentes</Badge><h2 className="mt-6 text-balance text-4xl font-semibold leading-[1] tracking-[-.055em] sm:text-5xl">Comparer les structures avec les nuances nécessaires.</h2><p className="mt-5 max-w-md text-sm leading-7 text-[color:var(--muted)]">L'orientation classe les options à approfondir et explicite les critères utilisés, sans se substituer à une validation professionnelle lorsque celle-ci est requise.</p></div>
          <Faq items={[
            { question: "Le simulateur choisit-il le statut à ma place ?", answer: "Non. Il classe les options selon vos réponses et met en évidence les points à valider. Une décision personnalisée peut nécessiter l'intervention d'un professionnel habilité." },
            { question: "Pourquoi l'entreprise individuelle apparaît-elle parfois ?", answer: "Certains projets très simples, sans associé et avec un objectif de test peuvent justifier d'étudier une entreprise individuelle ou le régime micro au lieu de créer immédiatement une société." },
            { question: "Puis-je modifier mes réponses ?", answer: "Oui. Le parcours permet de revenir en arrière, et l'orientation est recalculée à partir des nouvelles réponses." },
          ]} />
        </div>
      </Section>
    </>
  );
}
