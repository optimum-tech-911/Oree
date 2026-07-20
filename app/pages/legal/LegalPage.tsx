import { FileText, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { usePageMeta } from "@/hooks/usePageMeta";

const privacySections = [
  ["1. Responsable du traitement", "À compléter avec l'identité juridique, l'adresse et les coordonnées réelles du responsable du traitement avant la mise en production."],
  ["2. Données collectées", "Le parcours peut traiter des informations d'identification, de contact, de situation professionnelle, de projet, de rendez-vous, des messages et des documents nécessaires au service. Les données envoyées à des outils statistiques doivent être limitées et ne jamais contenir de pièce d'identité, email, téléphone ou contenu de document."],
  ["3. Finalités et bases légales", "Les finalités prévues sont la réponse à une demande, la préparation et l'exécution du service, la gestion du compte, la sécurité, le suivi opérationnel et, séparément, la prospection lorsque le consentement ou une autre base applicable le permet. Les bases légales finales doivent être validées par le responsable du traitement."],
  ["4. Destinataires", "Les données sont accessibles uniquement aux personnes autorisées, aux prestataires techniques nécessaires et aux professionnels impliqués dans le service, dans la limite de leur mission. Les accès doivent être authentifiés, limités selon les rôles et consignés lorsque l'opération le justifie."],
  ["5. Conservation", "Les durées doivent être définies par finalité : diagnostic abandonné, prospect, client actif, dossier clôturé, obligations légales et demande de suppression. Elles ne doivent pas être codées comme une conservation illimitée."],
  ["6. Vos droits", "Selon les conditions applicables, vous pouvez demander l'accès, la rectification, l'effacement, la limitation, l'opposition ou la portabilité de vos données. Une page de paramètres et une procédure interne sont prévues pour traiter ces demandes."],
  ["7. Cookies et mesure d'audience", "Les traceurs non nécessaires restent désactivés avant le choix de l'utilisateur. Le consentement Google et les éventuels pixels publicitaires doivent être pilotés par une interface de consentement conforme."],
  ["8. Sécurité", "Les documents doivent être conservés dans un espace privé, accessibles au moyen de liens temporaires et protégés par des règles tenant compte du rôle de chaque utilisateur. Le formulaire de demande prévoit Cloudflare Turnstile pour limiter les abus ; ce prestataire peut traiter les données techniques strictement nécessaires à cette vérification. Les secrets techniques et les droits d'administration ne doivent jamais être exposés dans le navigateur."],
] as const;

const legalSections = [
  ["Éditeur", "Nom, forme juridique, capital, siège social, numéro d'immatriculation, numéro de TVA, email et directeur de publication : à renseigner avec les informations réelles."],
  ["Hébergement", "Frontend : Cloudflare Pages. Base de données, authentification, stockage et fonctions : Supabase, dans la région européenne choisie. Les informations contractuelles exactes devront être ajoutées."],
  ["Objet du site", "La plateforme présente un service d'accompagnement à la création d'entreprise, fournit des informations générales, organise les demandes et permet le suivi d'un projet. Elle ne doit pas se présenter comme fournissant un conseil juridique personnalisé lorsqu'elle n'est pas habilitée à le faire."],
  ["Propriété intellectuelle", "Les textes, interfaces, marques, illustrations et éléments logiciels appartiennent à leurs titulaires respectifs. La marque Orée est utilisée comme marque de démonstration et doit être remplacée ou validée."],
  ["Responsabilité", "Les informations générales ne remplacent pas une consultation auprès d'un professionnel habilité. Les délais administratifs externes ne sont pas contrôlés par la plateforme. Les engagements commerciaux finaux doivent préciser leur périmètre et leurs exclusions."],
  ["Contact", "Les coordonnées réelles du service client, du responsable de publication et du contact données personnelles doivent être ajoutées avant le lancement."],
] as const;

export default function LegalPage({ type }: { type: "privacy" | "legal" }) {
  const privacy = type === "privacy";
  const sections = privacy ? privacySections : legalSections;
  const title = privacy ? "Politique de confidentialité" : "Mentions légales";
  usePageMeta(title, privacy ? "Informations sur le traitement des données personnelles par Orée." : "Mentions légales de la plateforme Orée.");
  return <>
    <section className="hero-grid surface-noise overflow-hidden bg-[var(--night)] pb-18 pt-34 text-white sm:pt-42 lg:pb-24 lg:pt-44"><div className="container-shell relative z-10 max-w-5xl"><Badge className="border-white/12 bg-white/[.06] text-white/68">Document à finaliser avant production</Badge><div className="mt-7 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-balance text-[clamp(3.5rem,7vw,7.8rem)] font-semibold leading-[.9] tracking-[-.075em]">{title}</h1><p className="mt-6 max-w-2xl text-base leading-8 text-white/72">Dernière mise à jour du modèle : 16 juillet 2026. Ce contenu structure la page, mais doit être validé avec les informations juridiques et les coordonnées réelles du service.</p></div><span className="grid size-15 shrink-0 place-items-center rounded-[21px] border border-white/12 bg-white/[.06]">{privacy ? <ShieldCheck className="size-6 text-[color:var(--mint)]" /> : <FileText className="size-6 text-[color:var(--mint)]" />}</span></div></div></section>
    <section className="pb-28 pt-16 sm:pt-20"><div className="container-shell max-w-5xl"><div className="grid gap-4">{sections.map(([heading, body], index) => <article key={heading} className="interactive-card soft-panel grid gap-5 rounded-[28px] p-6 sm:grid-cols-[64px_1fr] sm:p-8"><span className="text-4xl font-semibold tracking-[-.07em] text-[color:var(--ink)]/[.07]">{String(index + 1).padStart(2, "0")}</span><div><h2 className="text-xl font-semibold tracking-[-.03em] sm:text-2xl">{heading}</h2><p className="mt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-base sm:leading-8">{body}</p></div></article>)}</div></div></section>
  </>;
}
