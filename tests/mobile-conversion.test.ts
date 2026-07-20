import { describe, expect, it } from "vitest";
import { mobileConversionForPath } from "@/components/layout/MobileConversionBar";

describe("barre de conversion mobile", () => {
  it("conserve l'intention de chaque page d'acquisition", () => {
    expect(mobileConversionForPath("/creation-sasu")).toMatchObject({
      href: "/diagnostic?intent=creation_sasu",
      intent: "creation_sasu",
    });
    expect(mobileConversionForPath("/dossier-creation-entreprise-bloque/")).toMatchObject({
      href: "/diagnostic?intent=blocked_dossier",
      intent: "blocked_dossier",
    });
    expect(mobileConversionForPath("/creer-entreprise-demandeur-emploi")).toMatchObject({
      href: "/diagnostic?intent=job_seeker_creation",
      intent: "job_seeker_creation",
    });
  });

  it("reste absente des parcours où elle ferait doublon", () => {
    for (const path of [
      "/",
      "/diagnostic",
      "/rendez-vous",
      "/tarifs",
      "/offres",
      "/connexion",
      "/auth/callback",
      "/app/documents",
      "/ops/leads",
    ]) {
      expect(mobileConversionForPath(path), path).toBeNull();
    }
  });

  it("ne s'affiche pas sur une route publique inconnue", () => {
    expect(mobileConversionForPath("/route-inconnue")).toBeNull();
  });
});
