import type { DiagnosticAnswers } from "@/types";
import type { LeadSubmissionResult } from "@/services/supabase/repositories";
import { isSupabaseConfigured, supabase } from "@/services/supabase/client";
import { analytics } from "@/services/analytics";

const STORAGE_KEY = "oree:pending-lead:v1";
const MAX_AGE_MS = 24 * 60 * 60 * 1_000;

type PendingLead = {
  leadId: string;
  claimToken: string;
  email: string;
  displayName: string;
  activity?: string;
  department?: string;
  createdAt: string;
  claimed: boolean;
};

function storage() {
  if (typeof window === "undefined") return null;
  try { return window.sessionStorage; } catch { return null; }
}

function readPending(): PendingLead | null {
  const value = storage()?.getItem(STORAGE_KEY);
  if (!value) return null;
  try {
    const pending = JSON.parse(value) as PendingLead;
    if (!pending.leadId || !pending.claimToken || !pending.email || !pending.createdAt || Date.now() - Date.parse(pending.createdAt) > MAX_AGE_MS) {
      storage()?.removeItem(STORAGE_KEY);
      return null;
    }
    return pending;
  } catch {
    storage()?.removeItem(STORAGE_KEY);
    return null;
  }
}

function writePending(pending: PendingLead) {
  storage()?.setItem(STORAGE_KEY, JSON.stringify(pending));
}

export function savePendingLeadContinuation(result: LeadSubmissionResult, answers: DiagnosticAnswers) {
  if (result.demo || !result.claimToken || !answers.email) return;
  const fullName = [answers.firstName, answers.lastName].filter(Boolean).join(" ").trim();
  writePending({
    leadId: result.id,
    claimToken: result.claimToken,
    email: answers.email.trim().toLowerCase(),
    displayName: `Projet de ${fullName || "création"}`.slice(0, 160),
    activity: answers.activity?.slice(0, 2_000),
    department: answers.department?.slice(0, 8),
    createdAt: new Date().toISOString(),
    claimed: false,
  });
}

export function getPendingLeadEmail() {
  return readPending()?.email ?? null;
}

export async function continuePendingLead() {
  const pending = readPending();
  if (!pending || !isSupabaseConfigured || !supabase) return { status: "nothing_to_link" as const };
  const { data: sessionData } = await supabase.auth.getSession();
  const email = sessionData.session?.user.email?.toLowerCase();
  if (!email) return { status: "authentication_required" as const };
  if (email !== pending.email) return { status: "email_mismatch" as const };

  if (!pending.claimed) {
    const { data, error } = await supabase.functions.invoke("claim-lead", {
      body: { leadId: pending.leadId, claimToken: pending.claimToken },
    });
    if (error) throw error;
    if (typeof data?.projectId === "string") {
      storage()?.removeItem(STORAGE_KEY);
      return { status: "already_linked" as const, projectId: data.projectId };
    }
    pending.claimed = true;
    writePending(pending);
  }

  const { data, error } = await supabase.functions.invoke("create-project", {
    body: {
      displayName: pending.displayName,
      leadId: pending.leadId,
      activity: pending.activity,
      department: pending.department,
    },
  });
  if (error) throw error;
  if (typeof data?.id !== "string") throw new Error("project_creation_not_confirmed");
  storage()?.removeItem(STORAGE_KEY);
  analytics.track("project_created", { source: "diagnostic_continuation" });
  return { status: "project_created" as const, projectId: data.id };
}
