import { describe, expect, it } from "vitest";
import { buildRecommendation } from "@/features/diagnostic/engine";

 describe("buildRecommendation", () => {
  it("prioritise SASU et EURL pour un projet solo", () => {
    const result = buildRecommendation({ founderMode: "solo", stage: "ready-to-create", timeline: "under-30" });
    expect(result.forms.slice(0, 2)).toEqual(["SASU", "EURL"]);
    expect(result.action.href).toBe("/inscription");
    expect(result.complexity).toBe("simple");
  });

  it("prioritise SAS et SARL pour plusieurs associés", () => {
    const result = buildRecommendation({ founderMode: "multiple", stage: "multi-founder" });
    expect(result.forms.slice(0, 2)).toEqual(["SAS", "SARL"]);
    expect(result.complexity).toBe("complexe");
    expect(result.pointsToValidate.join(" ")).toContain("capital");
  });

  it("ajoute une piste EI ou micro lorsque simplicité et coûts dominent", () => {
    const result = buildRecommendation({ founderMode: "solo", priorities: ["simplicity", "cost-control"] });
    expect(result.forms).toContain("EI");
    expect(result.forms).toContain("MICRO");
  });

  it("met en avant une structure par actions quand des investisseurs sont envisagés", () => {
    const result = buildRecommendation({ founderMode: "solo", priorities: ["investors"] });
    expect(result.forms[0]).toBe("SASU");
    expect(result.reasons.join(" ")).toContain("investisseurs");
  });

  it("qualifie un dossier bloqué avant de proposer une forme juridique", () => {
    const result = buildRecommendation({ startingSituation: "blocked", blockedStage: "statuts" });
    expect(result.forms).toEqual([]);
    expect(result.complexity).toBe("complexe");
    expect(result.action.href).toBe("/rendez-vous");
  });

  it("signale les vérifications nécessaires pour un demandeur d’emploi", () => {
    const result = buildRecommendation({ startingSituation: "job-seeker", professionalStatus: "job-seeker", founderMode: "solo" });
    expect(result.complexity).toBe("modéré");
    expect(result.pointsToValidate.join(" ")).toContain("ARE");
  });
});
