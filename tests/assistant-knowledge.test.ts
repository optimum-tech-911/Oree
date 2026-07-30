import { describe, expect, it } from "vitest";
import { commercialOffers } from "@/config/commercial-offers";
import { rankAssistantKnowledge } from "@/content/knowledge";

const expectedRoutes = [
  ["Combien coûte la création d’une SASU ?", "company-offer-price"],
  ["Les frais de greffe et l’annonce légale sont-ils inclus ?", "company-offer-included"],
  ["Quand dois-je payer le forfait ?", "company-offer-payment"],
  ["Pouvez-vous modifier une société existante ?", "company-offer-exclusions"],
  ["Combien coûte la création d’une micro-entreprise ?", "micro-creation-offer"],
  ["Le prix est-il HT ou TTC avec la TVA ?", "company-offer-tax"],
  ["Comment vous contacter sur WhatsApp ?", "company-offer-contact"],
  ["Est-ce un conseil juridique définitif ?", "orientation-limits"],
] as const;

describe("connaissance commerciale du Guide Orée", () => {
  it.each(expectedRoutes)("route « %s » vers la réponse %s", (query, expectedId) => {
    expect(rankAssistantKnowledge(query)[0]?.item.id).toBe(expectedId);
  });

  it("reprend les données de l’offre centrale sans inventer de fiscalité", () => {
    const companyAnswer = rankAssistantKnowledge("Quel est le prix d’une SASU ?")[0]?.item.answer;
    const microAnswer = rankAssistantKnowledge("Quel est le tarif micro-entreprise ?")[0]?.item.answer;
    const taxAnswer = rankAssistantKnowledge("Est-ce HT ou TTC ?")[0]?.item.answer;

    expect(companyAnswer).toContain(commercialOffers.companyCreation.priceLabel);
    expect(microAnswer).toContain(commercialOffers.microEnterprise.priceLabel);
    expect(taxAnswer).toContain("Aucune mention publique HT, TTC ou de TVA supplémentaire n’est actuellement configurée");
  });
});
