import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CircleHelp,
  FileCheck2,
  Fingerprint,
  Handshake,
  LockKeyhole,
  MessageSquareText,
  RefreshCcw,
  Scale,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ProcessRail } from "@/components/marketing/ProcessRail";
import { LegalFormCards } from "@/components/marketing/LegalFormCards";
import { DashboardPreview } from "@/components/marketing/DashboardPreview";
import { Faq } from "@/components/marketing/Faq";
import { EcosystemRail } from "@/components/marketing/EcosystemRail";
import { HomeConversionHero } from "@/components/marketing/HomeConversionHero";
import { ActivitySpotlight } from "@/components/marketing/ActivitySpotlight";
import { DirectContactPanel } from "@/components/marketing/DirectContactPanel";
import { CostClarity } from "@/components/marketing/CostClarity";
import { ServiceScope } from "@/components/marketing/ServiceScope";
import { PathwayMediaSwitcher } from "@/components/media/PathwayMediaSwitcher";
import { ArtDirectedPicture } from "@/components/media/ArtDirectedPicture";
import { imagery } from "@/content/imagery";
import { usePageMeta } from "@/hooks/usePageMeta";
import { analytics } from "@/services/analytics";

const audiencePaths = [
  { id: "solo", icon: Fingerprint, asset: imagery.homeFounderPathway, title: "Je crée seul", short: "SASU · EURL · EI", description: "Comparez les structures unipersonnelles et organisez votre dossier avant de retenir une option.", href: "/creer-entreprise-seul", action: "Comparer les options", points: ["Situation actuelle", "Mode de rémunération", "Évolution future"] },
  { id: "team", icon: UsersRound, asset: imagery.foundersDiscussionPathway, title: "Nous créons à plusieurs", short: "SAS · SARL", description: "Alignez associés, capital, responsabilités et documents dans le même parcours.", href: "/creer-entreprise-a-plusieurs", action: "Préparer le projet", points: ["Répartition du capital", "Rôles des associés", "Pièces par personne"] },
  { id: "employee", icon: BriefcaseBusiness, asset: imagery.employeeHero, title: "Je suis encore salarié", short: "Transition", description: "Préparez le projet maintenant et choisissez le moment adapté pour engager les formalités.", href: "/creer-entreprise-en-etant-salarie", action: "Construire ma feuille de route", points: ["Création immédiate ou progressive", "Contraintes à vérifier", "Calendrier du projet"] },
  { id: "job-seeker", icon: CircleHelp, asset: imagery.chooseStatusHero, title: "Je suis demandeur d’emploi", short: "Calendrier à cadrer", description: "Situez la création dans votre calendrier et identifiez les dispositifs à vérifier auprès des organismes compétents.", href: "/creer-entreprise-demandeur-emploi", action: "Cadrer mon calendrier", points: ["Dates de démarches", "Rémunération envisagée", "Éligibilité à confirmer"] },
  { id: "existing", icon: RefreshCcw, asset: imagery.existingBusinessHero, title: "Mon activité existe déjà", short: "Micro → société", description: "Étudiez le passage d'une micro-entreprise ou d'une EI vers une société adaptée au projet.", href: "/passer-micro-entreprise-en-societe", action: "Étudier la transition", points: ["Activité déjà facturée", "Continuité des contrats", "Structure cible"] },
  { id: "blocked", icon: FileCheck2, asset: imagery.blockedDossierHero, title: "Mon dossier est bloqué", short: "Reprise", description: "Situez la demande, reliez les pièces concernées et organisez la prochaine vérification.", href: "/dossier-creation-entreprise-bloque", action: "Faire le point", points: ["Motif du blocage", "Pièces concernées", "Action prioritaire"] },
  { id: "unknown", icon: Scale, asset: imagery.chooseStatusHero, title: "Je cherche le bon statut", short: "Diagnostic", description: "Obtenez une orientation indicative fondée sur votre situation réelle et vos priorités.", href: "/diagnostic", action: "Démarrer le diagnostic", points: ["Nombre d'associés", "Protection et fiscalité", "Projet de développement"] },
];

const safeguards = [
  { icon: ShieldCheck, title: "Un état visible", description: "Chaque information et document conserve un statut compréhensible." },
  { icon: LockKeyhole, title: "Des accès contrôlés", description: "Le mode connecté repose sur stockage privé, RLS et droits limités." },
  { icon: UserRoundCheck, title: "Une prochaine action", description: "Le projet indique ce qui doit être complété, vérifié ou attendu." },
  { icon: MessageSquareText, title: "Un contexte conservé", description: "Les échanges peuvent être reliés à une étape ou à un document." },
];

const faqs = [
  { question: "Dois-je déjà savoir quelle société créer ?", answer: "Non. Le diagnostic commence par votre situation, votre activité, vos associés éventuels et vos priorités. Les structures apparaissent ensuite comme des pistes à comparer, jamais comme une réponse automatique définitive." },
  { question: "Puis-je commencer sans créer de compte ?", answer: "Oui. Vous pouvez avancer dans le diagnostic et obtenir une première orientation avant de créer un compte. L'inscription devient utile pour poursuivre le dossier dans l'espace connecté." },
  { question: "Comment sont présentés les coûts ?", answer: "Les honoraires ORÉE, les frais légaux applicables et les éventuelles prestations tierces doivent apparaître séparément dans un devis validé avant engagement." },
  { question: "La plateforme remplace-t-elle un conseil juridique ?", answer: "Non. Elle organise les informations, explique le parcours et met en évidence les points à valider. Les recommandations personnalisées et actes réglementés nécessitent l'intervention d'un professionnel habilité." },
  { question: "Que se passe-t-il si mon dossier est déjà bloqué ?", answer: "Un parcours distinct permet de situer l'étape et la demande reçue. Il organise la vérification sans promettre qu'une correction sera automatiquement acceptée par l'organisme compétent." },
];

function openAssistant() {
  window.dispatchEvent(new CustomEvent("oree:assistant-open"));
}

export default function HomePage() {
  usePageMeta("Créez votre société avec clarté", "Diagnostic adaptatif, dossier structuré et prochaine action visible pour votre projet de société.");
  const [activePath, setActivePath] = useState(audiencePaths[0]!);

  useEffect(() => {
    analytics.track("landing_view", { path: "/", pageType: "home" });
  }, []);

  return (
    <>
      <HomeConversionHero />

      <EcosystemRail />

      <Section id="parcours" className="pt-16 sm:pt-20">
        <div className="container-shell">
          <SectionHeader eyebrow="Votre point de départ" title={<>Commencez par votre situation, <span className="editorial-mark text-[color:var(--blue)]">pas par un statut.</span></>} description="Choisissez le contexte qui ressemble le plus au vôtre. Chaque entrée conserve son intention jusqu'au diagnostic." />
          <div className="grid gap-4 lg:grid-cols-[.72fr_1.28fr]">
            <div className="rounded-[24px] border border-[var(--line)] bg-white p-2 shadow-[0_16px_48px_rgba(11,18,32,.055)]">
              {audiencePaths.map((item) => {
                const Icon = item.icon;
                const active = item.id === activePath.id;
                return (
                  <button key={item.id} type="button" onMouseEnter={() => setActivePath(item)} onFocus={() => setActivePath(item)} onClick={() => setActivePath(item)} className={`group flex min-h-15 w-full items-center gap-3 rounded-[15px] border p-3 text-left transition duration-300 ${active ? "border-[var(--action)] bg-[var(--action)] text-white shadow-[0_10px_26px_rgba(36,87,255,.16)]" : "border-transparent hover:bg-[var(--ink)]/[.035]"}`}>
                    <span className={`grid size-10 shrink-0 place-items-center rounded-[12px] transition ${active ? "bg-white text-[color:var(--ink)]" : "bg-[var(--paper)] text-[color:var(--ink)] group-hover:bg-white"}`}><Icon className="size-4" /></span>
                    <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="font-semibold tracking-[-.02em]">{item.title}</p><span className={`hidden text-[9px] font-semibold uppercase tracking-[.1em] sm:block ${active ? "text-[color:var(--mint)]" : "text-[color:var(--muted)]"}`}>{item.short}</span></div><p className={`mt-1 line-clamp-1 text-xs ${active ? "text-white/72" : "text-[color:var(--muted)]"}`}>{item.description}</p></div>
                    <ArrowRight className={`size-4 shrink-0 transition ${active ? "text-white" : "-translate-x-1 text-[color:var(--muted)] group-hover:translate-x-0 group-hover:text-[color:var(--blue)]"}`} />
                  </button>
                );
              })}
            </div>
            <PathwayMediaSwitcher item={activePath} />
          </div>
        </div>
      </Section>

      <Section className="overflow-hidden bg-white/55">
        <div className="container-shell"><ActivitySpotlight /></div>
      </Section>

      <Section className="overflow-hidden bg-white/55">
        <div className="container-shell">
          <SectionHeader eyebrow="Le parcours" title={<>De l’orientation au suivi, <span className="editorial-mark text-[color:var(--blue)]">avec une action suivante.</span></>} description="Chaque étape distingue vos actions, les contrôles du service et ce qui dépend d'un organisme extérieur." />
          <ProcessRail />
        </div>
      </Section>

      <Section>
        <div className="container-shell grid items-center gap-14 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <Badge>Le produit, pas seulement un formulaire</Badge>
            <h2 className="mt-6 text-balance text-[clamp(2.7rem,4.8vw,5.4rem)] font-semibold leading-[.98] tracking-[-.055em]">Votre projet devient <span className="editorial-mark text-[color:var(--blue)]">un centre de pilotage.</span></h2>
            <p className="mt-6 text-base leading-8 text-[color:var(--muted)]">Le diagnostic structure la fiche projet, la liste documentaire, les messages et la prochaine action. La démonstration permet d'examiner cette continuité avant connexion à Supabase.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">{safeguards.map((item) => { const Icon = item.icon; return <div key={item.title} className="flex gap-3 rounded-[18px] border border-[var(--line)] bg-white p-4"><span className="grid size-9 shrink-0 place-items-center rounded-[12px] bg-[var(--mint-soft)]"><Icon className="size-4" /></span><div><p className="text-xs font-semibold">{item.title}</p><p className="mt-1 text-[10px] leading-5 text-[color:var(--muted)]">{item.description}</p></div></div>; })}</div>
            <ButtonLink to="/app" variant="accent" className="mt-8" arrow>Explorer l'espace démo</ButtonLink>
          </div>
          <DashboardPreview />
        </div>
      </Section>

      <Section className="bg-white/55">
        <div className="container-shell">
          <SectionHeader eyebrow="Comparaison contextuelle" title={<>Les structures à examiner, <span className="editorial-mark text-[color:var(--blue)]">sans gagnant automatique.</span></>} description="Le nombre d'associés ouvre la comparaison. La rémunération, le calendrier, l'activité et les projets d'évolution permettent ensuite de l'expliquer." action={<ButtonLink to="/choisir-statut" variant="secondary" arrow>Voir le comparateur</ButtonLink>} />
          <LegalFormCards codes={["SASU", "EURL", "SAS", "SARL"]} />
        </div>
      </Section>

      <Section>
        <div className="container-shell"><ServiceScope /></div>
      </Section>

      <Section className="bg-white/55">
        <div className="container-shell"><CostClarity /></div>
      </Section>

      <Section>
        <div className="container-shell grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <figure className="relative min-h-[390px] overflow-hidden rounded-[24px] border border-[var(--line)] shadow-[0_20px_65px_rgba(11,18,32,.08)] sm:min-h-[480px]">
            <ArtDirectedPicture asset={imagery.adviserConsultation} sizes="(max-width: 1023px) 100vw, 44vw" className="absolute inset-0 size-full" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(11,18,32,.82))]" />
            <figcaption className="absolute bottom-5 left-5 right-5 rounded-[16px] border border-white/14 bg-[var(--ink)]/82 p-4 text-white backdrop-blur-md"><p className="text-[9px] font-semibold uppercase tracking-[.12em] text-[color:var(--mint)]">Scène illustrative</p><p className="mt-2 text-sm font-semibold">Un échange peut être demandé lorsque le diagnostic fait apparaître un point à confirmer.</p></figcaption>
          </figure>
          <div>
            <Badge><Handshake className="size-3.5" />Relais humain</Badge>
            <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1] tracking-[-.05em] sm:text-5xl lg:text-6xl">La plateforme prépare le contexte. <span className="editorial-mark text-[color:var(--blue)]">L’humain intervient au bon endroit.</span></h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--muted)]">Vous pouvez demander un échange pour reprendre les informations déjà structurées. La disponibilité, les compétences mobilisées et le périmètre d'intervention doivent être confirmés avant la prestation.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><ButtonLink to="/rendez-vous" variant="primary" arrow>Demander un échange</ButtonLink><ButtonLink to="/accompagnement" variant="secondary">Comprendre l'accompagnement</ButtonLink></div>
            <div className="mt-6 flex items-center gap-4 rounded-[18px] bg-[var(--ink)] p-4 text-white"><span className="grid size-10 shrink-0 place-items-center rounded-[13px] bg-[var(--mint)] text-[color:var(--ink)]"><Bot className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">Une question de navigation ?</p><p className="mt-1 text-xs text-white/72">Le Guide Orée retrouve une page ou une action dans l'index local.</p></div><button type="button" onClick={openAssistant} className="shrink-0 text-xs font-semibold text-[color:var(--mint)]">Ouvrir</button></div>
          </div>
        </div>
      </Section>

      <Section className="bg-white/55">
        <div className="container-shell"><DirectContactPanel /></div>
      </Section>

      <Section className="bg-white/55">
        <div className="container-shell grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div className="lg:sticky lg:top-28 lg:self-start"><Badge>Questions fréquentes</Badge><h2 className="mt-6 text-4xl font-semibold leading-[1] tracking-[-.05em] sm:text-5xl">Ce qu’il faut comprendre avant de commencer.</h2><p className="mt-5 text-base leading-7 text-[color:var(--muted)]">Fonctionnement, coûts, limites de l'orientation et reprise d'un dossier déjà engagé.</p></div>
          <Faq items={faqs} />
        </div>
      </Section>

      <Section className="pt-0">
        <div className="container-shell">
          <div className="relative overflow-hidden rounded-[26px] bg-[var(--ink)] px-6 py-12 text-white shadow-[0_24px_70px_rgba(11,18,32,.14)] sm:px-10 lg:px-14 lg:py-16">
            <div className="absolute inset-0 hero-grid opacity-40" />
            <div className="relative grid items-end gap-8 lg:grid-cols-[1fr_auto]"><div><Badge className="border-white/10 bg-white/[.06] text-white/72">Votre prochaine étape</Badge><h2 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[.98] tracking-[-.05em] sm:text-5xl">Décrivez votre situation avant d’engager les formalités.</h2><p className="mt-5 max-w-2xl text-base leading-7 text-white/72">La synthèse reste indicative et affiche les décisions qui nécessitent encore une confirmation.</p></div><ButtonLink to="/diagnostic" onClick={() => analytics.track("primary_cta_clicked", { path: "/", location: "final", intent: "general_orientation" })} variant="dark" size="lg" arrow>Faire le diagnostic</ButtonLink></div>
          </div>
        </div>
      </Section>
    </>
  );
}
