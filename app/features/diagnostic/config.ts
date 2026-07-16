import {
  BadgeQuestionMark,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CircleDollarSign,
  CircleUserRound,
  Compass,
  Laptop2,
  Lightbulb,
  PackageCheck,
  Scale,
  Store,
  Truck,
  UsersRound,
  Utensils,
  WandSparkles,
  Wrench,
} from "lucide-react";
import type { DiagnosticAnswers, ProjectStage } from "@/types";

export type Choice<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
  icon?: typeof Lightbulb;
};

export const stageChoices: Choice<ProjectStage>[] = [
  { value: "exploration", label: "J'explore encore", description: "J'ai une idée, mais tout n'est pas encore défini.", icon: Lightbulb },
  { value: "status-comparison", label: "Je cherche le bon statut", description: "Je veux comparer les structures selon mon projet.", icon: Scale },
  { value: "ready-to-create", label: "Je suis prêt à créer", description: "Mon activité est définie et je veux avancer.", icon: PackageCheck },
  { value: "existing-business-transition", label: "J'exerce déjà", description: "Je suis en micro, EI ou indépendant et je veux évoluer.", icon: BriefcaseBusiness },
  { value: "multi-founder", label: "Nous créons à plusieurs", description: "Le projet implique au moins un autre associé.", icon: UsersRound },
  { value: "blocked-dossier", label: "Mon dossier est bloqué", description: "J'ai commencé les démarches et reçu une demande ou un rejet.", icon: BadgeQuestionMark },
];

export const founderChoices: Choice<NonNullable<DiagnosticAnswers["founderMode"]>>[] = [
  { value: "solo", label: "Seul", description: "Je serai l'unique associé ou entrepreneur.", icon: CircleUserRound },
  { value: "duo", label: "À deux", description: "Le projet réunit deux associés.", icon: UsersRound },
  { value: "multiple", label: "À plusieurs", description: "Trois associés ou davantage.", icon: Building2 },
  { value: "unknown", label: "Pas encore décidé", description: "Je veux d'abord comprendre les possibilités.", icon: Compass },
];

export const professionalChoices: Choice<NonNullable<DiagnosticAnswers["professionalStatus"]>>[] = [
  { value: "employee", label: "Salarié", description: "Je suis actuellement en poste." },
  { value: "job-seeker", label: "Demandeur d'emploi", description: "Je prépare une création ou une reprise." },
  { value: "student", label: "Étudiant", description: "Je développe un premier projet." },
  { value: "independent", label: "Indépendant", description: "J'exerce déjà une activité." },
  { value: "director", label: "Dirigeant", description: "Je gère déjà une autre structure." },
  { value: "other", label: "Autre situation", description: "Ma situation ne correspond pas aux choix précédents." },
];

export const structureChoices: Choice<NonNullable<DiagnosticAnswers["currentStructure"]>>[] = [
  { value: "none", label: "Aucune structure", description: "L'activité n'a pas encore commencé." },
  { value: "micro", label: "Micro-entreprise", description: "J'exerce sous le régime micro." },
  { value: "ei", label: "Entreprise individuelle", description: "J'exerce en nom propre hors micro." },
  { value: "company", label: "Société française", description: "Je possède ou dirige déjà une société." },
  { value: "foreign", label: "Structure étrangère", description: "L'activité existe hors de France." },
];

export const activityChoices: Choice[] = [
  { value: "consulting", label: "Conseil & services", description: "Conseil, formation, marketing, prestations B2B.", icon: BriefcaseBusiness },
  { value: "digital", label: "Numérique & technologie", description: "Développement, data, cybersécurité, SaaS.", icon: Laptop2 },
  { value: "commerce", label: "Commerce & e-commerce", description: "Vente de produits, boutique ou activité en ligne.", icon: Store },
  { value: "craft", label: "Artisanat & travaux", description: "Construction, réparation, fabrication, métiers manuels.", icon: Wrench },
  { value: "food", label: "Restauration & alimentation", description: "Restaurant, traiteur, commerce alimentaire.", icon: Utensils },
  { value: "transport", label: "Transport & livraison", description: "Transport de personnes, marchandises ou logistique.", icon: Truck },
  { value: "creative", label: "Création & communication", description: "Design, photo, vidéo, contenu et production.", icon: WandSparkles },
  { value: "other", label: "Autre activité", description: "Je préciserai mon activité dans la suite.", icon: Compass },
];

export const priorityChoices: Choice[] = [
  { value: "simplicity", label: "Garder un fonctionnement simple", icon: Compass },
  { value: "cost-control", label: "Maîtriser les coûts au démarrage", icon: CircleDollarSign },
  { value: "protection", label: "Structurer et protéger le projet", icon: Building2 },
  { value: "social-protection", label: "Comprendre la protection sociale", icon: Scale },
  { value: "investors", label: "Accueillir des investisseurs plus tard", icon: UsersRound },
  { value: "hire", label: "Recruter ou développer une équipe", icon: BriefcaseBusiness },
  { value: "credibility", label: "Renforcer la crédibilité commerciale", icon: PackageCheck },
  { value: "speed", label: "Avancer rapidement", icon: CalendarClock },
];

export const timelineChoices: Choice<NonNullable<DiagnosticAnswers["timeline"]>>[] = [
  { value: "under-30", label: "Moins de 30 jours", description: "Je souhaite engager la création rapidement." },
  { value: "30-90", label: "Entre 1 et 3 mois", description: "Je prépare activement le lancement." },
  { value: "over-90", label: "Plus de 3 mois", description: "Je veux structurer le projet à l'avance." },
  { value: "unknown", label: "Je ne sais pas encore", description: "Je veux clarifier les étapes avant de fixer une date." },
];
