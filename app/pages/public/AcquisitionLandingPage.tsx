import { Check, ChevronRight, CircleAlert, LockKeyhole, ShieldCheck, Sparkles, TimerReset } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { landingPages } from "@/content/landingPages";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Faq } from "@/components/marketing/Faq";
import { Reveal } from "@/components/marketing/Reveal";
import { LegalFormCards } from "@/components/marketing/LegalFormCards";
import { DashboardPreview } from "@/components/marketing/DashboardPreview";
import { HeroMedia } from "@/components/media/HeroMedia";
import { imagery, landingHeroBySlug } from "@/content/imagery";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function AcquisitionLandingPage({ slug }: { slug: string }) {
  const content = landingPages[slug] ?? landingPages["creation-sasu"]!;
  const heroImage = landingHeroBySlug[slug] ?? imagery.sasuHero;
  const reduce = useReducedMotion();
  usePageMeta(content.eyebrow, content.description);

  return (
    <>
      <section className="hero-grid surface-noise relative overflow-hidden bg-[var(--night)] pb-24 pt-34 text-white sm:pt-40 lg:min-h-[810px] lg:pb-30 lg:pt-42">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(36,87,255,.23),transparent_31%),radial-gradient(circle_at_82%_32%,rgba(70,214,166,.12),transparent_30%)]" />
        <div className="container-shell relative grid items-center gap-14 lg:grid-cols-[1.04fr_.96fr]">
          <div>
            <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><Badge className="border-white/12 bg-white/7 text-white/64"><span className="size-1.5 rounded-full bg-[var(--mint)] shadow-[0_0_12px_var(--mint)]" />{content.eyebrow}</Badge></motion.div>
            <motion.h1 initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .06, duration: .76, ease: [0.22, 1, 0.36, 1] }} className="mt-7 max-w-[860px] text-balance text-[clamp(3.1rem,6.1vw,6.8rem)] font-extrabold leading-[.89] tracking-[-.071em]">{content.title} <span className="editorial-mark text-[color:var(--mint)]">{content.highlight}</span></motion.h1>
            <motion.p initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18, duration: .62 }} className="mt-7 max-w-2xl text-pretty text-base leading-8 text-white/72 sm:text-xl sm:leading-9">{content.description}</motion.p>
            <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .26, duration: .62 }} className="mt-8 flex flex-col gap-3 sm:flex-row"><ButtonLink to={`/diagnostic?intent=${content.searchIntent}`} variant="dark" size="lg" arrow>{content.primaryCta}</ButtonLink><ButtonLink to="/choisir-statut" variant="ghost" size="lg" className="border border-white/12 text-white hover:bg-white/9">{content.secondaryCta}</ButtonLink></motion.div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-bold text-white/72 sm:text-xs">{content.proofPoints.map((point) => <span key={point} className="flex items-center gap-2"><span className="grid size-4 place-items-center rounded-full bg-[var(--mint)]/12"><Check className="size-2.5 text-[color:var(--mint)]" /></span>{point}</span>)}</div>
          </div>

          <HeroMedia asset={heroImage} contentClassName="pb-2 sm:pb-3">
            <div className="w-full origin-bottom scale-[.91] sm:scale-[.82] lg:scale-[.78]">
            <div className="relative overflow-hidden rounded-[38px] border border-white/12 bg-white/[.055] p-4 shadow-[0_45px_130px_rgba(11,18,32,.34)] backdrop-blur-2xl sm:p-5">
              <div className="absolute -right-14 -top-16 size-52 rounded-full bg-[var(--accent)]/25 blur-3xl" />
              <div className="relative rounded-[30px] border border-white/8 bg-[var(--ink)] p-5 sm:p-6">
                <div className="flex items-start justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-white/72">Votre prochain parcours</p><p className="mt-2 text-xl font-extrabold tracking-[-.035em]">Orientation personnalisée</p></div><span className="grid size-11 place-items-center rounded-[16px] bg-[var(--mint)] text-[color:var(--ink)]"><Sparkles className="size-4.5" /></span></div>
                <div className="mt-6 space-y-2.5">{["Situation et niveau d'avancement", "Associés et organisation", "Activité, clients et calendrier", "Priorités et points à valider"].map((label, index) => <motion.div key={label} initial={reduce ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .45 + index * .08 }} className={`flex items-center gap-3 rounded-[18px] border p-3.5 ${index === 0 ? "border-[var(--accent)]/35 bg-[var(--accent)]/12" : "border-white/7 bg-white/[.035]"}`}><span className={`grid size-8 place-items-center rounded-full text-[10px] font-extrabold ${index === 0 ? "bg-[var(--accent)] text-white" : "bg-white/7 text-white/72"}`}>0{index + 1}</span><span className="text-xs font-bold text-white/72 sm:text-sm">{label}</span>{index === 0 ? <span className="ml-auto rounded-full bg-[var(--mint)]/12 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.08em] text-[color:var(--mint)]">Départ</span> : null}</motion.div>)}</div>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2"><div className="rounded-[18px] border border-white/7 bg-white/[.035] p-3.5"><TimerReset className="size-4 text-[color:var(--sky)]" /><p className="mt-3 text-xs font-extrabold">Environ 3 minutes</p><p className="mt-1 text-[10px] leading-4 text-white/72">Vous pouvez reprendre plus tard.</p></div><div className="rounded-[18px] border border-white/7 bg-white/[.035] p-3.5"><LockKeyhole className="size-4 text-[color:var(--mint)]" /><p className="mt-3 text-xs font-extrabold">Sans document au départ</p><p className="mt-1 text-[10px] leading-4 text-white/72">Commencez par décrire le projet.</p></div></div>
                <div className="mt-3 rounded-[18px] bg-white p-4 text-[color:var(--ink)]"><div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--mint-soft)]"><ShieldCheck className="size-4" /></span><div><p className="text-xs font-extrabold">Orientation indicative et transparente</p><p className="mt-1 text-[11px] leading-5 text-[color:var(--muted)]">Les sujets nécessitant une validation professionnelle restent visibles.</p></div></div></div>
              </div>
            </div>
            </div>
          </HeroMedia>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--paper)] to-transparent" />
      </section>

      <Section className="pt-16">
        <div className="container-shell">
          <SectionHeader eyebrow="Points d'attention" title={<>Les décisions à examiner <span className="editorial-mark text-[color:var(--blue)]">avant de constituer le dossier.</span></>} description="Le parcours présente les conséquences pratiques de chaque choix et les sujets qui nécessitent une validation complémentaire." />
          <div className="grid gap-4 lg:grid-cols-3">{content.painPoints.map((item, index) => <Reveal key={item.title} delay={index * .06}><div className="interactive-card h-full rounded-[30px] border border-[var(--line)] bg-white/75 p-6"><span className="grid size-12 place-items-center rounded-[17px] bg-[var(--blue)]/8 text-[color:var(--blue)]"><CircleAlert className="size-5" /></span><h3 className="mt-5 text-xl font-extrabold tracking-[-.035em]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{item.description}</p></div></Reveal>)}</div>
        </div>
      </Section>

      <Section className="overflow-hidden bg-white/55">
        <div className="container-shell">
          <SectionHeader eyebrow="Parcours guidé" title={<>Quatre temps pour passer de l'intention <span className="editorial-mark text-[color:var(--blue)]">au projet organisé.</span></>} />
          <div className="grid gap-4 lg:grid-cols-4">{content.steps.map((item, index) => <Reveal key={item.number} delay={index * .06}><div className="interactive-card group h-full rounded-[30px] border border-[var(--line)] bg-[var(--paper)] p-6"><div className="flex items-center justify-between"><span className="text-5xl font-semibold tracking-[-.075em] text-[color:var(--ink)]/12">{item.number}</span><ChevronRight className="size-5 text-[color:var(--muted)] transition group-hover:translate-x-1 group-hover:text-[color:var(--accent)]" /></div><h3 className="mt-7 text-lg font-extrabold tracking-[-.03em]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{item.description}</p></div></Reveal>)}</div>
        </div>
      </Section>

      {content.legalForms?.length ? <Section><div className="container-shell"><SectionHeader eyebrow="Comparaison" title={<>Les deux pistes principales, <span className="editorial-mark text-[color:var(--blue)]">sans raccourci.</span></>} description="Une comparaison utile explique les différences et les points à valider au lieu d'afficher un gagnant automatique." /><LegalFormCards codes={content.legalForms} /></div></Section> : null}

      <Section className="overflow-hidden bg-[var(--night)] text-white"><div className="absolute inset-0 hero-grid opacity-45" /><div className="container-shell relative grid items-center gap-14 lg:grid-cols-[.72fr_1.28fr]"><div><Badge className="border-white/12 bg-white/7 text-white/72">Après le diagnostic</Badge><h2 className="mt-6 text-balance text-[clamp(2.7rem,5vw,5.8rem)] font-extrabold leading-[.95] tracking-[-.065em]">Un espace de projet qui <span className="editorial-mark text-[color:var(--mint)]">conserve les informations utiles.</span></h2><p className="mt-6 text-lg leading-8 text-white/72">Le diagnostic alimente la fiche projet, la liste documentaire, les messages et la prochaine action. Les informations déjà communiquées restent disponibles dans la suite du parcours.</p><ButtonLink to="/app" variant="dark" className="mt-8" arrow>Explorer l'espace de démonstration</ButtonLink></div><DashboardPreview /></div></Section>

      <Section><div className="container-shell grid gap-12 lg:grid-cols-[.72fr_1.28fr]"><div className="lg:sticky lg:top-28 lg:self-start"><Badge>Questions fréquentes</Badge><h2 className="mt-6 text-4xl font-extrabold leading-[.98] tracking-[-.058em] sm:text-5xl">Les informations essentielles avant de commencer.</h2><p className="mt-5 text-base leading-7 text-[color:var(--muted)]">Les réponses ci-contre présentent le fonctionnement général du parcours et les points qui peuvent nécessiter l'intervention d'un professionnel habilité.</p></div><Faq items={content.faq} /></div></Section>

      <Section className="pt-0"><div className="container-shell"><div className="relative overflow-hidden rounded-[40px] bg-[var(--ink)] px-6 py-14 text-white shadow-[0_30px_100px_rgba(11,18,32,.08)] sm:px-10 lg:px-16 lg:py-20"><div className="absolute -right-24 -top-24 size-72 rounded-full bg-[var(--accent)]/12 blur-3xl" /><div className="relative grid items-end gap-10 lg:grid-cols-[1fr_auto]"><div><Badge className="border-white/10 bg-white/7 text-white/72">Votre prochaine étape</Badge><h2 className="mt-6 max-w-4xl text-balance text-4xl font-extrabold leading-[.98] tracking-[-.062em] sm:text-5xl lg:text-6xl">Précisez votre situation pour obtenir une orientation argumentée.</h2></div><ButtonLink to={`/diagnostic?intent=${content.searchIntent}`} variant="dark" size="lg" arrow>{content.primaryCta}</ButtonLink></div></div></div></Section>
    </>
  );
}
