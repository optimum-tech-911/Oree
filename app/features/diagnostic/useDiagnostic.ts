import { useCallback, useEffect, useMemo, useState } from "react";
import type { DiagnosticAnswers } from "@/types";
import { buildRecommendation } from "@/features/diagnostic/engine";
import { safeStorage } from "@/lib/storage";

const STORAGE_KEY = "oree:diagnostic:v1";

export const diagnosticSteps = ["stage", "founders", "situation", "activity", "priorities", "timeline", "result", "contact"] as const;
export type DiagnosticStep = (typeof diagnosticSteps)[number];

export function useDiagnostic() {
  const [answers, setAnswers] = useState<DiagnosticAnswers>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(safeStorage.get(STORAGE_KEY) ?? "{}") as DiagnosticAnswers;
    } catch {
      return {};
    }
  });
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    safeStorage.set(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  const update = useCallback(<K extends keyof DiagnosticAnswers>(key: K, value: DiagnosticAnswers[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setAnswers({});
    setStepIndex(0);
    safeStorage.remove(STORAGE_KEY);
  }, []);

  const step = diagnosticSteps[stepIndex] ?? "stage";
  const progress = Math.round(((stepIndex + 1) / diagnosticSteps.length) * 100);
  const recommendation = useMemo(() => buildRecommendation(answers), [answers]);

  const canContinue = useMemo(() => {
    switch (step) {
      case "stage": return Boolean(answers.stage);
      case "founders": return Boolean(answers.founderMode);
      case "situation": return Boolean(answers.professionalStatus && answers.currentStructure);
      case "activity": return Boolean(answers.activity);
      case "priorities": return Boolean(answers.priorities?.length);
      case "timeline": return Boolean(answers.timeline && answers.department);
      case "result": return true;
      case "contact": return Boolean(answers.firstName && answers.lastName && answers.email && answers.phone);
      default: return false;
    }
  }, [answers, step]);

  return {
    answers,
    update,
    reset,
    step,
    stepIndex,
    progress,
    recommendation,
    canContinue,
    next: () => setStepIndex((value) => Math.min(value + 1, diagnosticSteps.length - 1)),
    previous: () => setStepIndex((value) => Math.max(value - 1, 0)),
    goTo: (index: number) => setStepIndex(Math.max(0, Math.min(index, diagnosticSteps.length - 1))),
  };
}
