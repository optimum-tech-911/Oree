import type { DiagnosticAnswers, DiagnosticRecommendation, LegalFormCode } from "@/types";

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

export function buildRecommendation(answers: DiagnosticAnswers): DiagnosticRecommendation {
  const forms: LegalFormCode[] = [];
  const reasons: string[] = [];
  const pointsToValidate: string[] = [];
  const founderMode = answers.founderMode;
  const priorities = answers.priorities ?? [];
  const start = answers.startingSituation;

  if (start === "blocked" || answers.stage === "blocked-dossier") {
    return {
      forms: [],
      title: "Votre point de blocage doit d’abord être qualifié",
      explanation: "La prochaine action dépend du message reçu, de l’étape concernée et des pièces déjà transmises. Cette synthèse ne garantit pas qu’une correction sera acceptée par l’organisme compétent.",
      reasons: [answers.blockedStage ? `Le blocage semble concerner : ${answers.blockedStage}.` : "L’étape concernée doit être précisée.", "Un dossier déjà engagé nécessite une reprise de l’historique plutôt qu’un nouveau parcours générique."],
      pointsToValidate: ["Message ou demande exacte reçue", "Dernière version des pièces concernées", "Délai ou action indiqué par l’organisme"],
      action: { label: "Faire examiner mon blocage", href: "/rendez-vous" },
      complexity: "complexe",
    };
  }

  if (founderMode === "duo" || founderMode === "multiple" || start === "multiple" || answers.stage === "multi-founder") {
    forms.push("SAS", "SARL");
    reasons.push("Votre projet implique plusieurs associés : la gouvernance, les pouvoirs et la répartition du capital doivent être organisés.");
    pointsToValidate.push("Rôle du dirigeant et règles de décision", "Répartition du capital et apports", "Conditions d'entrée ou de sortie d'un associé");
  } else {
    forms.push("SASU", "EURL");
    reasons.push("Votre projet est porté seul : les deux principales sociétés unipersonnelles méritent une comparaison.");
    pointsToValidate.push("Mode de rémunération du dirigeant", "Protection sociale recherchée", "Arrivée future d'associés");
  }

  if (answers.currentStructure === "micro" || start === "micro" || answers.stage === "existing-business-transition") {
    reasons.push("Votre activité existe déjà : le calendrier de transition, les contrats et la continuité de facturation doivent être anticipés.");
    pointsToValidate.push("Date de bascule et clôture de l'ancienne structure", "Contrats clients et fournisseurs", "Niveau réel de charges");
  }

  if (start === "employee" || answers.professionalStatus === "employee") {
    reasons.push("Votre situation salariée nécessite de vérifier le calendrier, les obligations de loyauté et les éventuelles clauses contractuelles.");
    pointsToValidate.push("Clauses de votre contrat de travail", "Compatibilité avec l’activité envisagée", "Date de démarrage et disponibilité");
  }

  if (start === "job-seeker" || answers.professionalStatus === "job-seeker") {
    reasons.push("Votre calendrier peut interagir avec des dispositifs dont l’éligibilité dépend de votre dossier et des démarches effectuées.");
    pointsToValidate.push("Conditions ARE, ARCE et ACRE applicables", "Date de création envisagée", "Rémunération prévue au démarrage");
  }

  if (answers.remunerationTiming === "immediate") {
    reasons.push("Vous envisagez une rémunération rapide : le régime social du dirigeant devient un point central de la comparaison.");
    pointsToValidate.push("Montant et fréquence de la rémunération", "Trésorerie disponible au lancement");
  }

  if (priorities.includes("investors")) {
    reasons.push("Vous envisagez l'entrée d'investisseurs : une structure par actions peut offrir davantage de souplesse.");
    if (founderMode === "duo" || founderMode === "multiple") forms.unshift("SAS");
    else forms.unshift("SASU");
  }

  if (priorities.includes("simplicity") || priorities.includes("cost-control")) {
    pointsToValidate.push("Pertinence d'une entreprise individuelle ou du régime micro pour la phase de démarrage");
    forms.push("EI", "MICRO");
  }

  if (answers.supportLevel === "human-review") pointsToValidate.push("Revue humaine des hypothèses et du calendrier");

  const multi = founderMode === "duo" || founderMode === "multiple" || start === "multiple";
  const complexity = multi ? "complexe" : start === "micro" || start === "employee" || start === "job-seeker" ? "modéré" : "simple";

  const action = answers.timeline === "under-30"
    ? { label: "Créer mon espace projet", href: "/inscription" }
    : answers.supportLevel === "human-review"
      ? { label: "Demander une revue humaine", href: "/rendez-vous" }
      : start === "micro"
      ? { label: "Planifier ma transition", href: "/rendez-vous" }
      : { label: "Enregistrer ma synthèse", href: "/inscription" };

  return {
    forms: unique(forms).slice(0, 4),
    title: multi
      ? "Votre projet doit principalement comparer une SAS et une SARL"
      : "Votre projet doit principalement comparer une SASU et une EURL",
    explanation: "Cette orientation est fournie à titre indicatif à partir de vos réponses. Certains éléments doivent être validés selon votre situation personnelle, votre activité et votre calendrier.",
    reasons: unique(reasons).slice(0, 3),
    pointsToValidate: unique(pointsToValidate).slice(0, 5),
    action,
    complexity,
  };
}
