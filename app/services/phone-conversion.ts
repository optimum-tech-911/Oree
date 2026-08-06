import { useSyncExternalStore } from "react";
import { commercialOffers, buildPhoneHref } from "@/config/commercial-offers";

export type PhoneConversionState = {
  displayPhone: string;
  mobileNumber: string;
  phoneHref: string;
  isForwarded: boolean;
};

const DEFAULT_DISPLAY_PHONE = commercialOffers.contact.displayPhone;
const DEFAULT_PHONE = commercialOffers.contact.phone;
const DEFAULT_PHONE_HREF = buildPhoneHref();

const defaultPhoneState: PhoneConversionState = {
  displayPhone: DEFAULT_DISPLAY_PHONE,
  mobileNumber: DEFAULT_PHONE,
  phoneHref: DEFAULT_PHONE_HREF,
  isForwarded: false,
};

let currentPhoneState: PhoneConversionState = { ...defaultPhoneState };
const listeners = new Set<() => void>();

export function normalizePhoneHref(rawDialNumber: string): string {
  const cleaned = rawDialNumber.replace(/^tel:/i, "").trim();
  return cleaned ? `tel:${cleaned}` : DEFAULT_PHONE_HREF;
}

export function updatePhoneConversion(
  formattedNumber?: string | null,
  mobileNumber?: string | null,
): void {
  const formatted = typeof formattedNumber === "string" ? formattedNumber.trim() : "";
  const mobile = typeof mobileNumber === "string" ? mobileNumber.trim() : "";

  if (!formatted && !mobile) return;

  const displayPhone = formatted || DEFAULT_DISPLAY_PHONE;
  const resolvedMobile = mobile || DEFAULT_PHONE;
  const phoneHref = mobile ? normalizePhoneHref(mobile) : DEFAULT_PHONE_HREF;

  currentPhoneState = {
    displayPhone,
    mobileNumber: resolvedMobile,
    phoneHref,
    isForwarded: displayPhone !== DEFAULT_DISPLAY_PHONE || phoneHref !== DEFAULT_PHONE_HREF,
  };

  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Ignore listener errors
    }
  });
}

export function getPhoneConversionSnapshot(): PhoneConversionState {
  return currentPhoneState;
}

export function getPhoneConversionServerSnapshot(): PhoneConversionState {
  return defaultPhoneState;
}

export function subscribePhoneConversion(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function resetPhoneConversion(): void {
  currentPhoneState = { ...defaultPhoneState };
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Ignore listener errors
    }
  });
}

declare global {
  interface Window {
    __oree_on_phone_conversion?: (formatted_number?: string, mobile_number?: string) => void;
    __oree_pending_phone_conversion?: {
      formatted_number?: string;
      mobile_number?: string;
    };
  }
}

// Global browser hookup
if (typeof window !== "undefined") {
  window.__oree_on_phone_conversion = (formatted_number, mobile_number) => {
    updatePhoneConversion(formatted_number, mobile_number);
  };

  // Replay any pending phone conversion callback that fired before script execution
  if (window.__oree_pending_phone_conversion) {
    const pending = window.__oree_pending_phone_conversion;
    updatePhoneConversion(pending.formatted_number, pending.mobile_number);
    delete window.__oree_pending_phone_conversion;
  }
}

export function useContactPhone(): PhoneConversionState {
  return useSyncExternalStore(
    subscribePhoneConversion,
    getPhoneConversionSnapshot,
    getPhoneConversionServerSnapshot,
  );
}

export function useCompanyContact() {
  const phone = useContactPhone();
  return {
    ...commercialOffers.contact,
    displayPhone: phone.displayPhone,
    phone: phone.mobileNumber,
    phoneHref: phone.phoneHref,
    isForwarded: phone.isForwarded,
  };
}
