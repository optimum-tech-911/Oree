import { commercialOffers } from "@/config/commercial-offers";
import { normalizeText } from "@/lib/format";

export type AssistantKnowledge = {
  id: string;
  title: string;
  route: string;
  keywords: string[];
  answer: string;
  actions: Array<{ label: string; href: string }>;
};

const assistantSynonymGroups = [
  ["rdv", "rendez vous", "rendez-vous", "appel", "rappel", "creneau", "disponibilite"],
  ["papier", "papiers", "piece", "pieces", "document", "documents", "justificatif"],
  ["sasu", "eurl", "seul", "solo", "unipersonnelle"],
  ["sas", "sarl", "associe", "associes", "plusieurs", "deux"],
  ["micro", "auto entrepreneur", "auto-entrepreneur", "independant"],
  ["bloque", "blocage", "rejete", "rejet", "correction", "erreur"],
  ["prix", "cout", "tarif", "frais", "combien", "forfait"],
  ["payer", "paie", "paiement", "reglement", "quand"],
  ["inclus", "incluse", "compris", "comprend", "contenu"],
  ["modifier", "modification", "changer", "societe existante"],
  ["ht", "ttc", "tva", "taxe", "fiscalite"],
  ["telephone", "appeler", "contact", "contacter", "whatsapp", "email", "e-mail"],
  ["avancement", "suivi", "progression", "statut dossier", "etape"],
];

export function expandAssistantTokens(query: string) {
  const normalized = normalizeText(query);
  const tokens = new Set(normalized.split(" ").filter((token) => token.length > 1));

  for (const group of assistantSynonymGroups) {
    if (group.some((item) => normalized.includes(normalizeText(item)))) {
      group.flatMap((item) => normalizeText(item).split(" ")).forEach((item) => tokens.add(item));
    }
  }

  return { normalized, tokens: [...tokens] };
}

function scoreAssistantKnowledge(item: AssistantKnowledge, query: string) {
  const { normalized, tokens } = expandAssistantTokens(query);
  const normalizedTitle = normalizeText(item.title);
  const haystack = normalizeText(`${item.title} ${item.keywords.join(" ")} ${item.answer}`);
  let score = 0;

  if (haystack.includes(normalized)) score += 30;
  for (const token of tokens) {
    if (normalizedTitle.includes(token)) score += 8;
    if (item.keywords.some((keyword) => normalizeText(keyword).includes(token))) score += 6;
    if (haystack.includes(token)) score += 2;
  }

  return score;
}

export function rankAssistantKnowledge(query: string, pathname = "") {
  return assistantKnowledge
    .map((item) => ({
      item,
      score: scoreAssistantKnowledge(item, query) + (pathname.startsWith(item.route) ? 3 : 0),
    }))
    .sort((a, b) => b.score - a.score);
}

export const assistantKnowledge: AssistantKnowledge[] = [
  {
    id: "start-diagnostic",
    title: "Commencer le diagnostic",
    route: "/diagnostic",
    keywords: ["commencer", "diagnostic", "test", "questionnaire", "orientation", "je ne sais pas", "statut"],
    answer: "Le diagnostic commence par votre situation : seul, à plusieurs, micro-entreprise, salariat, demande d’emploi, dossier bloqué ou statut encore incertain. Vous pouvez le lancer sans créer de compte.",
    actions: [{ label: "Démarrer le diagnostic", href: "/diagnostic" }],
  },
  {
    id: "compare-solo",
    title: "Comparer SASU et EURL",
    route: "/choisir-statut",
    keywords: ["sasu", "eurl", "seul", "solo", "comparaison", "différence", "president", "gérant"],
    answer: "SASU et EURL permettent de créer seul, mais leur gouvernance, le régime social du dirigeant, la liberté statutaire et leur évolution diffèrent. La plateforme présente une première recommandation puis propose une validation humaine.",
    actions: [
      { label: "Comparer les statuts", href: "/choisir-statut" },
      { label: "Page SASU", href: "/creation-sasu" },
      { label: "Page EURL", href: "/creation-eurl" },
    ],
  },
  {
    id: "compare-multi",
    title: "Créer à plusieurs",
    route: "/creer-entreprise-a-plusieurs",
    keywords: ["sas", "sarl", "associé", "associes", "plusieurs", "deux", "capital", "répartition", "gouvernance"],
    answer: "Pour un projet à plusieurs, le parcours traite les rôles, la répartition du capital, les validations et les documents de chaque associé. SAS et SARL sont comparées selon le niveau de souplesse et le cadre recherché.",
    actions: [
      { label: "Configurer un projet à plusieurs", href: "/creer-entreprise-a-plusieurs" },
      { label: "Voir les associés", href: "/app/associes" },
    ],
  },
  {
    id: "documents",
    title: "Documents et justificatifs",
    route: "/app/documents",
    keywords: ["document", "documents", "justificatif", "pièce", "upload", "téléverser", "identité", "domicile", "capital", "statuts"],
    answer: "Le centre documentaire regroupe les pièces demandées, leur propriétaire, la dernière version et leur statut : à fournir, en vérification, correction demandée, validé ou signé.",
    actions: [{ label: "Ouvrir les documents", href: "/app/documents" }],
  },
  {
    id: "appointments",
    title: "Prendre rendez-vous",
    route: "/rendez-vous",
    keywords: ["rendez-vous", "rdv", "appel", "conseiller", "téléphone", "visio", "créneau", "disponibilité"],
    answer: "Vous pouvez sélectionner un échange de cadrage, une validation d'orientation ou un point consacré au dossier. Les formats proposés sont le téléphone et la visioconférence, avec plusieurs plages horaires.",
    actions: [{ label: "Choisir un créneau", href: "/rendez-vous" }],
  },
  {
    id: "employee",
    title: "Créer en étant salarié",
    route: "/creer-entreprise-en-etant-salarie",
    keywords: ["salarié", "cdi", "emploi", "travail", "reconversion", "quitter", "activité secondaire", "soir"],
    answer: "Le parcours salarié permet de préparer le projet sans déclencher immédiatement la création : feuille de route, progression sauvegardée, calendrier et rendez-vous adaptés.",
    actions: [{ label: "Construire ma feuille de route", href: "/creer-entreprise-en-etant-salarie" }],
  },
  {
    id: "micro-transition",
    title: "Passer de micro-entreprise en société",
    route: "/passer-micro-entreprise-en-societe",
    keywords: ["micro", "auto entrepreneur", "auto-entrepreneur", "changer", "passer", "société", "seuil", "charges", "clients"],
    answer: "Le parcours de transition prend en compte l'activité déjà lancée, les clients, les charges, les raisons du changement et le calendrier. SASU et EURL peuvent ensuite être comparées sans supposer qu'une forme est automatiquement meilleure.",
    actions: [{ label: "Étudier mon passage en société", href: "/passer-micro-entreprise-en-societe" }],
  },
  {
    id: "job-seeker",
    title: "Créer une société en étant demandeur d’emploi",
    route: "/creer-entreprise-demandeur-emploi",
    keywords: ["demandeur d'emploi", "chômage", "chomage", "are", "arce", "acre", "allocation", "france travail"],
    answer: "Le parcours aide à organiser le calendrier et les points à vérifier. Il ne garantit ni éligibilité, ni maintien des allocations : ces éléments dépendent du dossier et des règles applicables.",
    actions: [{ label: "Comprendre les points à vérifier", href: "/creer-entreprise-demandeur-emploi" }],
  },
  {
    id: "company-offer-price",
    title: "Prix fixe de création de société",
    route: "/tarifs",
    keywords: ["prix", "tarif", "coût", "cout", "combien", "offre", "forfait", "sasu", "eurl", "sas", "sarl", "supplément", "surcharge"],
    answer: `La création d’une SASU, EURL, SAS ou SARL est proposée à ${commercialOffers.companyCreation.priceLabel}. Le prix est identique pour ces quatre formes, sans supplément selon la forme choisie. ${commercialOffers.companyCreation.otherFormsWording}`,
    actions: [
      { label: "Voir l’offre complète", href: "/tarifs" },
      { label: "Commencer ma création", href: "/diagnostic" },
    ],
  },
  {
    id: "company-offer-included",
    title: "Ce qui est inclus dans le forfait société",
    route: "/tarifs",
    keywords: ["inclus", "incluse", "compris", "comprend", "contenu", "forfait", "accompagnement", "greffe", "annonce légale", "correction", "complément", "dépôt"],
    answer: `Le forfait à ${commercialOffers.companyCreation.priceLabel} comprend ${commercialOffers.companyCreation.included.map((item) => item.toLocaleLowerCase("fr-FR")).join(", ")}. Il concerne la préparation et le dépôt d’un dossier de création.`,
    actions: [
      { label: "Voir le détail de l’offre", href: "/tarifs" },
      { label: "Comprendre l’accompagnement", href: "/accompagnement" },
    ],
  },
  {
    id: "company-offer-payment",
    title: "Moment du paiement",
    route: "/tarifs",
    keywords: ["payer", "paie", "paiement", "règlement", "quand", "avant", "après", "informations", "dossier"],
    answer: commercialOffers.companyCreation.paymentStage,
    actions: [
      { label: "Voir le fonctionnement", href: "/comment-ca-marche" },
      { label: "Commencer ma création", href: "/diagnostic" },
    ],
  },
  {
    id: "company-offer-tax",
    title: "TVA et mention fiscale du prix",
    route: "/tarifs",
    keywords: ["ht", "ttc", "tva", "taxe", "fiscalité", "facture", "prix hors taxe", "prix toutes taxes comprises"],
    answer: `L’offre validée est affichée à ${commercialOffers.companyCreation.priceLabel}. Aucune mention publique HT, TTC ou de TVA supplémentaire n’est actuellement configurée : le Guide ne doit donc pas en inventer. Pour une précision de facturation ou de TVA, contactez l’équipe avant de vous engager.`,
    actions: [
      { label: "Voir les tarifs", href: "/tarifs" },
      { label: "Demander un rappel", href: "/rendez-vous" },
    ],
  },
  {
    id: "company-offer-exclusions",
    title: "Créations prises en charge et modifications exclues",
    route: "/tarifs",
    keywords: ["modifier", "modification", "changer", "société existante", "transfert", "siège", "dirigeant", "capital", "exclusion", "non pris en charge"],
    answer: `${commercialOffers.companyCreation.restriction} Un dossier de création déjà commencé mais bloqué reste un besoin distinct : vous pouvez décrire le blocage pour vérifier la prochaine action.`,
    actions: [
      { label: "Voir l’offre de création", href: "/tarifs" },
      { label: "Décrire un dossier bloqué", href: "/dossier-creation-entreprise-bloque" },
    ],
  },
  {
    id: "micro-creation-offer",
    title: "Offre de création de micro-entreprise",
    route: "/offres",
    keywords: ["micro", "micro-entreprise", "auto entrepreneur", "auto-entrepreneur", "prix", "tarif", "coût", "combien", "démarche", "pour mon compte"],
    answer: `La création de micro-entreprise est une offre distincte à ${commercialOffers.microEnterprise.priceLabel}. ${commercialOffers.microEnterprise.description} ${commercialOffers.microEnterprise.paymentStage}`,
    actions: [
      { label: "Voir les offres", href: "/offres" },
      { label: "Étudier un passage en société", href: "/passer-micro-entreprise-en-societe" },
    ],
  },
  {
    id: "company-offer-contact",
    title: "Contacter l’équipe Orée",
    route: "/rendez-vous",
    keywords: ["contact", "contacter", "téléphone", "appeler", "rappel", "whatsapp", "email", "e-mail", "adresse", "disponibilité", "équipe"],
    answer: `Vous pouvez demander un rappel, appeler ou écrire sur WhatsApp au ${commercialOffers.contact.displayPhone}, ou envoyer un e-mail à ${commercialOffers.contact.email}. ${commercialOffers.contact.availability}.`,
    actions: [
      { label: "Demander un rappel", href: "/rendez-vous" },
      { label: "Commencer le diagnostic", href: "/diagnostic" },
    ],
  },
  {
    id: "orientation-limits",
    title: "Portée de l’orientation",
    route: "/accompagnement",
    keywords: ["conseil juridique", "avis définitif", "orientation", "recommandation", "validation humaine", "avocat", "expert", "garantie"],
    answer: "Le diagnostic fournit une première recommandation explicable, pas un conseil juridique automatique définitif. Il présente les structures qui semblent devoir être comparées, les points à valider et l’action suivante. Une validation humaine reste proposée lorsque votre situation l’exige.",
    actions: [
      { label: "Comprendre l’accompagnement", href: "/accompagnement" },
      { label: "Démarrer le diagnostic", href: "/diagnostic" },
    ],
  },
  {
    id: "tracking",
    title: "Suivre l'avancement",
    route: "/app/suivi",
    keywords: ["suivi", "avancement", "progression", "étape", "statut dossier", "où en est", "chronologie", "timeline"],
    answer: "Le suivi présente les événements importants, la prochaine action, les documents en attente et les étapes futures. Les délais contrôlés par l'équipe sont distingués du traitement administratif externe.",
    actions: [{ label: "Voir le suivi du projet", href: "/app/suivi" }],
  },
  {
    id: "messages",
    title: "Contacter le conseiller",
    route: "/app/messages",
    keywords: ["message", "conseiller", "chat", "question", "écrire", "contacter", "aide humaine"],
    answer: "La messagerie relie chaque échange au projet. Les demandes de documents ou de correction peuvent pointer directement vers la pièce concernée.",
    actions: [{ label: "Ouvrir la messagerie", href: "/app/messages" }],
  },
  {
    id: "blocked",
    title: "Dossier bloqué",
    route: "/dossier-creation-entreprise-bloque",
    keywords: ["bloqué", "blocage", "rejet", "refus", "correction", "inpi", "greffe", "erreur", "formalités"],
    answer: "Le parcours dossier bloqué commence par l'étape concernée et la demande reçue. Il associe ensuite la correction au bon document et conserve l'historique des versions.",
    actions: [{ label: "Décrire mon blocage", href: "/dossier-creation-entreprise-bloque" }],
  },
  {
    id: "privacy",
    title: "Données et confidentialité",
    route: "/confidentialite",
    keywords: ["rgpd", "confidentialité", "données", "supprimer", "exporter", "consentement", "cookies", "sécurité"],
    answer: "Les données nécessaires à l'exécution du service sont distinguées des communications commerciales. Les documents doivent être conservés dans un espace privé avec des droits d'accès limités. Les outils statistiques ne doivent recevoir ni nom, ni adresse email, ni numéro de téléphone, ni contenu de document.",
    actions: [{ label: "Lire la confidentialité", href: "/confidentialite" }],
  },
  {
    id: "dashboard",
    title: "Espace projet",
    route: "/app",
    keywords: ["tableau de bord", "dashboard", "espace", "projet", "compte", "connexion", "client"],
    answer: "L'espace projet réunit l'orientation, les associés, les documents, les formalités, les messages, les rendez-vous et la prochaine action. Une version de démonstration permet d'en examiner le fonctionnement.",
    actions: [{ label: "Ouvrir l'espace de démonstration", href: "/app" }],
  },
];
