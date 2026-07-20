import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronRight, CircleAlert, Clock3, FileText, ListChecks, LockKeyhole, ReceiptText, ShieldCheck, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { landingPages } from "@/content/landingPages";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Faq } from "@/components/marketing/Faq";
import { Reveal } from "@/components/marketing/Reveal";
import { LegalFormCards } from "@/components/marketing/LegalFormCards";
import { DashboardPreview } from "@/components/marketing/DashboardPreview";
import { ServiceScope } from "@/components/marketing/ServiceScope";
import { HeroMedia } from "@/components/media/HeroMedia";
import { imagery, landingHeroBySlug } from "@/content/imagery";
import { usePageMeta } from "@/hooks/usePageMeta";
import { analytics } from "@/services/analytics";

type OperationalModule = {
  quickAnswer: string;
  costContext: string;
  timing: string;
  documents: string[];
};

const operationalBySlug: Record<string, OperationalModule> = {
  "creation-sasu": {
    quickAnswer: "La SASU peut convenir à un projet porté seul qui recherche une gouvernance souple. Elle doit rester comparée à l'EURL selon la rémunération, la protection recherchée et l'évolution prévue.",
    costContext: "Le devis doit séparer les honoraires ORÉE, les frais légaux liés à la SASU et toute option choisie.",
    timing: "Le calendrier dépend de la complétude du dossier et des organismes concernés ; aucun délai administratif n'est garanti.",
    documents: ["Identité et situation du dirigeant", "Adresse et justificatif du siège", "Capital et apports envisagés", "Informations sur l'activité"],
  },
  "creation-eurl": {
    quickAnswer: "L'EURL propose un cadre plus balisé pour entreprendre seul. Le régime du gérant, la rémunération et l'arrivée possible d'associés doivent être examinés face à la SASU.",
    costContext: "Le coût dépend du périmètre d'accompagnement, des frais légaux et des éventuels services tiers retenus.",
    timing: "La date utile est celle d'un dossier complet et cohérent, pas une promesse de traitement de l'administration.",
    documents: ["Identité et situation du gérant", "Adresse et justificatif du siège", "Capital et nature des apports", "Description précise de l'activité"],
  },
  "creation-sas": {
    quickAnswer: "La SAS offre une grande liberté d'organisation, qui exige d'aligner les associés sur les pouvoirs, les décisions, le capital et les scénarios d'évolution.",
    costContext: "La complexité de la gouvernance et le nombre d'associés peuvent modifier le périmètre du service ; le devis doit l'expliquer.",
    timing: "L'accord des associés et la complétude de chaque partie précèdent tout calendrier de formalité.",
    documents: ["Identité de chaque associé et dirigeant", "Répartition des apports et du capital", "Adresse du siège", "Décisions de gouvernance à confirmer"],
  },
  "creation-sarl": {
    quickAnswer: "La SARL encadre davantage l'organisation collective. La gérance, la détention du capital et les règles entre associés restent des sujets déterminants.",
    costContext: "Honoraires, frais légaux et éventuelles interventions complémentaires doivent apparaître sur des lignes distinctes.",
    timing: "Une pièce ou une décision manquante chez un associé peut décaler l'ensemble du dossier.",
    documents: ["Identité des associés et gérants", "Répartition des parts et apports", "Adresse du siège", "Organisation de la gérance"],
  },
  "creer-entreprise-seul": {
    quickAnswer: "Créer seul n'impose pas automatiquement une SASU ou une EURL. L'entreprise individuelle et le régime micro peuvent aussi devoir être examinés selon l'activité et les charges.",
    costContext: "Le coût ne doit être demandé qu'après avoir identifié la structure et l'accompagnement réellement utiles.",
    timing: "Le diagnostic peut commencer avant le choix définitif et sans document sensible.",
    documents: ["Situation professionnelle actuelle", "Description de l'activité et des clients", "Charges et rémunération envisagées", "Adresse et calendrier du projet"],
  },
  "creer-entreprise-a-plusieurs": {
    quickAnswer: "À plusieurs, la première décision n'est pas seulement SAS ou SARL : il faut d'abord rendre explicites les rôles, apports, pouvoirs et règles de décision.",
    costContext: "Le devis doit préciser l'effet du nombre d'associés et des besoins de gouvernance sur le périmètre.",
    timing: "Le projet avance au rythme des décisions communes et de la complétude de chaque associé.",
    documents: ["Identité et situation de chaque porteur", "Apports et répartition envisagée", "Rôles et pouvoirs à discuter", "Adresse et activité de la future société"],
  },
  "creer-entreprise-en-etant-salarie": {
    quickAnswer: "Le projet peut être préparé avant de quitter un emploi. Le contrat de travail, la loyauté, l'activité envisagée et la date de lancement peuvent nécessiter une vérification adaptée.",
    costContext: "La préparation du calendrier et une éventuelle revue humaine doivent être chiffrées séparément dans le devis.",
    timing: "Le bon moment dépend du contrat, de la disponibilité et de la maturité du projet, pas d'une règle unique.",
    documents: ["Situation professionnelle sans document sensible", "Activité et date de lancement envisagées", "Clients ou premières ventes éventuels", "Points contractuels à faire vérifier"],
  },
  "creer-entreprise-demandeur-emploi": {
    quickAnswer: "ARE, ARCE et ACRE répondent à des règles différentes. L'éligibilité, le calendrier et les effets d'une rémunération doivent être confirmés auprès des organismes compétents.",
    costContext: "Aucune aide ne doit être présentée comme une remise garantie sur le prix du service ou comme automatiquement acquise.",
    timing: "L'ordre des démarches peut compter ; la synthèse indique les dates et conditions qui restent à vérifier officiellement.",
    documents: ["Situation et dispositif envisagé", "Date de création souhaitée", "Rémunération prévue au démarrage", "Activité et forme juridique à comparer"],
  },
  "passer-micro-entreprise-en-societe": {
    quickAnswer: "Le passage en société se décide à partir des charges, contrats, besoins de financement, protection et perspectives — pas sur un seuil universel.",
    costContext: "Le devis doit distinguer la création de la société des éventuelles opérations nécessaires à la transition de l'activité existante.",
    timing: "La continuité de facturation et des contrats doit être organisée avant la date de bascule.",
    documents: ["Données d'activité et charges réelles", "Contrats clients et fournisseurs", "Outils, comptes et engagements existants", "Date et structure cible envisagées"],
  },
  "dossier-creation-entreprise-bloque": {
    quickAnswer: "La prochaine action dépend du message exact reçu, de l'étape concernée et de la dernière version envoyée. ORÉE ne peut pas garantir l'acceptation d'une correction.",
    costContext: "Le coût d'une reprise ne peut être défini qu'après qualification du blocage et du travail déjà effectué.",
    timing: "Toute échéance mentionnée par l'organisme doit être identifiée avant de prioriser la vérification.",
    documents: ["Message ou demande exacte reçue", "Étape actuelle de la formalité", "Liste des versions déjà transmises", "Échéance éventuelle communiquée"],
  },
};

export default function AcquisitionLandingPage({ slug }: { slug: string }) {
  const content = landingPages[slug] ?? landingPages["creation-sasu"]!;
  const operational = operationalBySlug[slug] ?? operationalBySlug["creation-sasu"]!;
  const heroImage = landingHeroBySlug[slug] ?? imagery.sasuHero;
  const reduce = useReducedMotion();
  const diagnosticHref = `/diagnostic?intent=${content.searchIntent}`;
  usePageMeta(content.eyebrow, content.description);

  useEffect(() => {
    analytics.track("landing_view", { path: `/${slug}`, slug, intent: content.searchIntent, pageType: "acquisition" });
  }, [content.searchIntent, slug]);

  return (
    <>
      <section className="hero-grid surface-noise relative overflow-hidden bg-[var(--ink)] pb-16 pt-32 text-white sm:pb-22 sm:pt-40 lg:min-h-[735px] lg:pb-24 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(36,87,255,.2),transparent_31%),radial-gradient(circle_at_82%_32%,rgba(70,214,166,.1),transparent_30%)]" />
        <div className="container-shell relative grid items-center gap-12 lg:grid-cols-[1.04fr_.96fr]">
          <div>
            <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><Badge className="border-white/12 bg-white/[.06] text-white/72"><span className="size-1.5 rounded-full bg-[var(--mint)]" />{content.eyebrow}</Badge></motion.div>
            <motion.h1 initial={reduce ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .06, duration: .7, ease: [0.22, 1, 0.36, 1] }} className="mt-6 max-w-[850px] text-balance text-[clamp(2.65rem,5.55vw,5.9rem)] font-semibold leading-[.92] tracking-[-.06em]">{content.title} <span className="editorial-mark text-[color:var(--mint)]">{content.highlight}</span></motion.h1>
            <motion.p initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15, duration: .58 }} className="mt-6 max-w-2xl text-pretty text-base leading-8 text-white/72 sm:text-lg">{content.description}</motion.p>
            <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .22, duration: .58 }} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to={diagnosticHref} onClick={() => analytics.track("primary_cta_clicked", { slug, intent: content.searchIntent, location: "hero" })} variant="dark" size="lg" className="w-full sm:w-auto" arrow>{content.primaryCta}</ButtonLink>
              <ButtonLink to={content.secondaryHref} variant="ghost" size="lg" className="hidden border border-white/12 text-white hover:bg-white/[.08] sm:inline-flex">{content.secondaryCta}</ButtonLink>
            </motion.div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2.5 text-[11px] font-semibold text-white/72 sm:text-xs">{content.proofPoints.map((point) => <span key={point} className="flex items-center gap-2"><span className="grid size-4 place-items-center rounded-full bg-[var(--mint)] text-[color:var(--ink)]"><Check className="size-2.5" /></span>{point}</span>)}</div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs"><Link to="/tarifs" className="inline-flex items-center gap-1.5 text-[color:var(--mint)]">Comprendre les coûts <ChevronRight className="size-3.5" /></Link><a href="#perimetre" className="inline-flex items-center gap-1.5 text-white/72">Voir qui fait quoi <ChevronRight className="size-3.5" /></a></div>
          </div>

          <HeroMedia asset={heroImage} contentClassName="pb-2 sm:pb-3">
            <div className="w-full origin-bottom scale-[.91] sm:scale-[.84] lg:scale-[.8]">
              <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-white/[.05] p-3 shadow-[0_38px_110px_rgba(11,18,32,.3)] backdrop-blur-2xl sm:p-4">
                <div className="relative rounded-[22px] border border-white/8 bg-[var(--ink)] p-5 sm:p-6">
                  <div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.13em] text-white/72">Votre prochain parcours</p><p className="mt-2 text-xl font-semibold tracking-[-.035em]">Orientation indicative</p></div><span className="grid size-11 place-items-center rounded-[14px] bg-[var(--mint)] text-[color:var(--ink)]"><Sparkles className="size-4.5" /></span></div>
                  <div className="mt-6 space-y-2.5">{["Situation et niveau d'avancement", "Associés et organisation", "Activité, clients et calendrier", "Priorités et points à valider"].map((label, index) => <div key={label} className={`flex items-center gap-3 rounded-[15px] border p-3 ${index === 0 ? "border-[var(--blue)]/35 bg-[var(--blue)]/12" : "border-white/7 bg-white/[.035]"}`}><span className={`grid size-8 place-items-center rounded-full text-[10px] font-semibold ${index === 0 ? "bg-[var(--blue)] text-white" : "bg-white/7 text-white/72"}`}>0{index + 1}</span><span className="text-xs font-semibold text-white/72 sm:text-sm">{label}</span></div>)}</div>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2"><div className="rounded-[15px] border border-white/7 bg-white/[.035] p-3.5"><ListChecks className="size-4 text-[color:var(--blue)]" /><p className="mt-3 text-xs font-semibold">Étapes courtes</p><p className="mt-1 text-[10px] leading-4 text-white/72">Retour possible sans perdre les choix non sensibles.</p></div><div className="rounded-[15px] border border-white/7 bg-white/[.035] p-3.5"><LockKeyhole className="size-4 text-[color:var(--mint)]" /><p className="mt-3 text-xs font-semibold">Sans document au départ</p><p className="mt-1 text-[10px] leading-4 text-white/72">Commencez par décrire le projet.</p></div></div>
                  <div className="mt-3 rounded-[15px] bg-[var(--paper)] p-4 text-[color:var(--ink)]"><div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--mint-soft)]"><ShieldCheck className="size-4" /></span><div><p className="text-xs font-semibold">Orientation prudente</p><p className="mt-1 text-[11px] leading-5 text-[color:var(--muted)]">Les validations professionnelles ou officielles restent signalées.</p></div></div></div>
                </div>
              </div>
            </div>
          </HeroMedia>
        </div>
      </section>

      <Section className="pt-14 sm:pt-18">
        <div className="container-shell">
          <SectionHeader eyebrow="Réponse directe" title={<>Ce qu’il faut savoir <span className="editorial-mark text-[color:var(--blue)]">pour cette situation.</span></>} description={operational.quickAnswer} />
          <div className="grid gap-4 lg:grid-cols-3">
            <Reveal><article className="h-full rounded-[20px] border border-[var(--line)] bg-white p-6"><span className="grid size-11 place-items-center rounded-[14px] bg-[var(--ink)] text-white"><ReceiptText className="size-4.5" /></span><h2 className="mt-6 text-xl font-semibold">Coût à lire en trois lignes</h2><p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{operational.costContext}</p><Link to="/tarifs" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--blue)]">Voir le cadre tarifaire <ChevronRight className="size-4" /></Link></article></Reveal>
            <Reveal delay={.05}><article className="h-full rounded-[20px] border border-[var(--line)] bg-white p-6"><span className="grid size-11 place-items-center rounded-[14px] bg-[var(--mint-soft)]"><Clock3 className="size-4.5" /></span><h2 className="mt-6 text-xl font-semibold">Calendrier sans garantie artificielle</h2><p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{operational.timing}</p></article></Reveal>
            <Reveal delay={.1}><article className="h-full rounded-[20px] border border-[var(--line)] bg-[var(--paper)] p-6"><span className="grid size-11 place-items-center rounded-[14px] bg-[var(--blue)] text-white"><FileText className="size-4.5" /></span><h2 className="mt-6 text-xl font-semibold">Informations à anticiper</h2><ul className="mt-4 space-y-2.5">{operational.documents.map((item) => <li key={item} className="flex gap-2.5 text-sm leading-6 text-[color:var(--muted)]"><Check className="mt-1 size-3.5 shrink-0 text-[color:var(--success)]" />{item}</li>)}</ul></article></Reveal>
          </div>
        </div>
      </Section>

      <Section className="bg-white/55">
        <div className="container-shell">
          <SectionHeader eyebrow="Points d'attention" title={<>Les décisions à examiner <span className="editorial-mark text-[color:var(--blue)]">avant de constituer le dossier.</span></>} description="Le parcours explique les conséquences pratiques et signale les sujets qui nécessitent une validation complémentaire." />
          <div className="grid gap-4 lg:grid-cols-3">{content.painPoints.map((item, index) => <Reveal key={item.title} delay={index * .05}><article className="h-full rounded-[20px] border border-[var(--line)] bg-[var(--paper)] p-6"><span className="grid size-11 place-items-center rounded-[14px] bg-[var(--blue)]/8 text-[color:var(--blue)]"><CircleAlert className="size-5" /></span><h3 className="mt-5 text-xl font-semibold tracking-[-.03em]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{item.description}</p></article></Reveal>)}</div>
        </div>
      </Section>

      {content.legalForms?.length ? <Section><div className="container-shell"><SectionHeader eyebrow="Comparaison contextuelle" title={<>Les pistes principales, <span className="editorial-mark text-[color:var(--blue)]">sans raccourci.</span></>} description="La comparaison explique les différences et les points à confirmer au lieu d'afficher un gagnant automatique." /><LegalFormCards codes={content.legalForms} /></div></Section> : null}

      <Section className="bg-white/55">
        <div className="container-shell">
          <SectionHeader eyebrow="Parcours guidé" title={<>Quatre temps pour passer de l'intention <span className="editorial-mark text-[color:var(--blue)]">au projet organisé.</span></>} />
          <div className="grid gap-4 lg:grid-cols-4">{content.steps.map((item, index) => <Reveal key={item.number} delay={index * .05}><article className="group h-full rounded-[20px] border border-[var(--line)] bg-[var(--paper)] p-6"><div className="flex items-center justify-between"><span className="text-4xl font-semibold tracking-[-.06em] text-[color:var(--ink)]/12">{item.number}</span><ChevronRight className="size-5 text-[color:var(--muted)] transition group-hover:translate-x-1 group-hover:text-[color:var(--blue)]" /></div><h3 className="mt-7 text-lg font-semibold tracking-[-.03em]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{item.description}</p></article></Reveal>)}</div>
        </div>
      </Section>

      {slug === "creer-entreprise-seul" || slug === "creation-sasu" || slug === "creation-eurl" ? <Section className="py-10"><div className="container-shell"><div className="rounded-[20px] border border-[var(--line)] bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6"><div><p className="text-sm font-semibold">Vous recherchez uniquement l’ouverture gratuite d’une micro-entreprise ?</p><p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">Cette démarche ne nécessite pas toujours un accompagnement de création de société. Consultez d’abord les informations officielles adaptées.</p></div><a href="https://www.autoentrepreneur.urssaf.fr/" onClick={() => analytics.track("micro_intent_self_filtered", { slug })} target="_blank" rel="noreferrer" className="mt-4 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[color:var(--blue)] sm:mt-0">Voir l’information officielle <ChevronRight className="size-4" /></a></div></div></Section> : null}

      <Section id="perimetre"><div className="container-shell"><ServiceScope compact /></div></Section>

      <Section className="overflow-hidden bg-[var(--ink)] text-white"><div className="absolute inset-0 hero-grid opacity-40" /><div className="container-shell relative grid items-center gap-12 lg:grid-cols-[.72fr_1.28fr]"><div><Badge className="border-white/12 bg-white/[.06] text-white/72">Après le diagnostic</Badge><h2 className="mt-6 text-balance text-[clamp(2.6rem,4.7vw,5.2rem)] font-semibold leading-[.98] tracking-[-.055em]">Une synthèse qui peut ouvrir <span className="editorial-mark text-[color:var(--mint)]">un projet structuré.</span></h2><p className="mt-6 text-base leading-8 text-white/72">La démonstration illustre la fiche projet, les documents, les messages et la prochaine action. Les données réelles relèvent ensuite du mode connecté sécurisé.</p><ButtonLink to="/app" variant="dark" className="mt-8" arrow>Explorer l'espace démo</ButtonLink></div><DashboardPreview /></div></Section>

      <Section><div className="container-shell grid gap-12 lg:grid-cols-[.72fr_1.28fr]"><div className="lg:sticky lg:top-28 lg:self-start"><Badge>Questions fréquentes</Badge><h2 className="mt-6 text-4xl font-semibold leading-[1] tracking-[-.05em] sm:text-5xl">Les réponses essentielles avant de commencer.</h2><p className="mt-5 text-base leading-7 text-[color:var(--muted)]">Le fonctionnement général, les limites de l'orientation et les validations qui peuvent rester nécessaires.</p></div><Faq items={content.faq} /></div></Section>

      <Section className="pt-0"><div className="container-shell"><div className="relative overflow-hidden rounded-[26px] bg-[var(--ink)] px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16"><div className="relative grid items-end gap-8 lg:grid-cols-[1fr_auto]"><div><Badge className="border-white/10 bg-white/[.06] text-white/72">Votre prochaine étape</Badge><h2 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1] tracking-[-.05em] sm:text-5xl">Précisez votre situation pour obtenir une orientation argumentée.</h2></div><ButtonLink to={diagnosticHref} onClick={() => analytics.track("primary_cta_clicked", { slug, intent: content.searchIntent, location: "final" })} variant="dark" size="lg" arrow>{content.primaryCta}</ButtonLink></div></div></div></Section>
    </>
  );
}
