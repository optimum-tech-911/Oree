import type { DocumentItem, Project, TimelineEvent } from "@/types";

export const mockProject: Project = {
  id: "project_demo_01",
  displayName: "Studio Horizon",
  legalForm: "SASU",
  activity: "Conseil en stratégie digitale",
  department: "34 — Hérault",
  desiredDate: "30 septembre 2026",
  progress: 64,
  status: "documents_review",
  advisor: { name: "Équipe Orée", role: "Suivi du projet", initials: "OR" },
  nextAction: {
    title: "Compléter le justificatif de siège",
    description: "Ajoutez un document récent ou choisissez une autre solution de domiciliation.",
    href: "/app/documents",
  },
};

export const mockDocuments: DocumentItem[] = [
  { id: "d1", label: "Pièce d'identité", category: "Fondateur", status: "approved", owner: "Porteur de projet", updatedAt: "14 juil. 2026" },
  { id: "d2", label: "Justificatif de siège", category: "Société", status: "changes_requested", owner: "Porteur de projet", updatedAt: "15 juil. 2026", comment: "Le document transmis date de plus de trois mois." },
  { id: "d3", label: "Déclaration de non-condamnation", category: "Fondateur", status: "under_review", owner: "Porteur de projet", updatedAt: "15 juil. 2026" },
  { id: "d4", label: "Projet de statuts", category: "Juridique", status: "uploaded", owner: "Équipe Orée", updatedAt: "15 juil. 2026" },
  { id: "d5", label: "Attestation de dépôt du capital", category: "Capital", status: "required", owner: "Porteur de projet" },
  { id: "d6", label: "Mandat de formalités", category: "Juridique", status: "required", owner: "Porteur de projet" },
];

export const mockTimeline: TimelineEvent[] = [
  { id: "t1", title: "Projet créé", description: "Votre espace a été initialisé à partir du diagnostic.", date: "12 juillet", state: "done" },
  { id: "t2", title: "Orientation validée", description: "La SASU a été retenue comme hypothèse de travail.", date: "13 juillet", state: "done" },
  { id: "t3", title: "Documents en vérification", description: "Trois pièces sont en cours de contrôle.", date: "Aujourd'hui", state: "current" },
  { id: "t4", title: "Finalisation des statuts", description: "Prévue après validation des informations et justificatifs.", date: "Prochaine étape", state: "upcoming" },
  { id: "t5", title: "Dépôt de la formalité", description: "Transmission après signature et règlement des frais applicables.", date: "À venir", state: "upcoming" },
  { id: "t6", title: "Immatriculation", description: "Réception des éléments officiels après traitement administratif.", date: "Objectif", state: "upcoming" },
];

export const mockMessages = [
  { id: "m1", author: "Équipe Orée", initials: "OR", time: "09:42", body: "Nous avons vérifié les premières informations du projet. Un justificatif de siège récent reste nécessaire pour poursuivre le contrôle documentaire." },
  { id: "m2", author: "Vous", initials: "PP", time: "10:11", body: "Je déposerai le nouveau document aujourd'hui. Une attestation délivrée en ligne par mon fournisseur peut-elle convenir ?" },
  { id: "m3", author: "Équipe Orée", initials: "OR", time: "10:18", body: "Elle peut être examinée si elle indique le nom du titulaire, l'adresse complète et une date de moins de trois mois. Vous pouvez la transmettre depuis la rubrique Documents." },
];

export const mockLeads = [
  { id: "L-1048", name: "Nora A.", project: "Cabinet de conseil", intent: "SASU", source: "Google — création SASU", score: 88, status: "Rendez-vous réservé", age: "8 min" },
  { id: "L-1047", name: "Mehdi R.", project: "E-commerce à deux", intent: "SAS ou SARL", source: "Google — créer société à deux", score: 82, status: "Qualifié", age: "24 min" },
  { id: "L-1046", name: "Julie P.", project: "Passage micro → société", intent: "EURL / SASU", source: "Google — passer micro en SASU", score: 79, status: "À rappeler", age: "41 min" },
  { id: "L-1045", name: "Tom L.", project: "Application mobile", intent: "Exploration", source: "Accès direct", score: 52, status: "Nouveau", age: "1 h" },
  { id: "L-1044", name: "Sarah B.", project: "Studio créatif", intent: "SASU", source: "Google — prix création SASU", score: 91, status: "Dossier démarré", age: "2 h" },
];
