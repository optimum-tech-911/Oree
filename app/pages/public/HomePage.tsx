import { useState } from "react";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Command,
  FileCheck2,
  Fingerprint,
  LockKeyhole,
  MessageSquareText,
  RefreshCcw,
  Scale,
  ShieldCheck,
  Sparkles,
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
import { Reveal } from "@/components/marketing/Reveal";
import { EcosystemRail } from "@/components/marketing/EcosystemRail";
import { PathwayMediaSwitcher } from "@/components/media/PathwayMediaSwitcher";
import { DynamicHeroCarousel } from "@/components/marketing/DynamicHeroCarousel";
import { imagery } from "@/content/imagery";
import { usePageMeta } from "@/hooks/usePageMeta";

const audiencePaths = [
  { id: "solo", icon: Fingerprint, asset: imagery.soloPathway, title: "Je crée seul", short: "SASU · EURL · EI", description: "Comparez les structures unipersonnelles et organisez votre dossier avant de retenir une option.", href: "/creer-entreprise-seul", action: "Comparer les options", points: ["Situation actuelle", "Mode de rémunération", "Évolution future"] },
  { id: "team", icon: UsersRound, asset: imagery.sasHero, title: "Nous créons à plusieurs", short: "SAS · SARL", description: "Alignez associés, capital, responsabilités et documents dans le même parcours.", href: "/creer-entreprise-a-plusieurs", action: "Préparer le projet", points: ["Répartition du capital", "Rôles des associés", "Pièces par personne"] },
  { id: "employee", icon: BriefcaseBusiness, asset: imagery.employeeHero, title: "Je suis encore salarié", short: "Transition", description: "Préparez le projet maintenant, sauvegardez votre progression et créez au bon moment.", href: "/creer-entreprise-en-etant-salarie", action: "Construire ma feuille de route", points: ["Création immédiate ou progressive", "Calendrier sécurisé", "Rendez-vous adapté"] },
  { id: "existing", icon: RefreshCcw, asset: imagery.existingBusinessHero, title: "Mon activité existe déjà", short: "Micro → société", description: "Étudiez le passage d'une micro-entreprise ou d'une EI vers une société adaptée à la croissance.", href: "/passer-micro-entreprise-en-societe", action: "Étudier la transition", points: ["Activité déjà facturée", "Besoins de croissance", "Structure cible"] },
  { id: "blocked", icon: FileCheck2, asset: imagery.blockedDossierHero, title: "Mon dossier est bloqué", short: "Reprise", description: "Situez la demande, reliez les pièces concernées et organisez la correction.", href: "/dossier-creation-entreprise-bloque", action: "Faire le point", points: ["Motif du blocage", "Pièces concernées", "Action prioritaire"] },
  { id: "unknown", icon: Scale, asset: imagery.chooseStatusHero, title: "Je cherche le bon statut", short: "Diagnostic", description: "Obtenez une orientation indicative fondée sur votre situation réelle et vos priorités.", href: "/diagnostic", action: "Démarrer le diagnostic", points: ["Nombre d'associés", "Protection et fiscalité", "Projet de développement"] },
];

const safeguards = [
  { icon: ShieldCheck, title: "Un état visible", description: "Chaque information et chaque document conservent un statut compréhensible." },
  { icon: LockKeyhole, title: "Des données privées", description: "Architecture prévue pour stockage privé, RLS et accès strictement contrôlés." },
  { icon: UserRoundCheck, title: "Une équipe accessible", description: "Les demandes de l'équipe et la prochaine action restent accessibles dans le projet." },
  { icon: MessageSquareText, title: "Des échanges contextualisés", description: "Chaque message peut être relié au projet, à une étape ou à un document." },
];

const faqs = [
  { question: "Dois-je déjà savoir quelle société créer ?", answer: "Non. Le diagnostic commence par votre situation, votre activité, vos associés éventuels et vos priorités. Les structures apparaissent ensuite comme des pistes à comparer, jamais comme une réponse automatique définitive." },
  { question: "Puis-je commencer sans créer de compte ?", answer: "Oui. Vous pouvez avancer dans le diagnostic et obtenir une première orientation avant de créer un compte. L'inscription devient utile pour sauvegarder sur plusieurs appareils, démarrer le dossier, téléverser des documents ou inviter un associé." },
  { question: "La plateforme remplace-t-elle un conseil juridique ?", answer: "Non. Elle organise les informations, explique le parcours et met en évidence les points à valider. Les recommandations personnalisées et les actes nécessitant une compétence réglementée doivent être confirmés par un professionnel habilité." },
  { question: "Comment suivre l'avancement après le formulaire ?", answer: "Une fois le projet enregistré, l'espace client affiche la prochaine action, les informations manquantes, les documents, les messages, les rendez-vous et une chronologie complète." },
  { question: "Comment fonctionne le Guide Orée ?", answer: "Le Guide interroge un index local et auditable des pages, des contenus et des actions disponibles. Il peut retrouver une information, proposer plusieurs parcours et ouvrir la rubrique correspondante sans recourir à un service payant." },
];

function openAssistant() {
  window.dispatchEvent(new CustomEvent("oree:assistant-open"));
}

export default function HomePage() {
  usePageMeta("Créez votre société avec clarté", "Diagnostic adaptatif, espace projet et accompagnement humain pour structurer votre création d'entreprise.");
  const [activePath, setActivePath] = useState(audiencePaths[0]!);
  return (
    <>
      <DynamicHeroCarousel />

      <EcosystemRail />

      <Section id="parcours" className="pt-16 sm:pt-20">
        <div className="container-shell">
          <SectionHeader eyebrow="Votre point de départ" title={<>Un parcours adapté à <span className="editorial-mark text-[color:var(--blue)]">votre niveau d'avancement.</span></>} description="La plateforme recueille d'abord les éléments du projet avant de présenter les structures qui méritent d'être comparées." />
          <div className="grid gap-4 lg:grid-cols-[.72fr_1.28fr]">
            <div className="rounded-[32px] border border-[var(--line)] bg-white p-2 shadow-[0_22px_70px_rgba(11,18,32,.07)]">
              {audiencePaths.map((item) => {
                const Icon = item.icon;
                const active = item.id === activePath.id;
                return (
                  <button key={item.id} type="button" onMouseEnter={() => setActivePath(item)} onFocus={() => setActivePath(item)} onClick={() => setActivePath(item)} className={`group flex w-full items-center gap-3 rounded-[18px] border p-3.5 text-left transition duration-300 sm:p-4 ${active ? "border-[var(--action)] bg-[var(--action)] text-white shadow-[0_12px_30px_rgba(36,87,255,.18)]" : "border-transparent hover:bg-[var(--ink)]/[.035]"}`}>
                    <span className={`grid size-11 shrink-0 place-items-center rounded-[14px] transition ${active ? "bg-white text-[color:var(--ink)]" : "bg-[var(--paper)] text-[color:var(--ink)] group-hover:bg-white"}`}><Icon className="size-4.5" /></span>
                    <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="font-extrabold tracking-[-.025em]">{item.title}</p><span className={`hidden text-[9px] font-extrabold uppercase tracking-[.12em] sm:block ${active ? "text-[color:var(--mint)]" : "text-[color:var(--muted)]"}`}>{item.short}</span></div><p className={`mt-1 line-clamp-1 text-xs ${active ? "text-white/72" : "text-[color:var(--muted)]"}`}>{item.description}</p></div>
                    <ArrowRight className={`size-4 shrink-0 transition ${active ? "translate-x-0 text-white" : "-translate-x-1 text-[color:var(--muted)] group-hover:translate-x-0 group-hover:text-[color:var(--blue)]"}`} />
                  </button>
                );
              })}
            </div>

            <PathwayMediaSwitcher item={activePath} />
          </div>
        </div>
      </Section>

      <Section className="overflow-hidden bg-white/60">
        <div className="container-shell">
          <SectionHeader eyebrow="Le parcours" title={<>Une progression visible et <span className="editorial-mark text-[color:var(--blue)]">expliquée à chaque étape.</span></>} description="Chaque étape distingue les actions du porteur de projet, les contrôles de l'équipe et les traitements qui relèvent de l'administration." />
          <ProcessRail />
        </div>
      </Section>

      <Section>
        <div className="container-shell">
          <SectionHeader eyebrow="Orientation" title={<>Les structures à comparer, <span className="editorial-mark text-[color:var(--blue)]">au bon moment.</span></>} description="Le nombre d'associés n'est qu'un début. Le diagnostic prend aussi en compte le projet, le calendrier, l'existant et vos priorités." action={<ButtonLink to="/choisir-statut" variant="secondary" arrow>Voir le comparateur</ButtonLink>} />
          <LegalFormCards codes={["SASU", "EURL", "SAS", "SARL"]} />
        </div>
      </Section>

      <Section className="overflow-hidden bg-[var(--ink)] text-white">
        <div className="absolute inset-0 hero-grid opacity-45" />
        <div className="container-shell relative grid items-center gap-14 lg:grid-cols-[.82fr_1.18fr]">
          <div>
            <Badge className="border-white/12 bg-white/7 text-white/72"><Bot className="size-3.5 text-[color:var(--mint)]" />Guide Orée</Badge>
            <h2 className="mt-6 text-balance text-[clamp(2.9rem,5vw,5.9rem)] font-extrabold leading-[.92] tracking-[-.07em]">Une aide fondée sur <span className="editorial-mark text-[color:var(--mint)]">les contenus de la plateforme.</span></h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/72">Indiquez une démarche, un document, une étape ou une structure. Le Guide recherche les pages et les actions pertinentes, puis propose un accès direct à la bonne rubrique.</p>
            <button type="button" onClick={openAssistant} className="group mt-8 inline-flex h-12 items-center gap-3 rounded-[14px] bg-[var(--action)] px-5 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(36,87,255,.25)] transition hover:-translate-y-0.5 hover:brightness-[.94]"><span className="relative grid size-8 place-items-center rounded-full bg-[var(--mint)] text-[color:var(--ink)]"><Bot className="size-4" /><span className="assistant-pulse" /></span>Ouvrir le Guide Orée<ArrowRight className="size-4 transition group-hover:translate-x-1" /></button>
            <div className="mt-7 flex items-center gap-2 text-[10px] font-bold text-white/72"><Command className="size-3.5" />Raccourci clavier : ⌘ K ou Ctrl K</div>
          </div>

          <Reveal>
            <div className="relative rounded-[34px] border border-white/10 bg-white/[.045] p-3 shadow-[0_44px_130px_rgba(11,18,32,.32)] backdrop-blur-xl sm:p-4">
              <div className="rounded-[27px] bg-white p-4 text-[color:var(--ink)] sm:p-5">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-[14px] bg-[var(--ink)] text-[color:var(--mint)]"><Bot className="size-4.5" /></span><div><p className="text-sm font-extrabold">Guide Orée</p><p className="text-[10px] text-[color:var(--muted)]">Index de la plateforme connecté</p></div></div><span className="rounded-full bg-[var(--mint-soft)] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.11em]">Disponible</span></div>
                <div className="mt-5 rounded-[22px] bg-[var(--paper)] p-4"><p className="text-sm leading-7">« Je suis salarié, je veux créer seul mais je ne sais pas par quoi commencer. »</p></div>
                <div className="mt-3 rounded-[22px] bg-[var(--ink)] p-5 text-white"><div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-[color:var(--mint)]"><Sparkles className="size-3.5" />Réponse contextualisée</div><p className="mt-4 text-sm leading-7 text-white/68">Commencez par le parcours salarié. Il vous permettra de préciser le calendrier, la conservation éventuelle de votre emploi et les structures unipersonnelles à comparer.</p><div className="mt-4 grid gap-2 sm:grid-cols-2"><div className="rounded-[15px] bg-white px-3 py-3 text-xs font-extrabold text-[color:var(--ink)]">Ouvrir le parcours salarié</div><div className="rounded-[15px] border border-white/10 px-3 py-3 text-xs font-extrabold text-white">Comparer SASU / EURL</div></div></div>
                <div className="mt-3 flex items-center gap-3 rounded-[18px] border border-[var(--line)] px-4 py-3 text-xs text-[color:var(--muted)]"><span className="size-2 rounded-full bg-[var(--mint)]" />Écrivez ou prononcez ce que vous cherchez…<ArrowRight className="ml-auto size-4 text-[color:var(--ink)]" /></div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="overflow-hidden">
        <div className="container-shell grid items-center gap-14 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <Badge>Après le diagnostic</Badge>
            <h2 className="mt-6 text-balance text-[clamp(2.8rem,5vw,5.8rem)] font-extrabold leading-[.94] tracking-[-.07em]">Le diagnostic ouvre <span className="editorial-mark text-[color:var(--blue)]">un projet structuré.</span></h2>
            <p className="mt-6 text-lg leading-8 text-[color:var(--muted)]">Le résultat alimente la fiche projet, la liste documentaire, les messages et la prochaine action. Les informations déjà fournies restent disponibles dans la suite du parcours.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">{safeguards.map((item) => { const Icon = item.icon; return <div key={item.title} className="flex gap-3 rounded-[20px] border border-[var(--line)] bg-white p-4"><span className="grid size-9 shrink-0 place-items-center rounded-[13px] bg-[var(--mint-soft)]"><Icon className="size-4" /></span><div><p className="text-xs font-extrabold">{item.title}</p><p className="mt-1 text-[10px] leading-5 text-[color:var(--muted)]">{item.description}</p></div></div>; })}</div>
            <ButtonLink to="/app" variant="accent" className="mt-8" arrow>Explorer l'espace démo</ButtonLink>
          </div>
          <DashboardPreview />
        </div>
      </Section>

      <Section className="bg-white/60">
        <div className="container-shell grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div className="lg:sticky lg:top-28 lg:self-start"><Badge>Questions fréquentes</Badge><h2 className="mt-6 text-4xl font-extrabold leading-[.98] tracking-[-.065em] sm:text-5xl">Les informations essentielles avant de commencer.</h2><p className="mt-5 text-base leading-7 text-[color:var(--muted)]">Ces réponses présentent le fonctionnement général du service et les limites de l'orientation proposée.</p></div>
          <Faq items={faqs} />
        </div>
      </Section>

      <Section className="pt-0">
        <div className="container-shell">
          <div className="relative overflow-hidden rounded-[40px] bg-[var(--ink)] px-6 py-14 text-white shadow-[0_35px_110px_rgba(11,18,32,.22)] sm:px-10 lg:px-16 lg:py-20">
            <div className="absolute inset-0 hero-grid opacity-45" />
            <div className="relative grid items-end gap-10 lg:grid-cols-[1fr_auto]"><div><Badge className="border-white/10 bg-white/7 text-white/72">Votre prochaine étape</Badge><h2 className="mt-6 max-w-4xl text-balance text-4xl font-extrabold leading-[.94] tracking-[-.07em] sm:text-5xl lg:text-6xl">Déterminez le parcours adapté avant d'engager les formalités.</h2><p className="mt-5 max-w-2xl text-base leading-7 text-white/72">Décrivez votre situation. La plateforme organise les étapes suivantes et rend visibles les décisions qui restent à confirmer.</p></div><div className="flex flex-col gap-3"><ButtonLink to="/diagnostic" variant="dark" size="lg" arrow>Démarrer maintenant</ButtonLink><button type="button" onClick={openAssistant} className="text-sm font-extrabold text-white/72 transition hover:text-white">Poser une question au Guide</button></div></div>
          </div>
        </div>
      </Section>
    </>
  );
}
