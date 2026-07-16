export type LegalFormCode = "SASU" | "EURL" | "SAS" | "SARL" | "EI" | "MICRO";

export type LegalForm = {
  code: LegalFormCode;
  label: string;
  family: "société" | "entreprise individuelle";
  founderCount: "solo" | "multiple" | "both";
  summary: string;
  bestFor: string[];
  watchouts: string[];
  governance: string;
  socialRegime: string;
  evolution: string;
  accent: string;
};

export type ProjectStage =
  | "exploration"
  | "status-comparison"
  | "ready-to-create"
  | "existing-business-transition"
  | "multi-founder"
  | "blocked-dossier";

export type DiagnosticAnswers = {
  stage?: ProjectStage;
  founderMode?: "solo" | "duo" | "multiple" | "unknown";
  professionalStatus?: "employee" | "job-seeker" | "student" | "independent" | "director" | "other";
  currentStructure?: "none" | "micro" | "ei" | "company" | "foreign";
  activity?: string;
  existingClients?: boolean;
  priorities?: string[];
  timeline?: "under-30" | "30-90" | "over-90" | "unknown";
  department?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export type DiagnosticRecommendation = {
  forms: LegalFormCode[];
  title: string;
  explanation: string;
  reasons: string[];
  pointsToValidate: string[];
  action: { label: string; href: string };
  complexity: "simple" | "modéré" | "complexe";
};

export type ProjectStatus =
  | "draft"
  | "orientation"
  | "information_collection"
  | "documents_review"
  | "awaiting_signature"
  | "formalities_preparation"
  | "submitted"
  | "correction_required"
  | "registered";

export type Project = {
  id: string;
  displayName: string;
  legalForm: LegalFormCode | null;
  activity: string;
  department: string;
  desiredDate: string;
  progress: number;
  status: ProjectStatus;
  advisor: { name: string; role: string; initials: string };
  nextAction: { title: string; description: string; href: string };
};

export type DocumentItem = {
  id: string;
  label: string;
  category: string;
  status: "required" | "uploaded" | "under_review" | "changes_requested" | "approved" | "signed";
  owner: string;
  updatedAt?: string;
  comment?: string;
};

export type TimelineEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  state: "done" | "current" | "upcoming";
};
