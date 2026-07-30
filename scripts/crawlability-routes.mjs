export const CANONICAL_ORIGIN = "https://oree.optimutech.fr";

export const publicRoutes = [
  {
    path: "/",
    title: "Orée - Créez votre société avec clarté",
    description:
      "Diagnostic adaptatif, dossier structuré et prochaine action visible pour créer votre société avec un parcours clair et piloté.",
    h1: "Créez votre société",
    kind: "home",
  },
  {
    path: "/creation-sasu/",
    title: "Création de SASU - Orée",
    description:
      "Vérifiez si la SASU correspond à votre projet, comparez les points essentiels avec l'EURL et préparez un dossier de création organisé.",
    h1: "Créer une SASU",
    kind: "landing",
  },
  {
    path: "/creation-eurl/",
    title: "Création d'EURL - Orée",
    description:
      "Clarifiez le cadre de votre projet solo, comparez l'EURL avec la SASU et préparez les informations utiles avant la formalité.",
    h1: "Créer une EURL",
    kind: "landing",
  },
  {
    path: "/creation-sas/",
    title: "Création de SAS - Orée",
    description:
      "Organisez les rôles, le capital, les décisions et les documents nécessaires pour créer une SAS à plusieurs avec un dossier lisible.",
    h1: "Créer une SAS",
    kind: "landing",
  },
  {
    path: "/creation-sarl/",
    title: "Création de SARL - Orée",
    description:
      "Préparez une création de SARL en cadrant associés, gérance, apports, pièces et étapes à valider avant la formalité.",
    h1: "Créer une SARL",
    kind: "landing",
  },
  {
    path: "/choisir-statut/",
    title: "Choisir son statut juridique - Orée",
    description:
      "Comparez SASU, EURL, SAS, SARL et autres options selon votre situation, vos associés, votre activité et vos priorités.",
    h1: "Choisir son statut juridique",
    kind: "guide",
  },
  {
    path: "/creer-entreprise-seul/",
    title: "Créer une entreprise seul - Orée",
    description:
      "Comparez les formes unipersonnelles, précisez vos priorités et organisez les informations nécessaires pour créer seul.",
    h1: "Créer une entreprise seul",
    kind: "landing",
  },
  {
    path: "/creer-entreprise-a-plusieurs/",
    title: "Créer une entreprise à plusieurs - Orée",
    description:
      "Réunissez les décisions, rôles, apports, règles de fonctionnement et documents des associés dans un parcours commun.",
    h1: "Créer une entreprise à plusieurs",
    kind: "landing",
  },
  {
    path: "/creer-entreprise-en-etant-salarie/",
    title: "Créer une entreprise en étant salarié - Orée",
    description:
      "Préparez votre transition entrepreneuriale, cadrez le calendrier et identifiez les points à vérifier avant de lancer votre société.",
    h1: "Créer une entreprise en étant salarié",
    kind: "landing",
  },
  {
    path: "/creer-entreprise-demandeur-emploi/",
    title: "Créer une entreprise quand on est demandeur d'emploi - Orée",
    description:
      "Structurez votre projet avec une lecture prudente de l'ARE, l'ARCE, l'ACRE, du calendrier et des vérifications à mener.",
    h1: "Créer une entreprise quand on est demandeur d'emploi",
    kind: "landing",
  },
  {
    path: "/passer-micro-entreprise-en-societe/",
    title: "Passer de micro-entreprise en société - Orée",
    description:
      "Analysez les raisons du passage en société, comparez les structures et préparez une transition cohérente pour votre activité.",
    h1: "Passer de micro-entreprise en société",
    kind: "landing",
  },
  {
    path: "/dossier-creation-entreprise-bloque/",
    title: "Dossier de création d'entreprise bloqué - Orée",
    description:
      "Situez l'étape bloquée, reliez la demande reçue aux pièces concernées et organisez la prochaine vérification du dossier.",
    h1: "Dossier de création d'entreprise bloqué",
    kind: "landing",
  },
  {
    path: "/comment-ca-marche/",
    title: "Comment ça marche - Orée",
    description:
      "Découvrez comment Orée relie diagnostic, orientation, espace projet, documents, messages et suivi opérationnel.",
    h1: "Comment ça marche",
    kind: "guide",
  },
  {
    path: "/tarifs/",
    title: "Tarifs et coûts - Orée",
    description:
      "Créez une SASU, EURL, SAS ou SARL pour 600 € tout compris, avec accompagnement, frais de greffe et annonce légale inclus.",
    h1: "Tarifs et coûts",
    kind: "pricing",
  },
  {
    path: "/accompagnement/",
    title: "Accompagnement humain - Orée",
    description:
      "Découvrez comment l'équipe intervient sur les incohérences, décisions, validations et étapes utiles du parcours de création.",
    h1: "Accompagnement humain",
    kind: "service",
  },
  {
    path: "/diagnostic/",
    title: "Diagnostic de création de société - Orée",
    description:
      "Décrivez votre situation et obtenez une orientation indicative avant de constituer votre dossier de création de société.",
    h1: "Diagnostic de création de société",
    kind: "diagnostic",
  },
  {
    path: "/rendez-vous/",
    title: "Prendre rendez-vous - Orée",
    description:
      "Réservez un échange de cadrage, d'orientation ou de suivi pour avancer sur votre projet de création de société.",
    h1: "Prendre rendez-vous",
    kind: "appointment",
  },
  {
    path: "/confidentialite/",
    title: "Politique de confidentialité - Orée",
    description:
      "Consultez la politique de confidentialité Orée, les finalités de traitement et les principes appliqués aux données personnelles.",
    h1: "Politique de confidentialité",
    kind: "legal",
  },
  {
    path: "/mentions-legales/",
    title: "Mentions légales - Orée",
    description:
      "Consultez les mentions légales, informations d'éditeur et précisions relatives au service Orée.",
    h1: "Mentions légales",
    kind: "legal",
  },
];

export const knownClientRoutes = [
  "/connexion/",
  "/inscription/",
  "/mot-de-passe-oublie/",
  "/reinitialiser-mot-de-passe/",
  "/auth/callback/",
  "/auth/confirmation/",
  "/app/",
  "/app/projet/",
  "/app/orientation/",
  "/app/associes/",
  "/app/documents/",
  "/app/formalites/",
  "/app/suivi/",
  "/app/messages/",
  "/app/rendez-vous/",
  "/app/notifications/",
  "/app/parametres/",
  "/ops/",
  "/ops/leads/",
  "/ops/projets/",
  "/ops/documents/",
  "/ops/rendez-vous/",
  "/ops/equipe/",
  "/ops/messages/",
  "/ops/analytics/",
  "/ops/audit/",
  "/ops/aide/",
  "/ops/profil/",
];

export const prerenderRoutes = [...publicRoutes.map((route) => route.path), ...knownClientRoutes];

export const crawlerUserAgents = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
];

export function normalizeRoutePath(path) {
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
}

export function canonicalUrl(path) {
  return `${CANONICAL_ORIGIN}${normalizeRoutePath(path)}`;
}
