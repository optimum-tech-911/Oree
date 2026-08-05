import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(new URL("../supabase/migrations/0006_appointment_permission_hardening.sql", import.meta.url), "utf8");
const portalMigration = readFileSync(new URL("../supabase/migrations/0007_portal_operations_and_intake.sql", import.meta.url), "utf8");
const portalDocumentsMigration = readFileSync(new URL("../supabase/migrations/0008_portal_documents_and_read_state.sql", import.meta.url), "utf8");
const operationsSafetyMigration = readFileSync(new URL("../supabase/migrations/0011_operations_workflow_repair.sql", import.meta.url), "utf8");
const rateLimitMigration = readFileSync(new URL("../supabase/migrations/0012_lead_intake_attempts.sql", import.meta.url), "utf8");
const offerWorkflowMigration = readFileSync(new URL("../supabase/migrations/0013_offer_and_ads_lead_workflow.sql", import.meta.url), "utf8");
const callbackVisibilityMigration = readFileSync(new URL("../supabase/migrations/0014_callback_request_visibility.sql", import.meta.url), "utf8");
const submitLeadFunction = readFileSync(new URL("../supabase/functions/submit-lead/index.ts", import.meta.url), "utf8");
const corsHelper = readFileSync(new URL("../supabase/functions/_shared/cors.ts", import.meta.url), "utf8");
const operationsRepository = readFileSync(new URL("../app/services/supabase/operations.ts", import.meta.url), "utf8");
const operationsLeadPage = readFileSync(new URL("../app/pages/ops/OpsSectionPage.tsx", import.meta.url), "utf8");

describe("appointment permission hardening", () => {
  it("removes member writes and leaves authenticated browsers read-only", () => {
    expect(migration).toMatch(/drop policy if exists appointments_member_insert/i);
    expect(migration).toMatch(/drop policy if exists appointments_update/i);
    expect(migration).toMatch(/revoke insert, update, delete on table public\.appointments from authenticated/i);
    expect(migration).toMatch(/grant select on table public\.appointments to authenticated/i);
    expect(migration).not.toMatch(/grant (?:all|insert|update|delete)[^;]*appointments[^;]*authenticated/i);
  });
});

describe("lead intake security", () => {
  it("uses local anti-abuse controls without requiring third-party captcha configuration", () => {
    expect(submitLeadFunction).toMatch(/honeypot/);
    expect(submitLeadFunction).toMatch(/checkLeadRateLimit/);
    expect(submitLeadFunction).toMatch(/lead_intake_attempts/);
    expect(submitLeadFunction).not.toMatch(/captcha_failed|siteverify/);
    expect(rateLimitMigration).toMatch(/create table if not exists public\.lead_intake_attempts/i);
    expect(rateLimitMigration).toMatch(/alter table public\.lead_intake_attempts enable row level security/i);
    expect(rateLimitMigration).toMatch(/revoke all on table public\.lead_intake_attempts from public, anon, authenticated/i);
    expect(rateLimitMigration).toMatch(/grant select, insert on table public\.lead_intake_attempts to service_role/i);
  });

  it("never returns a different allowed origin when CORS rejects a request", () => {
    expect(corsHelper).toMatch(/const allowed = configuredOrigins\.includes\(origin\) \? origin : ""/);
    expect(corsHelper).toMatch(/if \(allowed\) headers\["Access-Control-Allow-Origin"\] = allowed/);
    expect(corsHelper).not.toMatch(/configuredOrigins\[0\]/);
  });

  it("keeps intake atomic, idempotent and strips duplicated contact data", () => {
    expect(portalMigration).toMatch(/create or replace function public\.submit_lead_bundle/i);
    expect(portalMigration).toMatch(/where intake_key = p_submission_id/i);
    expect(portalMigration).toMatch(/v_safe_answers := p_answers - array/i);
    expect(portalMigration).toMatch(/'firstName', 'lastName', 'email', 'phone', 'privacyAccepted'/);
    expect(portalMigration).toMatch(/grant execute on function public\.submit_lead_bundle[^;]+to service_role/i);
  });

  it("keeps public lead creation behind the Edge Function and protects commercial notes", () => {
    expect(offerWorkflowMigration).toMatch(/revoke all on function public\.submit_lead_bundle[^;]+from public, anon, authenticated/i);
    expect(offerWorkflowMigration).toMatch(/grant execute on function public\.submit_lead_bundle[^;]+to service_role/i);
    expect(offerWorkflowMigration).toMatch(/alter table public\.lead_notes enable row level security/i);
    expect(offerWorkflowMigration).toMatch(/revoke all on table public\.lead_notes from public, anon, authenticated/i);
    expect(offerWorkflowMigration).toMatch(/create policy lead_notes_staff_select/i);
    expect(offerWorkflowMigration).not.toMatch(/grant insert on table public\.leads to anon/i);
  });

  it("queues notification context after the lead and records lifecycle conversions idempotently", () => {
    expect(offerWorkflowMigration).toMatch(/insert into public\.notification_jobs/i);
    expect(offerWorkflowMigration).toMatch(/'securePath'/);
    expect(offerWorkflowMigration).toMatch(/'projectSummary'/);
    expect(offerWorkflowMigration).toMatch(/create table if not exists public\.lead_lifecycle_events/i);
    expect(offerWorkflowMigration).toMatch(/on conflict \(event_key\) do nothing/i);
  });

  it("persists callback intent and exposes it as an indexed operations queue", () => {
    expect(callbackVisibilityMigration).toMatch(/add column if not exists callback_requested boolean not null default false/i);
    expect(callbackVisibilityMigration).toMatch(/before insert on public\.leads/i);
    expect(callbackVisibilityMigration).toMatch(/preferred_contact_method = 'phone'/i);
    expect(callbackVisibilityMigration).toMatch(/create index if not exists leads_callback_queue_idx/i);
    expect(callbackVisibilityMigration).toMatch(/revoke all on function public\.mark_callback_request\(\) from public, anon, authenticated/i);
    expect(submitLeadFunction).toMatch(/Demande de rappel/);
    expect(submitLeadFunction).toMatch(/answers\.wantsCallback === true/);
  });

  it("shows callback requests in operations without breaking a pre-migration deployment", () => {
    expect(operationsRepository).toMatch(/select\(leadColumns\)\.order\("callback_requested", \{ ascending: false \}\)/);
    expect(operationsRepository).toMatch(/error\?\.code === "42703"/);
    expect(operationsRepository).toMatch(/callbackRequested: row\.callback_requested \?\? row\.preferred_contact_method === "phone"/);
    expect(operationsLeadPage).toMatch(/À rappeler/);
    expect(operationsLeadPage).toMatch(/Demande de rappel/);
    expect(operationsLeadPage).toMatch(/buildPhoneHref\(lead\.phone\)/);
  });

  it("routes sensitive operations through permission-checked RPCs", () => {
    expect(portalMigration).toMatch(/create or replace function public\.ops_update_lead/i);
    expect(portalMigration).toMatch(/create or replace function public\.ops_review_requirement/i);
    expect(portalMigration).toMatch(/create or replace function public\.ops_manage_appointment/i);
    expect(portalMigration).toMatch(/create or replace function public\.admin_set_staff_role/i);
    expect(portalMigration).toMatch(/insert into public\.audit_events/gi);
  });

  it("registers private uploads only after checking project membership and object ownership", () => {
    expect(portalDocumentsMigration).toMatch(/create or replace function public\.register_document_upload/i);
    expect(portalDocumentsMigration).toMatch(/not public\.is_project_member\(p_project_id\)/i);
    expect(portalDocumentsMigration).toMatch(/bucket_id = 'project-documents'/i);
    expect(portalDocumentsMigration).toMatch(/owner_id = v_user::text/i);
    expect(portalDocumentsMigration).toMatch(/grant execute on function public\.register_document_upload[^;]+to authenticated/i);
  });

  it("keeps at least one active administrator through role changes", () => {
    expect(operationsSafetyMigration).toMatch(/pg_advisory_xact_lock/i);
    expect(operationsSafetyMigration).toMatch(/at least one active admin is required/i);
    expect(operationsSafetyMigration).toMatch(/create or replace function public\.admin_set_staff_role/i);
  });
});
