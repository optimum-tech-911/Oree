import { describe, expect, it } from "vitest";
import {
  buildEmailHref,
  buildPhoneHref,
  buildWhatsAppHref,
  commercialOffers,
  companyOfferHeadline,
} from "@/config/commercial-offers";
import { landingPages } from "@/content/landingPages";

describe("configuration commerciale centrale", () => {
  it("publie les deux offres confirmées avec le prix TTC de la création de société", () => {
    expect(commercialOffers.companyCreation).toMatchObject({
      active: true,
      price: 600,
      totalLabel: "600 € TTC",
      priceLabel: "600 € TTC tout compris",
      enabledForms: ["SASU", "EURL", "SAS", "SARL"],
    });
    expect(commercialOffers.microEnterprise).toMatchObject({
      active: true,
      price: 100,
      priceLabel: "100 €",
    });
    expect(commercialOffers.companyCreation.tax).toEqual({
      configured: true,
      publicLabel: null,
      visible: false,
    });
    expect(commercialOffers.companyCreation.included).toEqual([
      "Accompagnement à la création",
      "Frais de greffe inclus",
      "Annonce légale incluse",
      "Corrections et compléments du dossier inclus",
    ]);
  });

  it("alimente les titres des quatre landing pages depuis la même offre", () => {
    for (const form of commercialOffers.companyCreation.enabledForms) {
      const page = landingPages[`creation-${form.toLowerCase()}`];
      expect(`${page?.title} ${page?.highlight}`).toBe(companyOfferHeadline(form));
      expect(page?.primaryCta).toBe(commercialOffers.companyCreation.ctaLabel);
    }
  });

  it("génère des liens téléphone, WhatsApp et e-mail accessibles", () => {
    expect(buildPhoneHref("06 12 34 56 78")).toBe("tel:+33612345678");
    expect(buildWhatsAppHref("06 12 34 56 78", "Bonjour")).toBe("https://wa.me/33612345678?text=Bonjour");
    expect(buildEmailHref("contact@example.fr")).toMatch(/^mailto:contact@example\.fr\?/);
  });
});
