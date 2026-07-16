import { CalendarCheck2, FileSearch, Handshake, MessageCircleMore, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { DashboardPreview } from "@/components/marketing/DashboardPreview";
import { Reveal } from "@/components/marketing/Reveal";
import { HumanTrustPanel } from "@/components/media/HumanTrustPanel";
import { imagery } from "@/content/imagery";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function AccompanimentPage() {
  usePageMeta("Accompagnement humain", "Découvrez comment le conseiller intervient dans le parcours de création de société Orée.");
  return (
    <>
      <section className="hero-grid surface-noise relative overflow-hidden bg-[var(--night)] pb-20 pt-34 text-white sm:pt-42 lg:min-h-[820px] lg:pb-24 lg:pt-44">
        <div className="glow-mint -right-52 top-16 opacity-70" />
        <div className="container-shell relative z-10 grid items-center gap-14 lg:grid-cols-[1fr_.82fr] lg:gap-20">
          <div><Badge className="border-white/12 bg-white/[.06] text-white/68"><Handshake className="size-3.5 text-[color:var(--mint)]" />Accompagnement humain</Badge><h1 className="mt-7 max-w-5xl text-balance text-[clamp(3.5rem,7vw,8.2rem)] font-semibold leading-[.89] tracking-[-.077em]">Un accompagnement humain <span className="gradient-text">fondé sur un dossier structuré.</span></h1><p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-white/72 sm:text-xl">La plateforme organise les informations du projet afin que les échanges portent sur les décisions, les incohérences et les points qui nécessitent une validation.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><ButtonLink to="/rendez-vous" variant="dark" size="lg" arrow>Réserver un échange</ButtonLink><ButtonLink to="/diagnostic" variant="ghost" size="lg" className="border border-white/12 text-white hover:bg-white/[.08]">Commencer le diagnostic</ButtonLink></div></div>
          <div className="relative"><div className="absolute -inset-8 rounded-[48px] bg-[radial-gradient(circle_at_50%_20%,rgba(70,214,166,.16),transparent_62%)] blur-2xl" /><HumanTrustPanel asset={imagery.adviserConsultation} points={["Le contexte du diagnostic reste disponible", "Les pièces et demandes sont reliées", "Les questions réglementées sont identifiées"]} /></div>
        </div>
      </section>

      <Section>
        <div className="container-shell"><SectionHeader eyebrow="Interventions utiles" title={<>Une intervention humaine sur les sujets <span className="gradient-text-dark">qui exigent analyse et responsabilité.</span></>} description="L'outil prépare le contexte. L'équipe peut ainsi se concentrer sur les incohérences, les décisions et les validations nécessaires." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[[FileSearch, "Contrôle du dossier", "Repérer une incohérence, une pièce manquante ou une information à préciser."], [MessageCircleMore, "Explication contextualisée", "Répondre à partir des éléments du projet et de l'étape concernée."], [CalendarCheck2, "Validation d'étape", "Confirmer l'orientation, le calendrier ou une décision avant de poursuivre."], [ShieldCheck, "Orientation professionnelle", "Identifier les questions qui doivent être confiées à un professionnel habilité."]].map(([Icon, title, description], index) => { const Component = Icon as typeof FileSearch; return <Reveal key={String(title)} delay={index * .06}><article className="interactive-card soft-panel h-full rounded-[30px] p-6"><div className="flex items-center justify-between"><span className="grid size-13 place-items-center rounded-[19px] bg-[var(--mint-soft)]"><Component className="size-5" /></span><span className="text-xs font-bold text-[color:var(--accent)]">0{index + 1}</span></div><h3 className="mt-7 text-xl font-semibold tracking-[-.03em]">{String(title)}</h3><p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{String(description)}</p></article></Reveal>; })}</div></div>
      </Section>

      <Section className="hero-grid surface-noise overflow-hidden bg-[var(--night)] text-white"><div className="container-shell relative z-10 grid items-center gap-14 lg:grid-cols-[.75fr_1.25fr]"><div><Badge className="border-white/12 bg-white/[.06] text-white/65"><Sparkles className="size-3.5 text-[color:var(--mint)]" />Contexte partagé</Badge><h2 className="mt-6 text-balance text-[clamp(2.8rem,5.2vw,6rem)] font-semibold leading-[.94] tracking-[-.065em]">L'équipe retrouve les informations <span className="gradient-text">déjà communiquées.</span></h2><p className="mt-6 text-lg leading-8 text-white/72">Le diagnostic, les documents, les messages et la chronologie alimentent le même projet. Chaque échange peut ainsi reprendre à partir du dernier état connu.</p></div><DashboardPreview /></div></Section>

      <Section>
        <div className="container-shell"><SectionHeader eyebrow="Cadre d'intervention" title={<>Des responsabilités et des limites <span className="text-[color:var(--muted)]">explicitement définies.</span></>} description="Le service distingue l'information générale, l'accompagnement administratif et les prestations qui relèvent d'un professionnel habilité." /><div className="grid gap-4 lg:grid-cols-3">{[["Information générale", "Comparaisons pédagogiques, étapes, listes de contrôle et explications du parcours."], ["Accompagnement administratif", "Collecte, contrôle de complétude, suivi des pièces et préparation opérationnelle du dossier."], ["Conseil réglementé", "Analyse juridique, fiscale ou comptable personnalisée par un professionnel habilité lorsque nécessaire."]].map(([title, description], index) => <Reveal key={title} delay={index * .06}><article className="interactive-card soft-panel h-full rounded-[30px] p-7"><div className="flex items-center justify-between"><span className="text-5xl font-semibold tracking-[-.07em] text-[color:var(--ink)]/[.07]">0{index + 1}</span><span className="size-2 rounded-full bg-[var(--mint)]" /></div><h3 className="mt-10 text-2xl font-semibold tracking-[-.035em]">{title}</h3><p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{description}</p></article></Reveal>)}</div></div>
      </Section>
    </>
  );
}
