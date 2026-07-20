import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(new URL("../supabase/migrations/0006_appointment_permission_hardening.sql", import.meta.url), "utf8");
const portalMigration = readFileSync(new URL("../supabase/migrations/0007_portal_operations_and_intake.sql", import.meta.url), "utf8");
const portalDocumentsMigration = readFileSync(new URL("../supabase/migrations/0008_portal_documents_and_read_state.sql", import.meta.url), "utf8");
const turnstileVerifier = readFileSync(new URL("../supabase/functions/_shared/turnstile.ts", import.meta.url), "utf8");

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
  it("fails closed and binds Turnstile verification to the lead action", () => {
    expect(turnstileVerifier).toMatch(/if \(!secret\)[\s\S]*return false/);
    expect(turnstileVerifier).toMatch(/result\.action !== "submit_lead"/);
    expect(turnstileVerifier).toMatch(/AbortController/);
    expect(turnstileVerifier).not.toMatch(/if \(!secret\) return true/);
  });

  it("keeps intake atomic, idempotent and strips duplicated contact data", () => {
    expect(portalMigration).toMatch(/create or replace function public\.submit_lead_bundle/i);
    expect(portalMigration).toMatch(/where intake_key = p_submission_id/i);
    expect(portalMigration).toMatch(/v_safe_answers := p_answers - array/i);
    expect(portalMigration).toMatch(/'firstName', 'lastName', 'email', 'phone', 'privacyAccepted'/);
    expect(portalMigration).toMatch(/grant execute on function public\.submit_lead_bundle[^;]+to service_role/i);
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
});
