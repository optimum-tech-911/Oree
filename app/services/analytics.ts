import { readConsent } from "@/features/consent/consent";
export type AnalyticsEvent =
  | "landing_view"
  | "primary_cta_clicked"
  | "diagnostic_started"
  | "diagnostic_step_completed"
  | "diagnostic_abandoned"
  | "diagnostic_completed"
  | "orientation_viewed"
  | "lead_form_started"
  | "lead_submitted"
  | "account_created"
  | "appointment_started"
  | "appointment_booked"
  | "project_created"
  | "document_uploaded"
  | "demo_document_selected"
  | "demo_appointment_selected"
  | "registration_submitted"
  | "login_completed"
  | "demo_session_started"
  | "micro_intent_self_filtered"
  | "assistant_opened"
  | "assistant_search";

export type AnalyticsPayload = Record<string, string | number | boolean | string[] | undefined>;

type AnalyticsRecord = AnalyticsPayload & {
  event: AnalyticsEvent;
  ga4_event?: string;
  timestamp: string;
};

const ga4EventByInternalEvent: Partial<Record<AnalyticsEvent, string>> = {
  landing_view: "page_view",
  primary_cta_clicked: "select_content",
  diagnostic_started: "begin_checkout",
  diagnostic_completed: "diagnostic_completed",
  lead_submitted: "generate_lead",
  appointment_booked: "schedule",
  account_created: "sign_up",
  login_completed: "login",
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

class AnalyticsService {
  private pending: AnalyticsRecord[] = [];
  private listening = false;

  private listenForConsent() {
    if (this.listening || typeof window === "undefined") return;
    this.listening = true;
    window.addEventListener("oree:consent-updated", () => {
      const consent = readConsent();
      const pending = this.pending;
      this.pending = [];
      if (!consent?.analytics) return;
      window.dataLayer = window.dataLayer ?? [];
      pending.forEach((record) => window.dataLayer?.push(record));
    });
  }

  track(event: AnalyticsEvent, payload: AnalyticsPayload = {}) {
    const record: AnalyticsRecord = { event, ga4_event: ga4EventByInternalEvent[event], ...payload, timestamp: new Date().toISOString() };
    if (typeof window !== "undefined") {
      const consent = readConsent();
      if (consent?.analytics) {
        window.dataLayer = window.dataLayer ?? [];
        window.dataLayer.push(record);
      } else if (consent === null) {
        this.pending = [...this.pending.slice(-49), record];
        this.listenForConsent();
      }
      if (import.meta.env.DEV) console.info("[analytics]", record);
    }
  }
}

export const analytics = new AnalyticsService();
