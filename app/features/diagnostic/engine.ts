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

  if (founderMode === "duo" || founderMode === "multiple" || answers.stage === "multi-founder") {
    forms.push("SAS", "SARL");
    reasons.push("Votre projet implique plusieurs associés : la gouvernance, les pouvoirs et la répartition du capital doivent être organisés.");
    pointsToValidate.push("Rôle du dirigeant et règles de décision", "Répartition du capital et apports", "Conditions d'entrée ou de sortie d'un associé");
  } else {
    forms.push("SASU", "EURL");
    reasons.push("Votre projet est porté seul : les deux principales sociétés unipersonnelles méritent une comparaison.");
    pointsToValidate.push("Mode de rémunération du dirigeant", "Protection sociale recherchée", "Arrivée future d'associés");
  }

  if (answers.currentStructure === "micro" || answers.stage === "existing-business-transition") {
    reasons.push("Votre activité existe déjà : le calendrier de transition, les contrats et la continuité de facturation doivent être anticipés.");
    pointsToValidate.push("Date de bascule et clôture de l'ancienne structure", "Contrats clients et fournisseurs", "Niveau réel de charges");
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

  const complexity =
    answers.stage === "blocked-dossier" || founderMode === "multiple"
      ? "complexe"
      : answers.stage === "existing-business-transition" || founderMode === "duo"
        ? "modéré"
        : "simple";

  const action = answers.timeline === "under-30"
    ? { label: "Commencer mon dossier", href: "/inscription" }
    : answers.stage === "existing-business-transition"
      ? { label: "Planifier ma transition", href: "/rendez-vous" }
      : founderMode === "duo" || founderMode === "multiple"
        ? { label: "Inviter mes associés", href: "/inscription" }
        : { label: "Faire valider mon orientation", href: "/rendez-vous" };

  return {
    forms: unique(forms).slice(0, 4),
    title: founderMode === "duo" || founderMode === "multiple"
      ? "Votre projet doit comparer une SAS et une SARL"
      : "Votre projet doit principalement comparer une SASU et une EURL",
    explanation: "Cette orientation est issue de vos réponses. Elle constitue une base de discussion et non un conseil juridique personnalisé.",
    reasons: unique(reasons),
    pointsToValidate: unique(pointsToValidate),
    action,
    complexity,
  };
}
