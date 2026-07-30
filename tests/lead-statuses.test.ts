import { describe, expect, it } from "vitest";
import {
  canTransitionLeadStatus,
  leadStatusLabel,
  leadStatuses,
} from "@/config/lead-statuses";

describe("cycle commercial des leads", () => {
  it("expose les dix statuts confirmés en français", () => {
    expect(leadStatuses).toEqual([
      "new",
      "to_contact",
      "contacted",
      "qualified",
      "appointment_booked",
      "proposal_sent",
      "won",
      "lost",
      "out_of_scope",
      "micro_only",
    ]);
    expect(leadStatusLabel("won")).toBe("Gagné");
    expect(leadStatusLabel("micro_only")).toBe("Micro uniquement");
  });

  it("autorise les progressions utiles et bloque la sortie d’un lead gagné", () => {
    expect(canTransitionLeadStatus("new", "qualified")).toBe(true);
    expect(canTransitionLeadStatus("qualified", "won")).toBe(true);
    expect(canTransitionLeadStatus("won", "contacted")).toBe(false);
    expect(canTransitionLeadStatus("lost", "to_contact")).toBe(true);
  });
});
