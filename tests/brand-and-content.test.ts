import { describe, expect, it } from "vitest";
import { brand } from "@/config/brand";
import { landingPages } from "@/content/landingPages";

 describe("contenu public", () => {
  it("contient une marque et les quatre pages de formes principales", () => {
    expect(brand.name.length).toBeGreaterThan(1);
    for (const slug of ["creation-sasu", "creation-eurl", "creation-sas", "creation-sarl"]) {
      const page = landingPages[slug];
      expect(page).toBeDefined();
      expect(page?.title.length).toBeGreaterThan(20);
    }
  });

  it("chaque page possède un appel à l'action et des bénéfices", () => {
    for (const page of Object.values(landingPages)) {
      expect(page.primaryCta).toBeTruthy();
      expect(page.slug).toBeTruthy();
      expect(page.proofPoints.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("couvre les intentions demandeur d’emploi et dossier bloqué", () => {
    for (const slug of ["creer-entreprise-demandeur-emploi", "dossier-creation-entreprise-bloque"]) {
      expect(landingPages[slug], slug).toBeDefined();
      expect(landingPages[slug]?.faq.length).toBeGreaterThanOrEqual(3);
    }
  });
});
