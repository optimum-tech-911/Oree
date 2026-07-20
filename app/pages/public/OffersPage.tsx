import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Check, CircleAlert, FileCheck2, ReceiptText, Scale, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { CostClarity } from "@/components/marketing/CostClarity";
import { Faq } from "@/components/marketing/Faq";
import { Reveal } from "@/components/marketing/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";
import { analytics } from "@/services/analytics";

const quoteChecks = [
  {
    icon: FileCheck2,
    title: "Ce qui est inclus",
    items: ["Étapes et livrables du service", "Nombre et nature des échanges", "Contrôles de complétude prévus", "Conditions d'accès à l'espace projet"],
  },
  {
    icon: Scale,
    title: "Ce qui reste hors périmètre",
    items: ["Décisions des organismes publics", "Délais administratifs non maîtrisés", "Conseil réglementé non expressément prévu", "Frais engagés directement auprès de tiers"],
  },
  {
    icon: ShieldCheck,
    title: "Ce qui nécessite votre accord",
    items: ["Toute option complémentaire", "Tout changement de périmètre", "Un éventuel abonnement et ses conditions", "La transmission nécessaire à un prestataire identifié"],
  },
];

const scopeBlocks = [
  ["Orientation", "Décrire la situation, comparer les pistes pertinentes et rendre visibles les points à confirmer."],
  ["Constitution", "Organiser les informations et pièces nécessaires dans un parcours suivi, selon le périmètre validé."],
  ["Reprise", "Reconstituer le contexte d'un dossier déjà engagé ou bloqué avant d'identifier la prochaine vérification."],
] as const;

export default function OffersPage() {
  const { pathname } = useLocation();
  usePageMeta("Tarifs et coûts", "Comprenez la séparation entre honoraires ORÉE, frais légaux et prestations tierces avant tout engagement.", { canonicalPath: "/tarifs" });

  useEffect(() => {
    analytics.track("landing_view", { path: pathname, pageType: "pricing" });
  }, [pathname]);

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-34 sm:pb-22 sm:pt-42 lg:pb-26">
        <div className="absolute inset-0 grid-fade opacity-65" />
        <div className="container-shell relative grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <Badge><ReceiptText className="size-3.5" />Tarifs et transparence</Badge>
            <h1 className="mt-6 max-w-5xl text-balance text-[clamp(2.8rem,6vw,6.5rem)] font-semibold leading-[.94] tracking-[-.06em]">Comprenez ce que vous payez <span className="editorial-mark text-[color:var(--blue)]">avant de vous engager.</span></h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-[color:var(--muted)] sm:text-lg">ORÉE doit distinguer le prix de son service, les frais légaux applicables et les éventuelles options. Aucun montant définitif n'est publié tant que la grille commerciale, la TVA et les inclusions ne sont pas validées.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/diagnostic" onClick={() => analytics.track("primary_cta_clicked", { path: pathname, location: "pricing_hero", intent: "scope_estimation" })} size="lg" arrow>Préciser mon besoin</ButtonLink>
              <ButtonLink to="/rendez-vous" variant="secondary" size="lg" className="hidden sm:inline-flex">Demander un échange</ButtonLink>
            </div>
          </div>
          <div className="rounded-[24px] border border-[var(--line)] bg-[var(--ink)] p-6 text-white shadow-[0_24px_80px_rgba(11,18,32,.15)] sm:p-8">
            <div className="flex items-center justify-between gap-5"><div><p className="text-[10px] font-semibold uppercase tracking-[.13em] text-white/72">Avant signature</p><h2 className="mt-3 text-2xl font-semibold tracking-[-.04em]">Le devis doit être lisible seul.</h2></div><span className="grid size-12 shrink-0 place-items-center rounded-[15px] bg-[var(--mint)] text-[color:var(--ink)]"><Check className="size-5" /></span></div>
            <ul className="mt-7 space-y-3">{["Prix TTC ou régime de TVA explicite", "Honoraires séparés des frais légaux", "Options et exclusions nommées", "Aucun délai administratif garanti"].map((item) => <li key={item} className="flex gap-3 rounded-[14px] border border-white/8 bg-white/[.04] p-3 text-sm text-white/78"><Check className="mt-0.5 size-4 shrink-0 text-[color:var(--mint)]" />{item}</li>)}</ul>
            <div className="mt-5 flex gap-3 rounded-[16px] border border-[var(--blue)]/28 bg-[var(--blue)]/12 p-4"><CircleAlert className="mt-0.5 size-4 shrink-0 text-white" /><p className="text-xs leading-6 text-white/72">Les montants ne seront affichés ici qu'après validation commerciale et juridique. Ce choix évite un faux prix d'appel.</p></div>
          </div>
        </div>
      </section>

      <Section className="bg-white/55 pt-14 sm:pt-18">
        <div className="container-shell"><CostClarity /></div>
      </Section>

      <Section>
        <div className="container-shell">
          <div className="max-w-4xl"><Badge>Composer le périmètre</Badge><h2 className="mt-6 text-balance text-4xl font-semibold leading-[1] tracking-[-.05em] sm:text-5xl lg:text-6xl">Le besoin se définit avant l'offre.</h2><p className="mt-5 max-w-2xl text-base leading-8 text-[color:var(--muted)]">Ces blocs décrivent des types d'intervention possibles, pas des forfaits ni des prix validés. Le diagnostic aide à identifier ceux qui sont réellement utiles.</p></div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">{scopeBlocks.map(([title, description], index) => <Reveal key={title} delay={index * .05}><article className="h-full rounded-[20px] border border-[var(--line)] bg-white p-6"><span className="text-4xl font-semibold text-[color:var(--ink)]/[.08]">0{index + 1}</span><h3 className="mt-7 text-2xl font-semibold tracking-[-.035em]">{title}</h3><p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{description}</p></article></Reveal>)}</div>
        </div>
      </Section>

      <Section className="bg-white/55">
        <div className="container-shell">
          <div className="max-w-4xl"><Badge>Contrôle du devis</Badge><h2 className="mt-6 text-balance text-4xl font-semibold leading-[1] tracking-[-.05em] sm:text-5xl">Ce que vous devez pouvoir vérifier en un coup d'œil.</h2></div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">{quoteChecks.map((block, index) => { const Icon = block.icon; return <Reveal key={block.title} delay={index * .05}><article className="h-full rounded-[20px] border border-[var(--line)] bg-[var(--paper)] p-6"><span className="grid size-11 place-items-center rounded-[14px] bg-[var(--ink)] text-white"><Icon className="size-4.5" /></span><h3 className="mt-6 text-xl font-semibold tracking-[-.03em]">{block.title}</h3><ul className="mt-5 space-y-3">{block.items.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[color:var(--muted)]"><Check className="mt-1 size-3.5 shrink-0 text-[color:var(--success)]" />{item}</li>)}</ul></article></Reveal>; })}</div>
        </div>
      </Section>

      <Section>
        <div className="container-shell grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div className="lg:sticky lg:top-28 lg:self-start"><Badge>Questions tarifaires</Badge><h2 className="mt-6 text-4xl font-semibold leading-[1] tracking-[-.05em] sm:text-5xl">Pas de petite ligne cachée dans une promesse globale.</h2><p className="mt-5 text-base leading-7 text-[color:var(--muted)]">Les réponses définitives dépendront de la grille commerciale validée et du devis propre au projet.</p></div>
          <Faq items={[
            { question: "Pourquoi aucun montant n'est-il encore affiché ?", answer: "La grille tarifaire, le traitement de la TVA, les inclusions et les éventuels frais avancés doivent être validés par ORÉE avant publication. Afficher une estimation non confirmée serait trompeur." },
            { question: "Les frais légaux seront-ils compris ?", answer: "Ils doivent apparaître sur une ligne distincte avec leur nature. Le montant dépend notamment de la structure, de la localisation et des formalités nécessaires." },
            { question: "Une option peut-elle être ajoutée ensuite ?", answer: "Oui uniquement après une information claire sur son utilité, son prix et ses conditions, suivie d'un accord explicite." },
            { question: "Le délai de l'administration peut-il être garanti ?", answer: "Non. Seuls des délais internes effectivement maîtrisés peuvent être annoncés. Les décisions et délais des organismes restent extérieurs au service." },
          ]} />
        </div>
      </Section>

      <Section className="pt-0">
        <div className="container-shell"><div className="rounded-[26px] bg-[var(--ink)] px-6 py-12 text-white sm:px-10 lg:flex lg:items-end lg:justify-between lg:gap-10 lg:px-14"><div><Badge className="border-white/10 bg-white/[.06] text-white/72">Étape suivante</Badge><h2 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1] tracking-[-.05em] sm:text-5xl">Cadrez le projet avant de demander un prix.</h2><p className="mt-5 max-w-2xl text-base leading-7 text-white/72">Le diagnostic permet d'identifier le parcours et les points qui peuvent modifier le périmètre.</p></div><ButtonLink to="/diagnostic" onClick={() => analytics.track("primary_cta_clicked", { path: pathname, location: "pricing_final", intent: "scope_estimation" })} variant="dark" size="lg" className="mt-8 shrink-0 lg:mt-0" arrow>Préciser mon besoin</ButtonLink></div></div>
      </Section>
    </>
  );
}
