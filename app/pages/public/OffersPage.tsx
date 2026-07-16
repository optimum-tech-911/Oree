import { Check, CircleHelp, Layers3, ReceiptText, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Faq } from "@/components/marketing/Faq";
import { Reveal } from "@/components/marketing/Reveal";
import { ArtDirectedPicture } from "@/components/media/ArtDirectedPicture";
import { imagery } from "@/content/imagery";
import { usePageMeta } from "@/hooks/usePageMeta";

const plans = [
  { name: "Essentiel", tag: "Projet déjà défini", description: "Un parcours structuré pour préparer les informations et suivre le dossier dans un espace unique.", price: "Tarif sur devis", features: ["Diagnostic et feuille de route", "Liste documentaire dynamique", "Espace projet", "Centre documentaire", "Suivi des étapes"], highlight: false },
  { name: "Accompagné", tag: "Parcours principal", description: "Un accompagnement comprenant le cadrage, le contrôle du dossier et des échanges contextualisés.", price: "Tarif sur devis", features: ["Tout l'Essentiel", "Rendez-vous de cadrage", "Équipe de suivi", "Vérification du dossier", "Demandes de correction", "Messagerie projet"], highlight: true },
  { name: "Sérénité", tag: "Projet plus complexe", description: "Une organisation renforcée pour plusieurs associés, une transition ou un dossier déjà commencé.", price: "Sur étude", features: ["Tout l'Accompagné", "Parcours multi-associés", "Plan de transition", "Traitement interne priorisé", "Plusieurs points de validation", "Suivi renforcé"], highlight: false },
] as const;

export default function OffersPage() {
  usePageMeta("Offres", "Découvrez les niveaux d'accompagnement et la séparation entre service, frais légaux et prestations tierces.");
  return (
    <>
      <section className="hero-grid surface-noise relative overflow-hidden bg-[var(--night)] pb-24 pt-34 text-white sm:pt-42 lg:pb-32 lg:pt-44">
        <div className="glow-mint left-1/2 top-0 -translate-x-1/2 opacity-60" />
        <div className="container-shell relative z-10 text-center"><Badge className="border-white/12 bg-white/[.06] text-white/70"><ReceiptText className="size-3.5 text-[color:var(--mint)]" />Offres et transparence</Badge><h1 className="mx-auto mt-7 max-w-6xl text-balance text-[clamp(3.4rem,7.2vw,8.4rem)] font-semibold leading-[.89] tracking-[-.077em]">Choisissez le niveau d'accompagnement <span className="gradient-text">adapté à votre projet.</span></h1><p className="mx-auto mt-8 max-w-2xl text-pretty text-lg leading-8 text-white/72 sm:text-xl">Chaque proposition distingue les honoraires du service, les frais légaux obligatoires et les éventuelles prestations tierces. Un devis détaillé doit précéder tout engagement.</p></div>
      </section>

      <section className="relative z-10 -mt-12 pb-20 sm:-mt-16 lg:pb-28">
        <div className="container-shell"><div className="grid gap-4 lg:grid-cols-3 lg:items-stretch">{plans.map((plan, index) => <Reveal key={plan.name} delay={index * .07}><article className={`interactive-card relative flex h-full flex-col overflow-hidden rounded-[34px] border p-7 sm:p-8 ${plan.highlight ? "border-white/10 bg-[var(--night-soft)] text-white shadow-[0_40px_110px_rgba(11,18,32,.28)] lg:-translate-y-7" : "soft-panel"}`}>
          {plan.highlight ? <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--mint),var(--sky),var(--accent))]" /> : null}
          <div className="flex items-start justify-between gap-4"><div><p className={`text-xs font-semibold uppercase tracking-[.15em] ${plan.highlight ? "text-white/72" : "text-[color:var(--muted)]"}`}>{plan.tag}</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.05em]">{plan.name}</h2></div>{plan.highlight ? <span className="rounded-full bg-[var(--mint)] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.09em] text-[color:var(--ink)]">Recommandé</span> : null}</div>
          <p className={`mt-5 min-h-[84px] text-sm leading-7 ${plan.highlight ? "text-white/72" : "text-[color:var(--muted)]"}`}>{plan.description}</p>
          <p className="mt-7 text-2xl font-semibold tracking-[-.035em]">{plan.price}</p><p className={`mt-1 text-xs ${plan.highlight ? "text-white/72" : "text-[color:var(--muted)]"}`}>Honoraires de service hors frais externes</p>
          <div className={`my-7 h-px ${plan.highlight ? "bg-white/10" : "bg-[var(--line)]"}`} />
          <ul className="flex-1 space-y-3.5">{plan.features.map((item) => <li key={item} className={`flex items-start gap-3 text-sm ${plan.highlight ? "text-white/76" : "text-[color:var(--ink)]"}`}><span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${plan.highlight ? "bg-[var(--mint)] text-[color:var(--ink)]" : "bg-[var(--mint-soft)]"}`}><Check className="size-3" /></span>{item}</li>)}</ul>
          <ButtonLink to="/diagnostic" variant={plan.highlight ? "dark" : "primary"} size="lg" className="mt-9 w-full" arrow>Choisir ce parcours</ButtonLink>
        </article></Reveal>)}</div></div>
      </section>

      <Section className="overflow-hidden bg-[var(--paper-soft)]">
        <div className="container-shell"><SectionHeader eyebrow="Décomposition des coûts" title={<>Trois lignes différentes, <span className="gradient-text-dark">toujours visibles.</span></>} description="Aucun prix d'appel ne doit masquer les dépenses nécessaires ou un abonnement ajouté ensuite." /><div className="grid gap-4 lg:grid-cols-3">{[[Sparkles, "Honoraires de service", "Ce que rémunère l'accompagnement, la plateforme, le contrôle et le traitement prévu dans l'offre."], [ShieldCheck, "Frais légaux obligatoires", "Annonce légale, immatriculation et autres frais applicables selon la structure et la situation."], [Layers3, "Services tiers optionnels", "Domiciliation, compte professionnel, dépôt de capital, signature ou prestations complémentaires."]].map(([Icon, title, description], index) => { const Component = Icon as typeof Sparkles; return <Reveal key={String(title)} delay={index * .07}><article className="interactive-card soft-panel h-full rounded-[30px] p-7"><div className="flex items-center justify-between"><span className="grid size-13 place-items-center rounded-[19px] bg-[var(--night)] text-white"><Component className="size-5" /></span><span className="text-4xl font-semibold text-[color:var(--ink)]/[.06]">0{index + 1}</span></div><h3 className="mt-8 text-xl font-semibold">{String(title)}</h3><p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{String(description)}</p></article></Reveal>; })}</div></div>
      </Section>

      <Section>
        <div className="container-shell grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><Badge>Conditions tarifaires</Badge><h2 className="mt-6 text-balance text-4xl font-semibold leading-[1] tracking-[-.055em] sm:text-5xl">Un devis doit préciser le périmètre, le prix et les exclusions.</h2><p className="mt-5 text-base leading-7 text-[color:var(--muted)]">Les honoraires, les frais externes, les délais internes et les prestations complémentaires doivent être présentés séparément avant toute souscription.</p></div><Faq items={[{ question: "Les frais légaux sont-ils compris dans le prix affiché ?", answer: "Ils doivent apparaître séparément, avec leur nature et leur origine. Leur montant dépend notamment de la structure retenue et des formalités nécessaires." }, { question: "Puis-je changer d'offre en cours de projet ?", answer: "Un changement d'offre ou l'ajout d'une prestation complémentaire doit faire l'objet d'une information claire et d'une validation explicite avant facturation." }, { question: "Que signifie traitement prioritaire ?", answer: "Cette mention ne peut concerner qu'un délai interne effectivement maîtrisé par le prestataire. Elle ne constitue pas une garantie sur les délais de l'administration." }, { question: "Y aura-t-il un abonnement ?", answer: "Aucun abonnement ne peut être activé sans information préalable sur son prix, sa durée, son renouvellement et ses modalités de résiliation." }]} /></div>
      </Section>

      <Section className="pt-0"><div className="container-shell"><div className="grid overflow-hidden rounded-[32px] border border-[var(--line)] bg-[var(--night)] text-white shadow-[0_30px_90px_rgba(11,18,32,.18)] lg:grid-cols-[1.12fr_.88fr]"><div className="hero-grid surface-noise relative z-10 px-7 py-14 sm:px-10 lg:px-14 lg:py-18"><Badge className="border-white/12 bg-white/[.06] text-white/72"><CircleHelp className="size-3.5 text-[color:var(--mint)]" />Besoin d'être orienté</Badge><h2 className="mt-6 max-w-4xl text-balance text-[clamp(2.7rem,4.7vw,5.2rem)] font-semibold leading-[1] tracking-[-.045em]">Définissez les besoins du projet avant de sélectionner l'accompagnement.</h2><p className="mt-5 max-w-2xl text-base leading-7 text-white/72">Le diagnostic précise la situation, le calendrier et les points qui justifient une intervention humaine.</p><ButtonLink to="/diagnostic" variant="dark" size="lg" className="mt-8" arrow>Lancer le diagnostic</ButtonLink></div><figure className="relative min-h-[360px] overflow-hidden lg:min-h-full"><ArtDirectedPicture asset={imagery.adviserConsultation} sizes="(max-width: 1023px) 100vw, 42vw" className="absolute inset-0 size-full" /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,18,32,.58),rgba(11,18,32,.04)_65%)]" /><figcaption className="absolute bottom-5 right-5 rounded-full border border-white/20 bg-[var(--ink)]/82 px-3 py-2 text-[9px] font-semibold tracking-[.04em] text-white backdrop-blur-md">Situation illustrative · échange de cadrage</figcaption></figure></div></div></Section>
    </>
  );
}
