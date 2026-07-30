import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { commercialOffers } from "@/config/commercial-offers";

const sitemap = readFileSync("public/sitemap.xml", "utf8");
const robots = readFileSync("public/robots.txt", "utf8");
const llms = readFileSync("public/llms.txt", "utf8");
const headers = readFileSync("public/_headers", "utf8");
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1])
  .filter((location): location is string => Boolean(location));

describe("fichiers de découverte publics", () => {
  it("publie uniquement les 19 URL canoniques et indexables", () => {
    expect(sitemap).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(locations).toHaveLength(19);
    expect(new Set(locations).size).toBe(locations.length);
    expect(locations.every((location) => location.startsWith("https://oree.optimutech.fr/"))).toBe(true);
    expect(locations.some((location) => /\/(?:app|ops|auth|connexion|inscription)\//.test(location))).toBe(false);
    expect(sitemap).not.toMatch(/<(?:priority|changefreq|lastmod)>/);
  });

  it("décrit l’offre de façon structurée et prudente pour les modèles", () => {
    expect(llms).toMatch(/^# Orée Entreprises\n\n> /);
    expect(llms).toContain(commercialOffers.companyCreation.priceLabel);
    expect(llms).toContain(commercialOffers.microEnterprise.priceLabel);
    expect(llms).toContain(commercialOffers.companyCreation.restriction);
    expect(llms).toContain("ne constitue pas un conseil juridique automatique définitif");
    expect(llms).toContain("aucune mention publique HT, TTC ou de TVA supplémentaire n’est configurée");
    for (const location of locations) expect(llms).toContain(location);
  });

  it("relie les robots aux ressources et protège les espaces privés", () => {
    expect(robots).toContain("https://oree.optimutech.fr/llms.txt");
    expect(robots).toContain("Sitemap: https://oree.optimutech.fr/sitemap.xml");
    for (const path of ["/app/", "/ops/", "/auth/", "/connexion/", "/inscription/"]) {
      expect(robots).toContain(`Disallow: ${path}`);
    }
    expect(headers).toMatch(/\/sitemap\.xml[\s\S]*Content-Type: application\/xml; charset=utf-8/);
    expect(headers).toMatch(/\/llms\.txt[\s\S]*Content-Type: text\/plain; charset=utf-8/);
  });
});
