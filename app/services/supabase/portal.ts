import { isSupabaseConfigured, supabase } from "@/services/supabase/client";
import { mockDocuments, mockMessages, mockProject, mockTimeline } from "@/data/mock";
import type { DocumentItem, Project, TimelineEvent } from "@/types";

type QueryError = { message: string } | null;

function ensureNoError(error: QueryError) {
  if (error) throw new Error(error.message);
}

export type PortalMessage = {
  id: string;
  body: string;
  createdAt: string;
  senderId: string;
  isOwn: boolean;
  internal: boolean;
  read: boolean;
};

export type PortalAppointment = {
  id: string;
  startsAt: string;
  endsAt: string;
  type: "phone" | "video" | "onsite";
  status: "requested" | "booked" | "confirmed" | "completed" | "cancelled" | "no_show";
  notes?: string;
};

export type PortalDocument = DocumentItem & {
  documentId?: string;
  versionId?: string;
  storagePath?: string;
  filename?: string;
  mimeType?: string;
  sizeBytes?: number;
};

export type PortalProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  timezone: string;
  availabilityNote: string;
  notificationPreferences: Record<string, boolean>;
};

export type PortalFounder = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  ownershipPercentage: number | null;
  managementRole: string;
  verificationStatus: "pending" | "invited" | "information_complete" | "verified" | "changes_requested";
};

export type PortalTask = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "blocked" | "done" | "cancelled";
  priority: "low" | "normal" | "high" | "urgent";
  dueAt?: string;
};

export type PortalOrientation = {
  currentForm: string | null;
  consideredForms: string[];
  reasons: string[];
  validationPoints: string[];
  definitionVersion?: string;
  ruleVersion?: string;
};

export type PortalSnapshot = {
  demo: boolean;
  project: Project | null;
  documents: PortalDocument[];
  timeline: TimelineEvent[];
  messages: PortalMessage[];
  conversationId: string | null;
  appointments: PortalAppointment[];
  profile: PortalProfile | null;
  founders: PortalFounder[];
  tasks: PortalTask[];
  orientation: PortalOrientation;
};

function demoSnapshot(): PortalSnapshot {
  const now = Date.now();
  return {
    demo: true,
    project: structuredClone(mockProject),
    documents: structuredClone(mockDocuments),
    timeline: structuredClone(mockTimeline),
    messages: mockMessages.map((message, index) => ({
      id: message.id,
      body: message.body,
      createdAt: new Date(now - (mockMessages.length - index) * 900_000).toISOString(),
      senderId: message.author === "Vous" ? "demo-user" : "demo-staff",
      isOwn: message.author === "Vous",
      internal: false,
      read: true,
    })),
    conversationId: "demo-conversation",
    appointments: [],
    profile: { firstName: "Utilisateur", lastName: "Démo", phone: "", email: "sid@example.fr", timezone: "Europe/Paris", availabilityNote: "", notificationPreferences: { email: true, documents: true, appointments: true, messages: true } },
    founders: [{ id: "demo-founder", firstName: "Porteur", lastName: "de projet", email: "", ownershipPercentage: 100, managementRole: "Dirigeant envisagé", verificationStatus: "information_complete" }],
    tasks: [],
    orientation: { currentForm: "SASU", consideredForms: ["SASU", "EURL"], reasons: ["Projet porté par une seule personne."], validationPoints: ["Protection sociale souhaitée", "Mode de rémunération"] },
  };
}

export const portalRepository = {
  async getSnapshot(): Promise<PortalSnapshot> {
    if (!isSupabaseConfigured || !supabase) return demoSnapshot();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    ensureNoError(userError);
    const user = userData.user;
    if (!user) throw new Error("authentication_required");

    const { data: projectRow, error: projectError } = await supabase
      .from("projects")
      .select("id,display_name,current_legal_form,considered_legal_forms,activity_description,department,desired_creation_date,progress,project_stage,assigned_advisor_id,created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    ensureNoError(projectError);

    const { data: profileRow, error: profileError } = await supabase
      .from("profiles")
      .select("first_name,last_name,phone,timezone,availability_note,notification_preferences")
      .eq("id", user.id)
      .maybeSingle();
    ensureNoError(profileError);

    const profile: PortalProfile = {
      firstName: profileRow?.first_name ?? (user.user_metadata.first_name as string | undefined) ?? "",
      lastName: profileRow?.last_name ?? (user.user_metadata.last_name as string | undefined) ?? "",
      phone: profileRow?.phone ?? "",
      email: user.email ?? "",
      timezone: profileRow?.timezone ?? "Europe/Paris",
      availabilityNote: profileRow?.availability_note ?? "",
      notificationPreferences: (profileRow?.notification_preferences as Record<string, boolean> | null) ?? { email: true, documents: true, appointments: true, messages: true },
    };

    if (!projectRow) return { ...demoSnapshot(), demo: false, project: null, documents: [], timeline: [], messages: [], conversationId: null, appointments: [], profile, founders: [], tasks: [], orientation: { currentForm: null, consideredForms: [], reasons: [], validationPoints: [] } };

    const project: Project = {
      id: projectRow.id,
      displayName: projectRow.display_name,
      legalForm: projectRow.current_legal_form,
      activity: projectRow.activity_description ?? "",
      department: projectRow.department ?? "",
      desiredDate: projectRow.desired_creation_date ?? "",
      progress: projectRow.progress,
      status: projectRow.project_stage,
      advisor: { name: projectRow.assigned_advisor_id ? "Équipe Orée" : "À affecter", role: "Suivi du projet", initials: "OR" },
      nextAction: { title: "Consulter les prochaines actions", description: "Retrouvez les éléments attendus dans le centre de pilotage.", href: "/app" },
    };

    const [requirementsResult, eventsResult, appointmentsResult, conversationResult, foundersResult, tasksResult, diagnosticResult] = await Promise.all([
      supabase.from("document_requirements").select("id,label,category,status,advisor_comment,updated_at,due_at").eq("project_id", project.id).order("created_at"),
      supabase.from("project_events").select("id,title,description,created_at,event_state").eq("project_id", project.id).order("created_at", { ascending: false }),
      supabase.from("appointments").select("id,starts_at,ends_at,appointment_type,status,notes").eq("project_id", project.id).order("starts_at", { ascending: false }),
      supabase.from("conversations").select("id").eq("project_id", project.id).maybeSingle(),
      supabase.from("founders").select("id,first_name,last_name,email,ownership_percentage,management_role,verification_status").eq("project_id", project.id).order("created_at"),
      supabase.from("project_tasks").select("id,title,description,status,priority,due_at").eq("project_id", project.id).neq("status", "cancelled").order("due_at", { ascending: true, nullsFirst: false }),
      supabase.from("diagnostic_sessions").select("definition_version,rule_version,result_json").eq("project_id", project.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    ]);
    [requirementsResult.error, eventsResult.error, appointmentsResult.error, conversationResult.error, foundersResult.error, tasksResult.error, diagnosticResult.error].forEach(ensureNoError);

    const { data: documentRows, error: documentError } = await supabase
      .from("documents")
      .select("id,requirement_id,current_version_id")
      .eq("project_id", project.id);
    ensureNoError(documentError);
    const versionIds = (documentRows ?? []).map((row) => row.current_version_id).filter((value): value is string => Boolean(value));
    const versionsResult = versionIds.length
      ? await supabase.from("document_versions").select("id,storage_path,original_filename,mime_type,size_bytes,created_at").in("id", versionIds)
      : { data: [], error: null };
    ensureNoError(versionsResult.error);
    const versionById = new Map((versionsResult.data ?? []).map((row) => [row.id, row]));
    const documentByRequirement = new Map((documentRows ?? []).map((row) => [row.requirement_id, row]));

    const documents: PortalDocument[] = (requirementsResult.data ?? []).map((row) => {
      const document = documentByRequirement.get(row.id);
      const version = document?.current_version_id ? versionById.get(document.current_version_id) : undefined;
      return {
        id: row.id,
        label: row.label,
        category: row.category,
        status: row.status,
        owner: "Vous",
        updatedAt: version?.created_at ?? row.updated_at,
        comment: row.advisor_comment ?? undefined,
        documentId: document?.id,
        versionId: version?.id,
        storagePath: version?.storage_path,
        filename: version?.original_filename,
        mimeType: version?.mime_type,
        sizeBytes: version?.size_bytes,
      } as PortalDocument;
    });

    const conversationId = conversationResult.data?.id ?? null;
    let messages: PortalMessage[] = [];
    if (conversationId) {
      const { data: messageRows, error: messageError } = await supabase.from("messages").select("id,body,created_at,sender_user_id,internal_only").eq("conversation_id", conversationId).eq("internal_only", false).order("created_at");
      ensureNoError(messageError);
      const ids = (messageRows ?? []).map((row) => row.id);
      const readsResult = ids.length ? await supabase.from("message_reads").select("message_id").eq("user_id", user.id).in("message_id", ids) : { data: [], error: null };
      ensureNoError(readsResult.error);
      const readIds = new Set((readsResult.data ?? []).map((row) => row.message_id));
      messages = (messageRows ?? []).map((row) => ({ id: row.id, body: row.body, createdAt: row.created_at, senderId: row.sender_user_id, isOwn: row.sender_user_id === user.id, internal: row.internal_only, read: row.sender_user_id === user.id || readIds.has(row.id) }));
    }

    const diagnostic = (diagnosticResult.data?.result_json ?? {}) as Record<string, unknown>;
    const stringList = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
    const reasons = stringList(diagnostic.reasons ?? diagnostic.rationale ?? diagnostic.explanations);
    const validationPoints = stringList(diagnostic.validationPoints ?? diagnostic.points_to_validate ?? diagnostic.cautions);
    return {
      demo: false,
      project,
      documents,
      timeline: (eventsResult.data ?? []).map((row) => ({ id: row.id, title: row.title, description: row.description ?? "", date: row.created_at, state: row.event_state })) as TimelineEvent[],
      messages,
      conversationId,
      appointments: (appointmentsResult.data ?? []).map((row) => ({ id: row.id, startsAt: row.starts_at, endsAt: row.ends_at, type: row.appointment_type, status: row.status, notes: row.notes ?? undefined })) as PortalAppointment[],
      profile,
      founders: (foundersResult.data ?? []).map((row) => ({ id: row.id, firstName: row.first_name, lastName: row.last_name, email: row.email ?? "", ownershipPercentage: row.ownership_percentage === null ? null : Number(row.ownership_percentage), managementRole: row.management_role ?? "Associé", verificationStatus: row.verification_status })) as PortalFounder[],
      tasks: (tasksResult.data ?? []).map((row) => ({ id: row.id, title: row.title, description: row.description ?? "", status: row.status, priority: row.priority, dueAt: row.due_at ?? undefined })) as PortalTask[],
      orientation: {
        currentForm: projectRow.current_legal_form,
        consideredForms: projectRow.considered_legal_forms ?? [],
        reasons,
        validationPoints,
        definitionVersion: diagnosticResult.data?.definition_version,
        ruleVersion: diagnosticResult.data?.rule_version,
      },
    };
  },

  async addFounder(projectId: string, input: { firstName: string; lastName: string; email?: string; ownershipPercentage?: number | null; managementRole?: string }) {
    if (!isSupabaseConfigured || !supabase) return { id: crypto.randomUUID() };
    const { data, error } = await supabase.from("founders").insert({
      project_id: projectId,
      first_name: input.firstName.trim().slice(0, 100),
      last_name: input.lastName.trim().slice(0, 100),
      email: input.email?.trim().toLowerCase().slice(0, 254) || null,
      ownership_percentage: input.ownershipPercentage ?? null,
      management_role: input.managementRole?.trim().slice(0, 140) || null,
      verification_status: "pending",
    }).select("id").single();
    ensureNoError(error);
    return data;
  },

  async updateProject(projectId: string, input: { displayName: string; legalForm: string | null; activity: string; department: string; desiredDate: string | null }) {
    if (!isSupabaseConfigured || !supabase) return;
    const { error } = await supabase.from("projects").update({ display_name: input.displayName, current_legal_form: input.legalForm, activity_description: input.activity, department: input.department, desired_creation_date: input.desiredDate }).eq("id", projectId);
    ensureNoError(error);
  },

  async saveProfile(input: PortalProfile) {
    if (!isSupabaseConfigured || !supabase) return;
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error("authentication_required");
    const { error } = await supabase.from("profiles").update({ first_name: input.firstName, last_name: input.lastName, phone: input.phone || null, timezone: input.timezone, availability_note: input.availabilityNote || null, notification_preferences: input.notificationPreferences }).eq("id", data.user.id);
    ensureNoError(error);
  },

  async requestDataAction(requestType: "access" | "export" | "rectification" | "deletion" | "restriction" | "objection") {
    if (!isSupabaseConfigured || !supabase) return;
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error("authentication_required");
    const { error } = await supabase.from("data_requests").insert({ user_id: data.user.id, request_type: requestType });
    ensureNoError(error);
  },

  async sendMessage(conversationId: string, body: string, internalOnly = false) {
    if (!isSupabaseConfigured || !supabase) return { id: crypto.randomUUID() };
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("authentication_required");
    const { data, error } = await supabase.from("messages").insert({ conversation_id: conversationId, sender_user_id: userData.user.id, body: body.trim().slice(0, 8_000), internal_only: internalOnly }).select("id").single();
    ensureNoError(error);
    return data;
  },

  async markMessagesRead(messageIds: string[]) {
    if (!isSupabaseConfigured || !supabase || messageIds.length === 0) return;
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    const { error } = await supabase.from("message_reads").upsert(messageIds.map((messageId) => ({ message_id: messageId, user_id: data.user!.id, read_at: new Date().toISOString() })), { onConflict: "message_id,user_id" });
    ensureNoError(error);
  },

  async requestAppointment(projectId: string, input: { startsAt: string; duration: number; type: "phone" | "video" | "onsite"; notes?: string }) {
    if (!isSupabaseConfigured || !supabase) return crypto.randomUUID();
    const { data, error } = await supabase.rpc("request_project_appointment", { p_project_id: projectId, p_starts_at: input.startsAt, p_duration_minutes: input.duration, p_appointment_type: input.type, p_notes: input.notes ?? null });
    ensureNoError(error);
    return data as string;
  },

  async uploadDocument(projectId: string, requirementId: string, existingDocumentId: string | undefined, file: File) {
    if (!isSupabaseConfigured || !supabase) return { demo: true };
    const extensionByType: Record<string, string> = { "application/pdf": "pdf", "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
    const extension = extensionByType[file.type];
    if (!extension || file.size <= 0 || file.size > 15 * 1024 * 1024) throw new Error("Le fichier doit être un PDF ou une image de 15 Mo maximum.");
    const documentId = existingDocumentId ?? crypto.randomUUID();
    const versionId = crypto.randomUUID();
    const storagePath = `${projectId}/${documentId}/${versionId}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("project-documents").upload(storagePath, file, { contentType: file.type, upsert: false });
    ensureNoError(uploadError);
    const { error } = await supabase.rpc("register_document_upload", { p_project_id: projectId, p_requirement_id: requirementId, p_document_id: documentId, p_version_id: versionId, p_storage_path: storagePath, p_original_filename: file.name, p_mime_type: file.type, p_size_bytes: file.size });
    ensureNoError(error);
    return { demo: false, documentId, versionId, storagePath };
  },

  async createDocumentDownload(storagePath: string) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase.storage.from("project-documents").createSignedUrl(storagePath, 60);
    ensureNoError(error);
    return data?.signedUrl ?? null;
  },
};
