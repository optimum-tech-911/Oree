import { readConsent } from "@/features/consent/consent";
export type AnalyticsEvent =
  | "landing_view"
  | "diagnostic_started"
  | "diagnostic_step_completed"
  | "diagnostic_completed"
  | "orientation_viewed"
  | "lead_form_started"
  | "lead_submitted"
  | "account_created"
  | "appointment_started"
  | "appointment_booked"
  | "project_created"
  | "document_uploaded"
  | "assistant_opened"
  | "assistant_search";

export type AnalyticsPayload = Record<string, string | number | boolean | string[] | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

class AnalyticsService {
  track(event: AnalyticsEvent, payload: AnalyticsPayload = {}) {
    const record = { event, ...payload, timestamp: new Date().toISOString() };
    if (typeof window !== "undefined") {
      const consent = readConsent();
      if (consent?.analytics) {
        window.dataLayer = window.dataLayer ?? [];
        window.dataLayer.push(record);
      }
      if (import.meta.env.DEV) console.info("[analytics]", record);
    }
  }
}

export const analytics = new AnalyticsService();
