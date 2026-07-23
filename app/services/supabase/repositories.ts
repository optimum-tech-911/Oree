import { isSupabaseConfigured, supabase } from "@/services/supabase/client";
import { mockDocuments, mockProject, mockTimeline } from "@/data/mock";
import type { DiagnosticAnswers, DiagnosticRecommendation, DocumentItem, Project, TimelineEvent } from "@/types";
import { readAttribution, type Attribution } from "@/services/attribution";
import { createId } from "@/lib/id";
export interface ProjectRepository {
  getCurrent(): Promise<Project>;
  getDocuments(projectId: string): Promise<DocumentItem[]>;
  getTimeline(projectId: string): Promise<TimelineEvent[]>;
}

export interface LeadRepository {
  submit(input: DiagnosticAnswers, options?: LeadSubmissionOptions): Promise<LeadSubmissionResult>;
}

export type LeadSubmissionResult = { id: string; demo: boolean; claimToken?: string };

export type LeadSubmissionBody = {
  answers: DiagnosticAnswers;
  attribution?: Attribution;
  result?: DiagnosticRecommendation;
  submissionId?: string;
  anonymousSessionId?: string;
  honeypot?: string;
};

export type LeadSubmissionOptions = {
  result?: DiagnosticRecommendation;
  submissionId?: string;
  anonymousSessionId?: string;
  honeypot?: string;
};

export function buildLeadSubmissionBody(
  input: DiagnosticAnswers,
  attribution: Attribution | null = readAttribution(),
  options: LeadSubmissionOptions = {},
): LeadSubmissionBody {
  const body: LeadSubmissionBody = { answers: input };
  if (attribution) body.attribution = attribution;
  if (options.result) body.result = options.result;
  if (options.submissionId) body.submissionId = options.submissionId;
  if (options.anonymousSessionId) body.anonymousSessionId = options.anonymousSessionId;
  if (options.honeypot) body.honeypot = options.honeypot;
  return body;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseLeadSubmissionResponse(data: unknown): LeadSubmissionResult {
  if (!data || typeof data !== "object") throw new Error("La transmission n’a pas été confirmée par le serveur.");
  const record = data as Record<string, unknown>;
  if (typeof record.id !== "string" || !UUID_PATTERN.test(record.id)) {
    throw new Error("La transmission n’a pas été confirmée par le serveur.");
  }
  if (typeof record.claimToken !== "string" || record.claimToken.length < 40 || record.claimToken.length > 200) {
    throw new Error("La continuité sécurisée du dossier n’a pas pu être préparée.");
  }
  return { id: record.id, claimToken: record.claimToken, demo: false };
}

export const projectRepository: ProjectRepository = {
  async getCurrent() {
    if (!isSupabaseConfigured || !supabase) return structuredClone(mockProject);
    const { data, error } = await supabase.from("projects").select("*").limit(1).maybeSingle();
    if (error || !data) return structuredClone(mockProject);
    return {
      ...mockProject,
      id: data.id,
      displayName: data.display_name ?? mockProject.displayName,
      progress: data.progress ?? mockProject.progress,
      status: data.project_stage ?? mockProject.status,
    } as Project;
  },
  async getDocuments(projectId) {
    if (!isSupabaseConfigured || !supabase) return structuredClone(mockDocuments);
    const { data, error } = await supabase
      .from("document_requirements")
      .select("id,label,category,status,updated_at,advisor_comment")
      .eq("project_id", projectId)
      .order("created_at");
    if (error || !data) return structuredClone(mockDocuments);
    return data.map((item) => ({
      id: item.id,
      label: item.label,
      category: item.category ?? "Projet",
      status: item.status,
      owner: "Vous",
      updatedAt: item.updated_at,
      comment: item.advisor_comment,
    })) as DocumentItem[];
  },
  async getTimeline(projectId) {
    if (!isSupabaseConfigured || !supabase) return structuredClone(mockTimeline);
    const { data, error } = await supabase
      .from("project_events")
      .select("id,title,description,created_at,event_state")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    if (error || !data) return structuredClone(mockTimeline);
    return data.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description ?? "",
      date: new Date(event.created_at).toLocaleDateString("fr-FR"),
      state: event.event_state ?? "done",
    })) as TimelineEvent[];
  },
};

export const leadRepository: LeadRepository = {
  async submit(input, options) {
    if (!isSupabaseConfigured || !supabase) {
      await new Promise((resolve) => setTimeout(resolve, 650));
      return { id: `demo_${createId()}`, demo: true };
    }
    const { data, error } = await supabase.functions.invoke("submit-lead", {
      body: buildLeadSubmissionBody(input, readAttribution(), options),
    });
    if (error) throw error;
    return parseLeadSubmissionResponse(data);
  },
};
