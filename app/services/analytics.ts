import { readConsent } from "@/features/consent/consent";
export type AnalyticsEvent =
  | "landing_view"
  | "pricing_viewed"
  | "primary_cta_clicked"
  | "phone_click"
  | "whatsapp_click"
  | "callback_form_started"
  | "callback_requested"
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
  | "assistant_search"
  | "contact_option_selected"
  | "qualify_lead"
  | "close_convert_lead";

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
  callback_requested: "generate_lead",
  appointment_booked: "schedule",
  phone_click: "click",
  whatsapp_click: "click",
  pricing_viewed: "view_item",
  contact_option_selected: "select_content",
  account_created: "sign_up",
  login_completed: "login",
};

const piiKeys = new Set([
  "name",
  "first_name",
  "last_name",
  "email",
  "phone",
  "telephone",
  "message",
  "project_description",
  "address",
]);

export function sanitizeAnalyticsPayload(payload: AnalyticsPayload): AnalyticsPayload {
  return Object.fromEntries(Object.entries(payload).filter(([key]) => !piiKeys.has(key.toLocaleLowerCase("fr-FR"))));
}

export function analyticsDedupeKey(event: AnalyticsEvent, eventId: string) {
  return `oree:analytics-once:${event}:${eventId}`;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export class AnalyticsService {
  private pending: AnalyticsRecord[] = [];
  private listening = false;
  private fired = new Set<string>();

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
    const record: AnalyticsRecord = { event, ga4_event: ga4EventByInternalEvent[event], ...sanitizeAnalyticsPayload(payload), timestamp: new Date().toISOString() };
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

  trackOnce(event: AnalyticsEvent, eventId: string, payload: AnalyticsPayload = {}) {
    const key = analyticsDedupeKey(event, eventId);
    if (this.fired.has(key)) return false;
    if (typeof window !== "undefined") {
      try {
        if (window.sessionStorage.getItem(key)) return false;
        window.sessionStorage.setItem(key, "1");
      } catch {
        // Session storage can be unavailable in strict privacy modes; memory still
        // prevents duplicate firing during the current application lifetime.
      }
    }
    this.fired.add(key);
    this.track(event, { ...payload, event_id: eventId });
    return true;
  }
}

export const analytics = new AnalyticsService();
