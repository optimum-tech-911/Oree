export const leadStatusDefinitions = {
  new: { label: "Nouveau", outcome: false },
  to_contact: { label: "À contacter", outcome: false },
  contacted: { label: "Contacté", outcome: false },
  qualified: { label: "Qualifié", outcome: false },
  appointment_booked: { label: "Rendez-vous", outcome: false },
  proposal_sent: { label: "Proposition envoyée", outcome: false },
  won: { label: "Gagné", outcome: true },
  lost: { label: "Perdu", outcome: true },
  out_of_scope: { label: "Hors cible", outcome: true },
  micro_only: { label: "Micro uniquement", outcome: true },
} as const;

export type LeadStatus = keyof typeof leadStatusDefinitions;

export const leadStatuses = Object.keys(leadStatusDefinitions) as LeadStatus[];

export const leadStatusTransitions: Record<LeadStatus, readonly LeadStatus[]> = {
  new: ["to_contact", "contacted", "qualified", "appointment_booked", "lost", "out_of_scope", "micro_only"],
  to_contact: ["contacted", "qualified", "appointment_booked", "lost", "out_of_scope", "micro_only"],
  contacted: ["to_contact", "qualified", "appointment_booked", "proposal_sent", "lost", "out_of_scope", "micro_only"],
  qualified: ["contacted", "appointment_booked", "proposal_sent", "won", "lost", "out_of_scope"],
  appointment_booked: ["contacted", "qualified", "proposal_sent", "won", "lost", "out_of_scope"],
  proposal_sent: ["contacted", "qualified", "appointment_booked", "won", "lost", "out_of_scope"],
  won: [],
  lost: ["to_contact", "contacted"],
  out_of_scope: ["to_contact"],
  micro_only: ["to_contact"],
};

export function isLeadStatus(value: string): value is LeadStatus {
  return value in leadStatusDefinitions;
}

export function leadStatusLabel(value: string) {
  return isLeadStatus(value) ? leadStatusDefinitions[value].label : value;
}

export function canTransitionLeadStatus(from: LeadStatus, to: LeadStatus) {
  return from === to || leadStatusTransitions[from].includes(to);
}
