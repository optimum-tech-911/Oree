export type AssistantKnowledge = {
  id: string;
  title: string;
  route: string;
  keywords: string[];
  answer: string;
  actions: Array<{ label: string; href: string }>;
};

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
    answer: "SASU et EURL permettent de créer seul, mais leur gouvernance, le régime social du dirigeant, la liberté statutaire et leur évolution diffèrent. La plateforme présente une orientation indicative puis propose une validation humaine.",
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
    id: "pricing",
    title: "Offres et coûts",
    route: "/tarifs",
    keywords: ["prix", "tarif", "coût", "cout", "combien", "frais", "offre", "paiement"],
    answer: "Les offres distinguent les honoraires du service, les frais légaux obligatoires et les éventuelles prestations tierces. Un devis détaillé doit préciser les montants applicables avant tout engagement.",
    actions: [{ label: "Voir les tarifs", href: "/tarifs" }],
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
