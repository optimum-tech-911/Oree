import { useCallback, useEffect, useMemo, useState } from "react";
import type { DiagnosticAnswers } from "@/types";
import { buildRecommendation } from "@/features/diagnostic/engine";
import { safeStorage } from "@/lib/storage";

const STORAGE_KEY = "oree:diagnostic:v2";
const LEGACY_STORAGE_KEY = "oree:diagnostic:v1";

export type DiagnosticStep = "starting" | "founders" | "situation" | "activity" | "priorities" | "timeline" | "support" | "blockage" | "result" | "contact";

type PersistedDiagnosticDraft = {
  version: 2;
  answers: DiagnosticAnswers;
  step: DiagnosticStep;
};

const persistedSteps = new Set<DiagnosticStep>(["starting", "founders", "situation", "activity", "priorities", "timeline", "support", "blockage", "result", "contact"]);
const startingSituations = new Set<NonNullable<DiagnosticAnswers["startingSituation"]>>(["solo", "multiple", "micro", "employee", "job-seeker", "blocked", "unknown"]);
const projectStages = new Set<NonNullable<DiagnosticAnswers["stage"]>>(["exploration", "status-comparison", "ready-to-create", "existing-business-transition", "multi-founder", "blocked-dossier"]);
const founderModes = new Set<NonNullable<DiagnosticAnswers["founderMode"]>>(["solo", "duo", "multiple", "unknown"]);
const professionalStatuses = new Set<NonNullable<DiagnosticAnswers["professionalStatus"]>>(["employee", "job-seeker", "student", "independent", "director", "other"]);
const currentStructures = new Set<NonNullable<DiagnosticAnswers["currentStructure"]>>(["none", "micro", "ei", "company", "foreign"]);
const timelines = new Set<NonNullable<DiagnosticAnswers["timeline"]>>(["under-30", "30-90", "over-90", "unknown"]);
const remunerationTimings = new Set<NonNullable<DiagnosticAnswers["remunerationTiming"]>>(["immediate", "later", "unknown"]);
const supportLevels = new Set<NonNullable<DiagnosticAnswers["supportLevel"]>>(["orientation", "guided", "human-review"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function copyString<K extends keyof DiagnosticAnswers>(source: Record<string, unknown>, target: DiagnosticAnswers, key: K) {
  if (typeof source[key] === "string") Object.assign(target, { [key]: source[key] });
}

/** Only non-sensitive, structured answers are eligible for the local resume draft. */
export function sanitizeDiagnosticDraftAnswers(input: unknown): DiagnosticAnswers {
  if (!isRecord(input)) return {};
  const answers: DiagnosticAnswers = {};

  if (startingSituations.has(input.startingSituation as NonNullable<DiagnosticAnswers["startingSituation"]>)) answers.startingSituation = input.startingSituation as NonNullable<DiagnosticAnswers["startingSituation"]>;
  if (projectStages.has(input.stage as NonNullable<DiagnosticAnswers["stage"]>)) answers.stage = input.stage as NonNullable<DiagnosticAnswers["stage"]>;
  if (founderModes.has(input.founderMode as NonNullable<DiagnosticAnswers["founderMode"]>)) answers.founderMode = input.founderMode as NonNullable<DiagnosticAnswers["founderMode"]>;
  if (professionalStatuses.has(input.professionalStatus as NonNullable<DiagnosticAnswers["professionalStatus"]>)) answers.professionalStatus = input.professionalStatus as NonNullable<DiagnosticAnswers["professionalStatus"]>;
  if (currentStructures.has(input.currentStructure as NonNullable<DiagnosticAnswers["currentStructure"]>)) answers.currentStructure = input.currentStructure as NonNullable<DiagnosticAnswers["currentStructure"]>;
  if (typeof input.existingClients === "boolean") answers.existingClients = input.existingClients;
  if (timelines.has(input.timeline as NonNullable<DiagnosticAnswers["timeline"]>)) answers.timeline = input.timeline as NonNullable<DiagnosticAnswers["timeline"]>;
  if (remunerationTimings.has(input.remunerationTiming as NonNullable<DiagnosticAnswers["remunerationTiming"]>)) answers.remunerationTiming = input.remunerationTiming as NonNullable<DiagnosticAnswers["remunerationTiming"]>;
  if (supportLevels.has(input.supportLevel as NonNullable<DiagnosticAnswers["supportLevel"]>)) answers.supportLevel = input.supportLevel as NonNullable<DiagnosticAnswers["supportLevel"]>;

  copyString(input, answers, "activity");
  copyString(input, answers, "blockedStage");
  copyString(input, answers, "department");
  if (Array.isArray(input.priorities)) answers.priorities = input.priorities.filter((priority): priority is string => typeof priority === "string").slice(0, 12);

  return answers;
}

export function buildSteps(answers: DiagnosticAnswers): DiagnosticStep[] {
  if (answers.startingSituation === "blocked") return ["starting", "blockage", "result", "contact"];
  return ["starting", "founders", "situation", "activity", "priorities", "timeline", "support", "result", "contact"];
}

function stageFromStart(value: NonNullable<DiagnosticAnswers["startingSituation"]>): DiagnosticAnswers["stage"] {
  switch (value) {
    case "multiple": return "multi-founder";
    case "micro": return "existing-business-transition";
    case "blocked": return "blocked-dossier";
    case "unknown": return "status-comparison";
    default: return "exploration";
  }
}

function inferStartingSituation(answers: DiagnosticAnswers): DiagnosticAnswers {
  if (answers.startingSituation) return answers;
  if (answers.stage === "blocked-dossier") return { ...answers, startingSituation: "blocked" };
  if (answers.stage === "multi-founder" || answers.founderMode === "multiple" || answers.founderMode === "duo") return { ...answers, startingSituation: "multiple" };
  if (answers.currentStructure === "micro" || answers.stage === "existing-business-transition") return { ...answers, startingSituation: "micro" };
  if (answers.professionalStatus === "employee") return { ...answers, startingSituation: "employee" };
  if (answers.professionalStatus === "job-seeker") return { ...answers, startingSituation: "job-seeker" };
  if (answers.founderMode === "solo") return { ...answers, startingSituation: "solo" };
  return answers;
}

export function serializeDiagnosticDraft(answers: DiagnosticAnswers, step: DiagnosticStep): string {
  const safeAnswers = sanitizeDiagnosticDraftAnswers(answers);
  const safeStep = buildSteps(safeAnswers).includes(step) ? step : "starting";
  return JSON.stringify({ version: 2, answers: safeAnswers, step: safeStep } satisfies PersistedDiagnosticDraft);
}

export function parseDiagnosticDraft(raw: string | null): PersistedDiagnosticDraft {
  try {
    const parsed: unknown = JSON.parse(raw ?? "{}");
    const envelope = isRecord(parsed) ? parsed : {};
    const versionedDraft = envelope.version === 2 && isRecord(envelope.answers);
    const candidateAnswers = versionedDraft ? envelope.answers as Record<string, unknown> : envelope;
    const answers = inferStartingSituation(sanitizeDiagnosticDraftAnswers(candidateAnswers));
    const requestedStep = versionedDraft && persistedSteps.has(envelope.step as DiagnosticStep) ? envelope.step as DiagnosticStep : "starting";
    const step = buildSteps(answers).includes(requestedStep) ? requestedStep : "starting";
    return { version: 2, answers, step };
  } catch {
    return { version: 2, answers: {}, step: "starting" };
  }
}

function readDraft(): PersistedDiagnosticDraft {
  const current = safeStorage.get(STORAGE_KEY);
  const legacy = current === null ? safeStorage.get(LEGACY_STORAGE_KEY) : null;
  const draft = parseDiagnosticDraft(current ?? legacy);

  if (Object.keys(draft.answers).length > 0 || draft.step !== "starting") safeStorage.set(STORAGE_KEY, serializeDiagnosticDraft(draft.answers, draft.step));
  else safeStorage.remove(STORAGE_KEY);
  if (legacy !== null) safeStorage.remove(LEGACY_STORAGE_KEY);

  return draft;
}

export function useDiagnostic() {
  const [initialDraft] = useState<PersistedDiagnosticDraft>(() => typeof window === "undefined" ? { version: 2, answers: {}, step: "starting" } : readDraft());
  const [answers, setAnswers] = useState<DiagnosticAnswers>(initialDraft.answers);
  const [stepIndex, setStepIndex] = useState(() => Math.max(0, buildSteps(initialDraft.answers).indexOf(initialDraft.step)));

  const steps = useMemo(() => buildSteps(answers), [answers]);
  const safeStepIndex = Math.min(stepIndex, Math.max(0, steps.length - 1));
  const step = steps[safeStepIndex] ?? "starting";

  useEffect(() => {
    const safeAnswers = sanitizeDiagnosticDraftAnswers(answers);
    if (Object.keys(safeAnswers).length === 0 && step === "starting") safeStorage.remove(STORAGE_KEY);
    else safeStorage.set(STORAGE_KEY, serializeDiagnosticDraft(safeAnswers, step));
  }, [answers, step]);

  const update = useCallback(<K extends keyof DiagnosticAnswers>(key: K, value: DiagnosticAnswers[K]) => {
    setAnswers((current) => {
      if (key === "startingSituation" && value) {
        const start = value as NonNullable<DiagnosticAnswers["startingSituation"]>;
        const derived: DiagnosticAnswers = { stage: stageFromStart(start) };
        if (start === "solo") derived.founderMode = "solo";
        if (start === "multiple") derived.founderMode = "multiple";
        if (start === "micro") { derived.currentStructure = "micro"; derived.professionalStatus = "independent"; }
        if (start === "employee") derived.professionalStatus = "employee";
        if (start === "job-seeker") derived.professionalStatus = "job-seeker";
        return { ...current, ...derived, startingSituation: start };
      }
      return { ...current, [key]: value };
    });
  }, []);

  const beginFromSituation = useCallback((start: NonNullable<DiagnosticAnswers["startingSituation"]>) => {
    const derived: DiagnosticAnswers = { startingSituation: start, stage: stageFromStart(start) };
    if (start === "solo") derived.founderMode = "solo";
    if (start === "multiple") derived.founderMode = "multiple";
    if (start === "micro") { derived.currentStructure = "micro"; derived.professionalStatus = "independent"; }
    if (start === "employee") derived.professionalStatus = "employee";
    if (start === "job-seeker") derived.professionalStatus = "job-seeker";
    setAnswers(derived);
    setStepIndex(1);
  }, []);

  const reset = useCallback(() => {
    setAnswers({});
    setStepIndex(0);
    safeStorage.remove(STORAGE_KEY);
    safeStorage.remove(LEGACY_STORAGE_KEY);
  }, []);

  const progress = Math.round(((safeStepIndex + 1) / steps.length) * 100);
  const recommendation = useMemo(() => buildRecommendation(answers), [answers]);

  const canContinue = useMemo(() => {
    switch (step) {
      case "starting": return Boolean(answers.startingSituation);
      case "founders": return Boolean(answers.founderMode);
      case "situation": return Boolean(answers.professionalStatus && answers.currentStructure);
      case "activity": return Boolean(answers.activity);
      case "priorities": return Boolean(answers.priorities?.length);
      case "timeline": return Boolean(answers.timeline && answers.department && /^(?:0[1-9]|[1-8]\d|9[0-5]|2A|2B|97[1-6])$/i.test(answers.department.trim()));
      case "support": return Boolean(answers.remunerationTiming && answers.supportLevel);
      case "blockage": return Boolean(answers.blockedStage && answers.blockedMessage?.trim().length && answers.blockedMessage.trim().length >= 12);
      case "result": return true;
      case "contact": {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email?.trim() ?? "");
        const phoneValid = !answers.wantsCallback || /^(?:\+33|0)[1-9](?:[ .-]?\d{2}){4}$/.test(answers.phone?.trim() ?? "");
        return Boolean((answers.firstName?.trim().length ?? 0) >= 2 && (answers.lastName?.trim().length ?? 0) >= 2 && emailValid && answers.privacyAccepted && phoneValid);
      }
      default: return false;
    }
  }, [answers, step]);

  return {
    answers,
    update,
    beginFromSituation,
    reset,
    steps,
    step,
    stepIndex: safeStepIndex,
    progress,
    recommendation,
    canContinue,
    next: () => setStepIndex(Math.min(safeStepIndex + 1, steps.length - 1)),
    previous: () => setStepIndex(Math.max(safeStepIndex - 1, 0)),
    goTo: (index: number) => setStepIndex(Math.max(0, Math.min(index, steps.length - 1))),
  };
}
