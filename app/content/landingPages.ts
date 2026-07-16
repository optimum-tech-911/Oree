import type { LegalFormCode } from "@/types";

export type LandingPageContent = {
  slug: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  searchIntent: string;
  legalForms?: LegalFormCode[];
  proofPoints: string[];
  painPoints: Array<{ title: string; description: string }>;
  steps: Array<{ number: string; title: string; description: string }>;
  faq: Array<{ question: string; answer: string }>;
};

export const landingPages: Record<string, LandingPageContent> = {
  "creation-sasu": {
    slug: "creation-sasu",
    eyebrow: "Création de SASU",
    title: "Créez votre SASU avec un parcours",
    highlight: "clair, suivi et humain.",
    description: "Vérifiez que la SASU correspond à votre projet, centralisez vos informations et avancez étape par étape depuis un espace unique.",
    primaryCta: "Commencer mon projet SASU",
    secondaryCta: "Comparer avec l'EURL",
    searchIntent: "creation_sasu",
    legalForms: ["SASU", "EURL"],
    proofPoints: ["Orientation initiale en quelques minutes", "Dossier et documents centralisés", "Accompagnement jusqu'à la formalité"],
    painPoints: [
      { title: "Choix à confirmer", description: "La SASU est souple, mais elle n'est pas automatiquement la meilleure réponse pour tous les projets solo." },
      { title: "Statuts à cadrer", description: "Les règles de fonctionnement doivent correspondre à votre projet, à votre rémunération et à vos perspectives." },
      { title: "Dossier à fiabiliser", description: "Chaque justificatif est suivi afin d'éviter les oublis et les allers-retours inutiles." },
    ],
    steps: [
      { number: "01", title: "Décrivez votre projet", description: "Activité, calendrier, rémunération, développement et contraintes." },
      { number: "02", title: "Validez l'orientation", description: "Comparez la SASU avec les alternatives qui méritent réellement d'être étudiées." },
      { number: "03", title: "Préparez votre dossier", description: "Rassemblez les informations et documents depuis votre espace sécurisé." },
      { number: "04", title: "Suivez la formalité", description: "Visualisez les validations, signatures, étapes et éventuelles corrections." },
    ],
    faq: [
      { question: "La SASU convient-elle à tous les créateurs seuls ?", answer: "Non. Elle mérite souvent d'être comparée à l'EURL, à l'entreprise individuelle ou au régime micro selon le niveau d'activité, la rémunération, la protection sociale recherchée et les perspectives du projet." },
      { question: "Puis-je commencer sans avoir choisi définitivement ?", answer: "Oui. Le diagnostic est conçu pour faire émerger les options pertinentes avant une validation humaine." },
      { question: "Quels documents dois-je préparer ?", answer: "La liste dépend de votre situation et du siège social. Votre espace affiche uniquement les pièces nécessaires et leur statut." },
    ],
  },
  "creation-eurl": {
    slug: "creation-eurl",
    eyebrow: "Création d'EURL",
    title: "Structurez votre EURL en maîtrisant",
    highlight: "chaque décision administrative.",
    description: "Clarifiez le cadre de votre projet solo, préparez vos informations et faites suivre chaque pièce avant la formalité.",
    primaryCta: "Commencer mon projet EURL",
    secondaryCta: "Comparer avec la SASU",
    searchIntent: "creation_eurl",
    legalForms: ["EURL", "SASU"],
    proofPoints: ["Parcours adapté au gérant associé", "Comparaison claire avec la SASU", "Checklist documentaire dynamique"],
    painPoints: [
      { title: "Régime du dirigeant", description: "Le statut social du gérant doit être compris avant de fixer la structure et la rémunération." },
      { title: "Cadre plus balisé", description: "L'EURL est encadrée par la loi : c'est rassurant, mais cela laisse moins de liberté que la SASU." },
      { title: "Évolution du projet", description: "L'arrivée d'associés transforme l'EURL en SARL : mieux vaut anticiper ce scénario." },
    ],
    steps: [
      { number: "01", title: "Cadrez votre activité", description: "Nature de l'activité, besoins, charges, clients et calendrier." },
      { number: "02", title: "Comparez les options", description: "Identifiez les différences concrètes entre EURL et SASU selon vos priorités." },
      { number: "03", title: "Constituez le dossier", description: "Informations société, gérance, siège, capital et justificatifs." },
      { number: "04", title: "Gardez le contrôle", description: "Suivez les demandes, documents et changements de statut dans votre espace." },
    ],
    faq: [
      { question: "Pourquoi comparer EURL et SASU ?", answer: "Les deux permettent de créer seul, mais leur gouvernance, le régime du dirigeant, la liberté statutaire et l'évolution vers plusieurs associés diffèrent." },
      { question: "L'EURL impose-t-elle un capital minimum élevé ?", answer: "Le capital doit être cohérent avec le projet. La plateforme distingue le montant envisagé, les apports et les justificatifs à préparer." },
      { question: "Puis-je inviter mon expert-comptable ?", answer: "Un collaborateur externe pourra être invité avec un rôle et des droits d'accès limités aux informations nécessaires à son intervention." },
    ],
  },
  "creation-sas": {
    slug: "creation-sas",
    eyebrow: "Création de SAS",
    title: "Alignez les associés avant de",
    highlight: "construire la société.",
    description: "Rôles, capital, décisions, documents : organisez un projet à plusieurs dans un espace commun avant la formalité.",
    primaryCta: "Préparer notre SAS",
    secondaryCta: "Comparer avec la SARL",
    searchIntent: "creation_sas",
    legalForms: ["SAS", "SARL"],
    proofPoints: ["Parcours multi-associés", "Répartition du capital visualisée", "Validations individuelles suivies"],
    painPoints: [
      { title: "Gouvernance à écrire", description: "La souplesse de la SAS exige de préciser les règles de décision et les responsabilités." },
      { title: "Capital à répartir", description: "Les apports et pourcentages doivent être cohérents, acceptés et documentés." },
      { title: "Décisions partagées", description: "Chaque associé doit savoir ce qu'il doit compléter, fournir ou valider." },
    ],
    steps: [
      { number: "01", title: "Invitez les associés", description: "Chaque personne complète ses informations dans un parcours coordonné." },
      { number: "02", title: "Cadrez les rôles", description: "Présidence, pouvoirs, décisions et répartition du capital sont rendus visibles." },
      { number: "03", title: "Centralisez les pièces", description: "Suivez la complétude de chaque associé et de la future société." },
      { number: "04", title: "Validez ensemble", description: "Les étapes critiques sont confirmées avant la préparation finale." },
    ],
    faq: [
      { question: "La SAS est-elle préférable à la SARL ?", answer: "Cela dépend du projet. La SAS offre une forte liberté statutaire, tandis que la SARL apporte un cadre légal plus balisé. Les objectifs des associés doivent guider l'analyse." },
      { question: "Comment répartir le capital ?", answer: "La plateforme permet de simuler une répartition et de signaler les incohérences, mais l'accord final appartient aux associés et peut nécessiter un conseil professionnel." },
      { question: "Tous les associés doivent-ils créer un compte ?", answer: "Le parcours cible prévoit des invitations individuelles afin de collecter et valider les informations sans échange de documents par email." },
    ],
  },
  "creation-sarl": {
    slug: "creation-sarl",
    eyebrow: "Création de SARL",
    title: "Construisez une SARL où chacun sait",
    highlight: "ce qu'il doit faire.",
    description: "Organisez les associés, la gérance, les apports et le dossier dans un parcours collectif et lisible.",
    primaryCta: "Préparer notre SARL",
    secondaryCta: "Comparer avec la SAS",
    searchIntent: "creation_sarl",
    legalForms: ["SARL", "SAS"],
    proofPoints: ["Cadre multi-associés guidé", "Suivi de la gérance", "Documents et validations réunis"],
    painPoints: [
      { title: "Gérance à définir", description: "Le statut du ou des gérants dépend notamment de la détention du capital." },
      { title: "Parts à organiser", description: "La répartition des parts et les règles de cession doivent être comprises par tous." },
      { title: "Dossier collectif", description: "Une seule pièce manquante peut ralentir l'ensemble du projet." },
    ],
    steps: [
      { number: "01", title: "Configurez le groupe", description: "Associés, gérants, apports et participations." },
      { number: "02", title: "Validez le cadre", description: "Comparez la SARL à la SAS selon votre organisation et vos objectifs." },
      { number: "03", title: "Collectez les justificatifs", description: "Chaque personne voit uniquement ses actions et leur statut." },
      { number: "04", title: "Finalisez le projet", description: "Les informations consolidées alimentent le dossier et le suivi." },
    ],
    faq: [
      { question: "Une SARL peut-elle avoir plusieurs gérants ?", answer: "Oui. Le projet doit alors préciser leur rôle, leurs pouvoirs et leur situation au capital." },
      { question: "La SARL est-elle réservée aux familles ?", answer: "Non. Elle convient à différents projets à plusieurs, notamment lorsque les associés préfèrent un cadre juridique structuré." },
      { question: "Comment éviter les documents manquants ?", answer: "Le centre documentaire associe chaque exigence à une personne, un statut et une éventuelle demande de correction." },
    ],
  },
  "creer-entreprise-en-etant-salarie": {
    slug: "creer-entreprise-en-etant-salarie",
    eyebrow: "Salariat & entrepreneuriat",
    title: "Préparez votre société avec",
    highlight: "un calendrier et des décisions explicites.",
    description: "Construisez votre feuille de route, sauvegardez votre progression et choisissez le bon moment pour lancer les formalités.",
    primaryCta: "Construire ma feuille de route",
    secondaryCta: "Parler à un conseiller",
    searchIntent: "employee_transition",
    proofPoints: ["Parcours discret et sauvegardé", "Calendrier adapté à votre transition", "Rendez-vous en dehors des heures de bureau"],
    painPoints: [
      { title: "Choisir le bon moment", description: "Votre projet peut être préparé avant la date réelle de création." },
      { title: "Conserver de la visibilité", description: "Une feuille de route distingue les décisions urgentes de celles qui peuvent attendre." },
      { title: "Éviter les raccourcis", description: "Le statut ne se choisit pas uniquement en fonction d'une promesse de charges plus faibles." },
    ],
    steps: [
      { number: "01", title: "Situez votre transition", description: "Emploi actuel, disponibilité, échéance et niveau de maturité." },
      { number: "02", title: "Structurez le projet", description: "Activité, clients, besoins, rémunération et risques." },
      { number: "03", title: "Sauvegardez le parcours", description: "Revenez quand vous le souhaitez sans recommencer." },
      { number: "04", title: "Déclenchez la création", description: "Passez au dossier lorsque le projet et le calendrier sont alignés." },
    ],
    faq: [
      { question: "Dois-je quitter mon emploi avant de préparer ma société ?", answer: "Non. Vous pouvez organiser le projet, comparer les structures et réunir des informations avant de déclencher les formalités." },
      { question: "Mon diagnostic reste-t-il confidentiel ?", answer: "Les réponses non sensibles sont sauvegardées localement pendant l'exploration. Les données personnelles enregistrées dans le service connecté devront être protégées par l'authentification et des droits d'accès stricts." },
      { question: "Puis-je prendre rendez-vous le soir ?", answer: "L'interface prévoit des créneaux étendus afin de s'adapter aux personnes encore en activité." },
    ],
  },
  "passer-micro-entreprise-en-societe": {
    slug: "passer-micro-entreprise-en-societe",
    eyebrow: "Passage en société",
    title: "Votre activité grandit. Faites évoluer",
    highlight: "la structure avec elle.",
    description: "Analysez les raisons du changement, comparez les structures et préparez la transition en préservant la continuité de votre activité.",
    primaryCta: "Étudier mon passage en société",
    secondaryCta: "Comparer SASU et EURL",
    searchIntent: "micro_to_company",
    legalForms: ["SASU", "EURL"],
    proofPoints: ["Parcours dédié aux indépendants actifs", "Prise en compte des clients existants", "Plan de transition structuré"],
    painPoints: [
      { title: "Activité déjà en cours", description: "La transition doit tenir compte des clients, contrats, factures et outils utilisés." },
      { title: "Charges réelles", description: "Une structure adaptée dépend aussi des dépenses et du mode de rémunération." },
      { title: "Continuité commerciale", description: "Le calendrier doit limiter les ruptures dans la relation avec vos clients." },
    ],
    steps: [
      { number: "01", title: "Décrivez l'existant", description: "Activité, revenus, charges, clients et organisation actuelle." },
      { number: "02", title: "Identifiez le déclencheur", description: "Seuil, recrutement, investissement, association ou crédibilité." },
      { number: "03", title: "Comparez les options", description: "SASU, EURL ou autre orientation selon les priorités réelles." },
      { number: "04", title: "Planifiez la transition", description: "Actions, documents, calendrier et communication aux partenaires." },
    ],
    faq: [
      { question: "Quand faut-il passer en société ?", answer: "Il n'existe pas un seuil universel. La décision peut dépendre du chiffre d'affaires, des charges, de la protection recherchée, des investissements ou de l'arrivée d'associés." },
      { question: "Faut-il fermer la micro-entreprise immédiatement ?", answer: "Le calendrier doit être organisé selon votre situation. La plateforme prévoit une feuille de route à confirmer avec les professionnels compétents." },
      { question: "Mes clients doivent-ils signer de nouveaux contrats ?", answer: "Cela peut être nécessaire lorsque l'entité qui facture change. Ce point doit figurer dans la liste de contrôle de la transition." },
    ],
  },
  "creer-entreprise-a-plusieurs": {
    slug: "creer-entreprise-a-plusieurs",
    eyebrow: "Projet à plusieurs",
    title: "Transformez une idée commune en",
    highlight: "projet partagé et vérifiable.",
    description: "Réunissez les décisions, rôles, apports et documents des associés dans un espace commun.",
    primaryCta: "Configurer notre projet",
    secondaryCta: "Comparer SAS et SARL",
    searchIntent: "multi_founder",
    legalForms: ["SAS", "SARL"],
    proofPoints: ["Invitations individuelles", "Capital et rôles visualisés", "Progression commune"],
    painPoints: [
      { title: "Décisions implicites", description: "Les désaccords apparaissent souvent lorsque les rôles n'ont pas été explicités tôt." },
      { title: "Pièces dispersées", description: "Les documents transmis dans plusieurs conversations sont difficiles à suivre." },
      { title: "Responsabilité floue", description: "Chaque action doit avoir un responsable, une date et un statut." },
    ],
    steps: [
      { number: "01", title: "Créez l'espace", description: "Un porteur de projet configure la base et invite les autres." },
      { number: "02", title: "Alignez les choix", description: "Rôles, apports, capital, décisions et calendrier." },
      { number: "03", title: "Réunissez les pièces", description: "Chaque associé complète sa partie de manière sécurisée." },
      { number: "04", title: "Validez le dossier", description: "La progression collective reste lisible jusqu'à la formalité." },
    ],
    faq: [
      { question: "Pouvons-nous modifier la répartition du capital ?", answer: "Oui, tant que le projet n'est pas finalisé. Chaque modification importante doit être datée et conservée dans l'historique du dossier." },
      { question: "Chaque associé voit-il tous les documents ?", answer: "Non nécessairement. Les droits peuvent être limités selon le rôle de la personne et la nature du document concerné." },
      { question: "La plateforme remplace-t-elle un pacte d'associés ?", answer: "Non. Elle aide à collecter les décisions et à signaler les sujets à traiter. La rédaction d'un pacte relève d'un professionnel habilité." },
    ],
  },
  "creer-entreprise-seul": {
    slug: "creer-entreprise-seul",
    eyebrow: "Créer une entreprise seul",
    title: "Choisissez une structure adaptée à",
    highlight: "votre activité et à votre trajectoire.",
    description: "Comparez les formes unipersonnelles, précisez vos priorités et organisez les informations nécessaires avant d'engager les formalités.",
    primaryCta: "Étudier mon projet",
    secondaryCta: "Comparer les statuts",
    searchIntent: "solo_founder",
    legalForms: ["SASU", "EURL"],
    proofPoints: ["Comparaison des principales structures", "Orientation expliquée et modifiable", "Feuille de route adaptée au projet"],
    painPoints: [
      { title: "Plusieurs structures possibles", description: "Créer seul ne conduit pas automatiquement à une SASU ou à une EURL. L'activité, la rémunération et les perspectives doivent être examinées ensemble." },
      { title: "Protection et rémunération", description: "Le régime du dirigeant, le mode de rémunération envisagé et la protection recherchée influencent la comparaison." },
      { title: "Évolution à anticiper", description: "L'arrivée future d'un associé, un financement ou un changement d'échelle peuvent modifier la structure la plus pertinente." },
    ],
    steps: [
      { number: "01", title: "Décrire l'activité", description: "Précisez l'offre, les clients, les charges, le calendrier et les besoins de financement." },
      { number: "02", title: "Comparer les structures", description: "Étudiez les différences entre société unipersonnelle, entreprise individuelle et régime micro." },
      { number: "03", title: "Valider les points décisifs", description: "Identifiez les questions sociales, fiscales ou juridiques qui exigent une confirmation professionnelle." },
      { number: "04", title: "Organiser le dossier", description: "Constituez les informations et les pièces nécessaires dans un espace de suivi unique." },
    ],
    faq: [
      { question: "Quelle structure choisir pour entreprendre seul ?", answer: "Le choix dépend notamment de l'activité, du niveau de charges, de la rémunération envisagée, de la protection sociale recherchée et du développement prévu. La SASU et l'EURL ne sont pas les seules options à examiner." },
      { question: "Puis-je commencer avant d'avoir arrêté mon choix ?", answer: "Oui. Le diagnostic permet d'organiser les informations du projet et de faire ressortir les structures à approfondir avant toute validation définitive." },
      { question: "Le régime micro est-il toujours le plus simple ?", answer: "Il peut convenir à certaines activités en phase de lancement, mais ses limites et son mode de calcul doivent être comparés aux besoins réels du projet." },
    ],
  },
  "dossier-creation-entreprise-bloque": {
    slug: "dossier-creation-entreprise-bloque",
    eyebrow: "Dossier bloqué",
    title: "Identifiez ce qui bloque et reprenez",
    highlight: "la démarche au bon endroit.",
    description: "Décrivez l'étape, la demande reçue et les pièces concernées pour orienter rapidement la vérification.",
    primaryCta: "Faire vérifier mon blocage",
    secondaryCta: "Réserver un appel",
    searchIntent: "blocked_dossier",
    proofPoints: ["Diagnostic du point de blocage", "Documents reliés à la demande", "Historique centralisé"],
    painPoints: [
      { title: "Message difficile à comprendre", description: "Les demandes administratives utilisent parfois des termes qui ne permettent pas de savoir quoi corriger." },
      { title: "Mauvaise pièce renvoyée", description: "La plateforme associe chaque correction à la pièce et au commentaire correspondant." },
      { title: "Historique dispersé", description: "Un fil chronologique évite de perdre les versions et les explications déjà reçues." },
    ],
    steps: [
      { number: "01", title: "Situez l'étape", description: "Compte, identité, statuts, capital, annonce, dépôt ou correction." },
      { number: "02", title: "Ajoutez le message", description: "Copiez la demande ou joignez le document reçu." },
      { number: "03", title: "Recevez une orientation", description: "Le dossier est classé selon la nature du blocage." },
      { number: "04", title: "Suivez la correction", description: "Nouvelle version, validation et prochaine action restent visibles." },
    ],
    faq: [
      { question: "Puis-je importer un dossier déjà commencé ailleurs ?", answer: "Le parcours de reprise permet de réunir les documents disponibles, les demandes déjà reçues et l'historique utile avant d'identifier la prochaine action." },
      { question: "Le blocage sera-t-il résolu automatiquement ?", answer: "Non. La plateforme aide à qualifier la situation et à organiser la vérification. Certaines demandes exigent l'intervention d'un professionnel ou de l'administration." },
      { question: "Comment suivre les versions ?", answer: "Chaque nouveau fichier devient une version distincte, avec date, auteur, statut et commentaire." },
    ],
  },
};

export const defaultLanding = landingPages["creation-sasu"];
