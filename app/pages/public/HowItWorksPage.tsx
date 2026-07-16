import { ArrowDown, Check, FileInput, Layers3, MessagesSquare, ShieldCheck, Sparkles, UserRoundCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ProcessRail } from "@/components/marketing/ProcessRail";
import { DashboardPreview } from "@/components/marketing/DashboardPreview";
import { Reveal } from "@/components/marketing/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";

const beforeAccount = [
  [Sparkles, "Diagnostic sans compte", "Commencez immédiatement. Les réponses non sensibles restent sauvegardées pendant votre exploration."],
  [UserRoundCheck, "Résultat explicable", "L'orientation présente ses raisons, ses alternatives et les points qui restent à confirmer."],
  [FileInput, "Conversion progressive", "Le compte devient utile au bon moment : sauvegarde multi-appareils, pièces, associés et suivi."],
] as const;

export default function HowItWorksPage() {
  usePageMeta("Comment ça marche", "Du diagnostic à l'espace projet : découvrez le fonctionnement complet de la plateforme Orée.");
  return (
    <>
      <section className="hero-grid surface-noise relative overflow-hidden bg-[var(--night)] pb-20 pt-34 text-white sm:pt-42 lg:min-h-[780px] lg:pb-24 lg:pt-44">
        <div className="glow-mint -right-56 top-24 opacity-70" />
        <div className="container-shell relative z-10">
          <Badge className="border-white/12 bg-white/[.06] text-white/70"><Layers3 className="size-3.5 text-[color:var(--mint)]" />Fonctionnement</Badge>
          <h1 className="mt-7 max-w-6xl text-balance text-[clamp(3.5rem,7.7vw,8.9rem)] font-semibold leading-[.88] tracking-[-.078em]">Une plateforme qui précise <span className="gradient-text">la prochaine action utile.</span></h1>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <p className="max-w-2xl text-pretty text-lg leading-8 text-white/72 sm:text-xl">Chaque écran relie les informations du projet à une action précise et contextualisée, depuis l'orientation initiale jusqu'au suivi de la formalité.</p>
            <div className="flex flex-col gap-3 sm:flex-row"><ButtonLink to="/diagnostic" variant="dark" size="lg" arrow>Tester le parcours</ButtonLink><ButtonLink to="/app" variant="ghost" size="lg" className="border border-white/12 text-white hover:bg-white/[.08]">Voir l'espace client</ButtonLink></div>
          </div>
          <div className="mt-14 flex items-center gap-3 text-xs font-semibold uppercase tracking-[.16em] text-white/72"><span className="grid size-10 place-items-center rounded-full border border-white/12 bg-white/[.05]"><ArrowDown className="size-4 animate-bounce" /></span>Du premier clic au dossier finalisé</div>
        </div>
      </section>

      <Section className="overflow-hidden bg-[var(--paper-soft)]">
        <div className="container-shell"><SectionHeader eyebrow="Six étapes" title={<>La progression reste visible <span className="gradient-text-dark">du début à la fin.</span></>} description="Une seule ligne directrice relie le diagnostic, la préparation du projet, les documents et le suivi opérationnel." /><ProcessRail /></div>
      </Section>

      <Section className="overflow-hidden">
        <div className="container-shell">
          <SectionHeader eyebrow="Avant la création du compte" title={<>Obtenez une première orientation <span className="text-[color:var(--muted)]">avant de vous inscrire.</span></>} description="Le diagnostic peut commencer sans compte. L'inscription intervient lorsque la sauvegarde multi-appareils, les documents ou le suivi deviennent nécessaires." />
          <div className="grid gap-4 lg:grid-cols-3">
            {beforeAccount.map(([Icon, title, description], index) => <Reveal key={title} delay={index * .07}><article className="interactive-card soft-panel h-full rounded-[32px] p-7 sm:p-8"><div className="flex items-center justify-between"><span className="grid size-14 place-items-center rounded-[20px] bg-[var(--night)] text-white"><Icon className="size-5" /></span><span className="text-xs font-semibold tracking-[.14em] text-[color:var(--accent)]">0{index + 1}</span></div><h3 className="mt-8 text-2xl font-semibold tracking-[-.035em]">{title}</h3><p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{description}</p></article></Reveal>)}
          </div>
        </div>
      </Section>

      <Section className="hero-grid surface-noise overflow-hidden bg-[var(--night)] text-white">
        <div className="container-shell relative z-10 grid items-center gap-14 lg:grid-cols-[.72fr_1.28fr]">
          <div><Badge className="border-white/12 bg-white/[.06] text-white/65">Après le diagnostic</Badge><h2 className="mt-6 text-balance text-[clamp(2.8rem,5vw,5.8rem)] font-semibold leading-[.94] tracking-[-.065em]">Le projet se poursuit dans un <span className="gradient-text">espace opérationnel.</span></h2><p className="mt-6 text-lg leading-8 text-white/72">Les informations, les documents, les échanges, les rendez-vous et la chronologie sont réunis dans un même espace de suivi.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{["Prochaine action visible", "Historique des versions", "Demandes contextualisées", "Statut de chaque formalité"].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/[.08] bg-white/[.035] p-3.5 text-sm font-semibold text-white/72"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--mint)] text-[color:var(--ink)]"><Check className="size-3.5" /></span>{item}</div>)}</div></div>
          <DashboardPreview />
        </div>
      </Section>

      <Section>
        <div className="container-shell">
          <SectionHeader eyebrow="Responsabilités lisibles" title={<>Une répartition explicite <span className="text-[color:var(--muted)]">des responsabilités.</span></>} description="Les actions du porteur de projet, de l'équipe et de l'administration sont présentées séparément à chaque étape." />
          <div className="grid gap-4 md:grid-cols-3">
            {[[UserRoundCheck, "Vous", "Répondez, fournissez les pièces, confirmez les choix et signez lorsque nécessaire."], [MessagesSquare, "L'équipe", "Contrôle le dossier, demande des corrections, accompagne et prépare les étapes relevant du service."], [ShieldCheck, "L'administration", "Traite les formalités transmises selon ses propres délais et peut demander des éléments complémentaires."]].map(([Icon, title, description], index) => { const Component = Icon as typeof UserRoundCheck; return <Reveal key={String(title)} delay={index * .06}><article className="interactive-card soft-panel h-full rounded-[30px] p-7"><span className="grid size-13 place-items-center rounded-[19px] bg-[var(--mint-soft)]"><Component className="size-5" /></span><h3 className="mt-7 text-2xl font-semibold tracking-[-.035em]">{String(title)}</h3><p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{String(description)}</p></article></Reveal>; })}
          </div>
        </div>
      </Section>
    </>
  );
}
