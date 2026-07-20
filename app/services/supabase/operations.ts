import { isSupabaseConfigured, supabase } from "@/services/supabase/client";
import { mockLeads } from "@/data/mock";

function ensure(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export type OpsLead = {
  id: string; name: string; email: string; phone: string; stage: string; window: string;
  source: string; campaign: string; status: string; score: number; advisorId?: string; createdAt: string;
};

export type OpsProject = {
  id: string; displayName: string; stage: string; progress: number; legalForm: string;
  department: string; ownerId: string; advisorId?: string; createdAt: string;
};

export type OpsRequirement = {
  id: string; projectId: string; projectName: string; label: string; category: string;
  status: string; comment: string; dueAt?: string; updatedAt: string;
};

export type OpsAppointment = {
  id: string; projectId?: string; projectName: string; startsAt: string; endsAt: string;
  status: string; type: string; advisorId?: string; notes: string;
};

export type OpsTeamMember = {
  id: string; name: string; email: string; role: "advisor" | "admin"; active: boolean; availability: string;
};

export type OpsDashboard = {
  demo: boolean;
  leads: OpsLead[];
  projects: OpsProject[];
  requirements: OpsRequirement[];
  appointments: OpsAppointment[];
  team: OpsTeamMember[];
};

function demoDashboard(): OpsDashboard {
  return {
    demo: true,
    leads: mockLeads.map((lead, index) => ({ id: lead.id, name: lead.name, email: "", phone: "", stage: lead.intent, window: "", source: lead.source, campaign: "", status: lead.status, score: lead.score, createdAt: new Date(Date.now() - index * 3_600_000).toISOString() })),
    projects: [], requirements: [], appointments: [], team: [],
  };
}

export const operationsRepository = {
  async getDashboard(): Promise<OpsDashboard> {
    if (!isSupabaseConfigured || !supabase) return demoDashboard();
    const [leadsResult, projectsResult, requirementsResult, appointmentsResult, rolesResult] = await Promise.all([
      supabase.from("leads").select("id,first_name,last_name,email,phone,project_stage,desired_creation_window,source_page,commercial_status,commercial_score,assigned_advisor_id,created_at").order("created_at", { ascending: false }).limit(500),
      supabase.from("projects").select("id,display_name,project_stage,progress,current_legal_form,department,owner_user_id,assigned_advisor_id,created_at").order("created_at", { ascending: false }).limit(500),
      supabase.from("document_requirements").select("id,project_id,label,category,status,advisor_comment,due_at,updated_at").order("updated_at", { ascending: false }).limit(500),
      supabase.from("appointments").select("id,project_id,starts_at,ends_at,status,appointment_type,advisor_id,notes").order("starts_at", { ascending: true }).limit(500),
      supabase.from("staff_roles").select("user_id,role,active").order("created_at"),
    ]);
    [leadsResult.error, projectsResult.error, requirementsResult.error, appointmentsResult.error, rolesResult.error].forEach(ensure);

    const leadIds = (leadsResult.data ?? []).map((row) => row.id);
    const attributionResult = leadIds.length ? await supabase.from("lead_attributions").select("lead_id,first_source,first_medium,first_campaign,first_term,first_landing_page").in("lead_id", leadIds) : { data: [], error: null };
    ensure(attributionResult.error);
    const attributionByLead = new Map((attributionResult.data ?? []).map((row) => [row.lead_id, row]));

    const projects: OpsProject[] = (projectsResult.data ?? []).map((row) => ({ id: row.id, displayName: row.display_name, stage: row.project_stage, progress: row.progress, legalForm: row.current_legal_form ?? "À confirmer", department: row.department ?? "", ownerId: row.owner_user_id, advisorId: row.assigned_advisor_id ?? undefined, createdAt: row.created_at }));
    const projectById = new Map(projects.map((project) => [project.id, project]));

    const roleRows = rolesResult.data ?? [];
    const roleUserIds = roleRows.map((row) => row.user_id);
    const profilesResult = roleUserIds.length ? await supabase.from("profiles").select("id,first_name,last_name,availability_note").in("id", roleUserIds) : { data: [], error: null };
    ensure(profilesResult.error);
    const profileById = new Map((profilesResult.data ?? []).map((row) => [row.id, row]));

    return {
      demo: false,
      leads: (leadsResult.data ?? []).map((row) => {
        const attribution = attributionByLead.get(row.id);
        return { id: row.id, name: `${row.first_name} ${row.last_name}`.trim(), email: row.email, phone: row.phone ?? "", stage: row.project_stage ?? "À préciser", window: row.desired_creation_window ?? "", source: attribution?.first_source ?? row.source_page ?? "Accès direct", campaign: attribution?.first_campaign ?? "", status: row.commercial_status, score: row.commercial_score, advisorId: row.assigned_advisor_id ?? undefined, createdAt: row.created_at };
      }),
      projects,
      requirements: (requirementsResult.data ?? []).map((row) => ({ id: row.id, projectId: row.project_id, projectName: projectById.get(row.project_id)?.displayName ?? "Projet", label: row.label, category: row.category, status: row.status, comment: row.advisor_comment ?? "", dueAt: row.due_at ?? undefined, updatedAt: row.updated_at })),
      appointments: (appointmentsResult.data ?? []).map((row) => ({ id: row.id, projectId: row.project_id ?? undefined, projectName: row.project_id ? projectById.get(row.project_id)?.displayName ?? "Projet" : "Prospect", startsAt: row.starts_at, endsAt: row.ends_at, status: row.status, type: row.appointment_type, advisorId: row.advisor_id ?? undefined, notes: row.notes ?? "" })),
      team: roleRows.map((row) => { const profile = profileById.get(row.user_id); return { id: row.user_id, name: [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Compte équipe", email: "", role: row.role, active: row.active, availability: profile?.availability_note ?? "" } as OpsTeamMember; }),
    };
  },

  async getInbox() {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data: projects, error: projectError } = await supabase.from("projects").select("id,display_name,owner_user_id,assigned_advisor_id").order("created_at", { ascending: false });
    ensure(projectError);
    const projectIds = (projects ?? []).map((row) => row.id);
    if (!projectIds.length) return [];
    const { data: conversations, error: conversationError } = await supabase.from("conversations").select("id,project_id").in("project_id", projectIds);
    ensure(conversationError);
    const conversationIds = (conversations ?? []).map((row) => row.id);
    const { data: messages, error: messageError } = conversationIds.length ? await supabase.from("messages").select("id,conversation_id,sender_user_id,body,internal_only,created_at").in("conversation_id", conversationIds).order("created_at") : { data: [], error: null };
    ensure(messageError);
    const messagesByConversation = new Map<string, typeof messages>();
    for (const message of messages ?? []) messagesByConversation.set(message.conversation_id, [...(messagesByConversation.get(message.conversation_id) ?? []), message]);
    const projectById = new Map((projects ?? []).map((project) => [project.id, project]));
    return (conversations ?? []).map((conversation) => ({ ...conversation, project: projectById.get(conversation.project_id), messages: messagesByConversation.get(conversation.id) ?? [] }));
  },

  async getAudit() {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase.from("audit_events").select("id,actor_user_id,project_id,action,entity_type,entity_id,metadata,created_at").order("created_at", { ascending: false }).limit(300);
    ensure(error);
    return data ?? [];
  },

  async updateLead(id: string, status: string, score: number, advisorId?: string) {
    if (!isSupabaseConfigured || !supabase) return;
    const { error } = await supabase.rpc("ops_update_lead", { p_lead_id: id, p_status: status, p_score: score, p_assigned_advisor_id: advisorId ?? null });
    ensure(error);
  },

  async updateProject(id: string, stage: string, progress: number) {
    if (!isSupabaseConfigured || !supabase) return;
    const { error } = await supabase.rpc("ops_update_project_stage", { p_project_id: id, p_stage: stage, p_progress: progress });
    ensure(error);
  },

  async reviewRequirement(id: string, status: string, comment: string) {
    if (!isSupabaseConfigured || !supabase) return;
    const { error } = await supabase.rpc("ops_review_requirement", { p_requirement_id: id, p_status: status, p_comment: comment || null });
    ensure(error);
  },

  async manageAppointment(id: string, status: string, advisorId?: string, notes?: string) {
    if (!isSupabaseConfigured || !supabase) return;
    const { error } = await supabase.rpc("ops_manage_appointment", { p_appointment_id: id, p_status: status, p_advisor_id: advisorId ?? null, p_notes: notes ?? null });
    ensure(error);
  },

  async setStaffRole(userId: string, role: "advisor" | "admin", active: boolean) {
    if (!isSupabaseConfigured || !supabase) return;
    const { error } = await supabase.rpc("admin_set_staff_role", { p_user_id: userId, p_role: role, p_active: active });
    ensure(error);
  },

  async assignProject(projectId: string, advisorId: string) {
    if (!isSupabaseConfigured || !supabase) return;
    const { error } = await supabase.rpc("ops_assign_project", { p_project_id: projectId, p_advisor_id: advisorId });
    ensure(error);
  },

  async sendMessage(conversationId: string, body: string, internalOnly = false) {
    if (!isSupabaseConfigured || !supabase) return;
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error("authentication_required");
    const { error } = await supabase.from("messages").insert({ conversation_id: conversationId, sender_user_id: data.user.id, body: body.trim().slice(0, 8_000), internal_only: internalOnly });
    ensure(error);
  },
};
