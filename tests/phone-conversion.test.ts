import { describe, expect, it, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import {
  getPhoneConversionSnapshot,
  getPhoneConversionServerSnapshot,
  updatePhoneConversion,
  resetPhoneConversion,
  subscribePhoneConversion,
  normalizePhoneHref,
} from "@/services/phone-conversion";

describe("Google Ads website-call conversion & phone_conversion_callback", () => {
  beforeEach(() => {
    resetPhoneConversion();
  });

  it("fournit le numéro par défaut et le lien tel: par défaut quand aucun numéro de transfert n'est fourni", () => {
    const snapshot = getPhoneConversionSnapshot();
    expect(snapshot.displayPhone).toBe("07 87 82 32 08");
    expect(snapshot.phoneHref).toBe("tel:+33787823208");
    expect(snapshot.mobileNumber).toBe("+33787823208");
    expect(snapshot.isForwarded).toBe(false);

    const serverSnapshot = getPhoneConversionServerSnapshot();
    expect(serverSnapshot.displayPhone).toBe("07 87 82 32 08");
    expect(serverSnapshot.phoneHref).toBe("tel:+33787823208");
  });

  it("met à jour à la fois le numéro affiché et le lien cliquable tel: lors du callback Google Ads", () => {
    let notified = false;
    const unsubscribe = subscribePhoneConversion(() => {
      notified = true;
    });

    updatePhoneConversion("01 89 20 12 34", "+33189201234");

    const snapshot = getPhoneConversionSnapshot();
    expect(snapshot.displayPhone).toBe("01 89 20 12 34");
    expect(snapshot.phoneHref).toBe("tel:+33189201234");
    expect(snapshot.mobileNumber).toBe("+33189201234");
    expect(snapshot.isForwarded).toBe(true);
    expect(notified).toBe(true);

    unsubscribe();
  });

  it("normalise correctement le lien tel: si mobile_number a déjà un préfixe tel:", () => {
    expect(normalizePhoneHref("tel:+33189201234")).toBe("tel:+33189201234");
    expect(normalizePhoneHref("+33189201234")).toBe("tel:+33189201234");
    expect(normalizePhoneHref("0189201234")).toBe("tel:0189201234");

    updatePhoneConversion("01 89 20 12 34", "tel:+33189201234");
    expect(getPhoneConversionSnapshot().phoneHref).toBe("tel:+33189201234");
  });

  it("conserve exactement tel:+33787823208 si formatted_number est fourni sans mobile_number", () => {
    updatePhoneConversion("01 89 20 12 34", "");
    const snapshot = getPhoneConversionSnapshot();
    expect(snapshot.displayPhone).toBe("01 89 20 12 34");
    expect(snapshot.phoneHref).toBe("tel:+33787823208");
    expect(snapshot.mobileNumber).toBe("+33787823208");
    expect(snapshot.isForwarded).toBe(true);
  });

  it("réinitialise le numéro vers le standard de l'entreprise", () => {
    updatePhoneConversion("01 89 20 12 34", "+33189201234");
    expect(getPhoneConversionSnapshot().isForwarded).toBe(true);

    resetPhoneConversion();
    expect(getPhoneConversionSnapshot().displayPhone).toBe("07 87 82 32 08");
    expect(getPhoneConversionSnapshot().phoneHref).toBe("tel:+33787823208");
    expect(getPhoneConversionSnapshot().isForwarded).toBe(false);
  });

  it("vérifie que index.html contient la configuration phone_conversion_callback pour Google Ads", () => {
    const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
    expect(html).toContain("'phone_conversion_number': '07 87 82 32 08'");
    expect(html).toContain("'phone_conversion_callback': function(formatted_number, mobile_number)");
    expect(html).toContain("__oree_on_phone_conversion");
    expect(html).toContain("__oree_pending_phone_conversion");
  });
});
