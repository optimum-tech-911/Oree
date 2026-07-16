import { isSupabaseConfigured, supabase } from "@/services/supabase/client";
import { mockDocuments, mockProject, mockTimeline } from "@/data/mock";
import type { DiagnosticAnswers, DocumentItem, Project, TimelineEvent } from "@/types";
import { readAttribution } from "@/services/attribution";
import { createId } from "@/lib/id";
export interface ProjectRepository {
  getCurrent(): Promise<Project>;
  getDocuments(projectId: string): Promise<DocumentItem[]>;
  getTimeline(projectId: string): Promise<TimelineEvent[]>;
}

export interface LeadRepository {
  submit(input: DiagnosticAnswers): Promise<{ id: string; demo: boolean }>;
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
  async submit(input) {
    if (!isSupabaseConfigured || !supabase) {
      await new Promise((resolve) => setTimeout(resolve, 650));
      return { id: `demo_${createId()}`, demo: true };
    }
    const { data, error } = await supabase.functions.invoke("submit-lead", {
      body: { answers: input, attribution: readAttribution() },
    });
    if (error) throw error;
    return { id: data.id as string, demo: false };
  },
};
