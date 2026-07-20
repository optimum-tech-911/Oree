import { describe, expect, it } from "vitest";
import { parseDiagnosticDraft, serializeDiagnosticDraft } from "@/features/diagnostic/useDiagnostic";
import type { DiagnosticAnswers } from "@/types";

describe("diagnostic local draft", () => {
  it("persists structured progress without contact data, consent flags or free text", () => {
    const answers: DiagnosticAnswers = {
      startingSituation: "blocked",
      stage: "blocked-dossier",
      blockedStage: "statuts",
      blockedMessage: "Message libre potentiellement sensible reçu du greffe",
      firstName: "Camille",
      lastName: "Martin",
      email: "camille@example.test",
      phone: "0600000000",
      privacyAccepted: true,
      wantsCallback: true,
    };

    const serialized = serializeDiagnosticDraft(answers, "blockage");
    const stored = JSON.parse(serialized) as { answers: Record<string, unknown>; step: string };

    expect(stored.step).toBe("blockage");
    expect(stored.answers).toEqual({
      startingSituation: "blocked",
      stage: "blocked-dossier",
      blockedStage: "statuts",
    });
    expect(serialized).not.toContain("Camille");
    expect(serialized).not.toContain("example.test");
    expect(serialized).not.toContain("0600000000");
    expect(serialized).not.toContain("Message libre");
    expect(stored.answers).not.toHaveProperty("privacyAccepted");
    expect(stored.answers).not.toHaveProperty("wantsCallback");
  });

  it("scrubs a legacy raw draft and keeps an available safe resume step", () => {
    const legacy = JSON.stringify({
      founderMode: "solo",
      activity: "conseil",
      priorities: ["simplicity", "cost-control"],
      firstName: "Alex",
      lastName: "Durand",
      email: "alex@example.test",
      phone: "0700000000",
      blockedMessage: "Texte libre",
      privacyAccepted: true,
      wantsCallback: false,
      step: "activity",
    });

    const draft = parseDiagnosticDraft(legacy);

    expect(draft.answers).toEqual({
      startingSituation: "solo",
      founderMode: "solo",
      activity: "conseil",
      priorities: ["simplicity", "cost-control"],
    });
    // Legacy drafts did not store a trusted step; they restart safely.
    expect(draft.step).toBe("starting");
  });

  it("preserves a current safe step but rejects one outside the selected branch", () => {
    const safe = parseDiagnosticDraft(serializeDiagnosticDraft({ startingSituation: "solo", founderMode: "solo" }, "activity"));
    const mismatched = parseDiagnosticDraft(JSON.stringify({ version: 2, answers: { startingSituation: "blocked" }, step: "support" }));

    expect(safe.step).toBe("activity");
    expect(mismatched.step).toBe("starting");
  });
});
