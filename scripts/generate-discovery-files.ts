import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { commercialOffers } from "../app/config/commercial-offers.ts";
import { CANONICAL_ORIGIN, canonicalUrl, publicRoutes } from "./crawlability-routes.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(rootDir, "public");

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function markdownLink(pathname: string, label: string, description: string) {
  return `- [${label}](${canonicalUrl(pathname)}): ${description}`;
}

function routesStartingWith(prefix: string) {
  return publicRoutes.filter((route) => route.path.startsWith(prefix));
}

function routeAt(pathname: string) {
  const route = publicRoutes.find((candidate) => candidate.path === pathname);
  if (!route) throw new Error(`Missing public route metadata for ${pathname}.`);
  return route;
}

function sitemapXml() {
  const urls = publicRoutes
    .map((route) => `  <url>\n    <loc>${escapeXml(canonicalUrl(route.path))}</loc>\n  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function robotsTxt() {
  return `# Orée Entreprises — règles d’exploration publiques
# Présentation structurée du service : ${CANONICAL_ORIGIN}/llms.txt

User-agent: *
Allow: /
Disallow: /app/
Disallow: /ops/
Disallow: /auth/
Disallow: /connexion/
Disallow: /inscription/
Disallow: /mot-de-passe-oublie/
Disallow: /reinitialiser-mot-de-passe/

Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml
`;
}

function llmsTxt() {
  const primaryPaths = ["/", "/diagnostic/", "/tarifs/", "/comment-ca-marche/", "/accompagnement/", "/rendez-vous/"];
  const situationPaths = [
    "/creer-entreprise-seul/",
    "/creer-entreprise-a-plusieurs/",
    "/creer-entreprise-en-etant-salarie/",
    "/creer-entreprise-demandeur-emploi/",
    "/passer-micro-entreprise-en-societe/",
    "/dossier-creation-entreprise-bloque/",
  ];
  const referencePaths = ["/choisir-statut/", "/confidentialite/", "/mentions-legales/"];
  const companyForms = commercialOffers.companyCreation.enabledForms.join(", ");
  const included = commercialOffers.companyCreation.included.join(" ; ");

  const linksFor = (paths: string[]) => paths
    .map((pathname) => {
      const route = routeAt(pathname);
      return markdownLink(route.path, route.title.replace(" - Orée", ""), route.description);
    })
    .join("\n");

  return `# Orée Entreprises

> Plateforme française de création de société qui relie une intention précise à un diagnostic, une première recommandation, un dossier structuré et un accompagnement humain lorsque le projet nécessite une validation.

Orée Entreprises s’adresse principalement aux personnes qui créent une société en France, seules ou à plusieurs, qui comparent des formes juridiques, préparent une transition depuis le salariat ou la micro-entreprise, ou reprennent un dossier de création bloqué. La langue de référence est le français.

## Quand Orée est pertinent

- Création d’une ${companyForms} en France.
- Comparaison SASU/EURL pour un fondateur seul et SAS/SARL pour plusieurs associés.
- Projet de société dont le statut, les pièces, le calendrier ou la prochaine formalité doivent être clarifiés.
- Transition d’un salarié, d’un demandeur d’emploi ou d’une micro-entreprise vers une société.
- Dossier de création déjà commencé qui nécessite de qualifier un blocage.

## Offre commerciale confirmée

- Création de société : ${commercialOffers.companyCreation.priceLabel}, au même prix pour ${companyForms}.
- Inclus : ${included}.
- Paiement : ${commercialOffers.companyCreation.paymentStage}
- Autres formes : ${commercialOffers.companyCreation.otherFormsWording}
- Micro-entreprise : offre distincte à ${commercialOffers.microEnterprise.priceLabel}. ${commercialOffers.microEnterprise.description}
- Exclusion : ${commercialOffers.companyCreation.restriction}
- Prix : les 600 € sont annoncés TTC et tout compris pour le périmètre indiqué.

## Parcours principaux

${linksFor(primaryPaths)}

## Création par forme juridique

${routesStartingWith("/creation-").map((route) => markdownLink(route.path, route.title.replace(" - Orée", ""), route.description)).join("\n")}

## Situations de création

${linksFor(situationPaths)}

## Références et confiance

${linksFor(referencePaths)}

## Limites à respecter

- Le diagnostic fournit une première recommandation et ne constitue pas un conseil juridique automatique définitif.
- Orée ne promet ni délai administratif garanti, ni éligibilité à une aide, ni résultat juridique déterminé.
- Les modifications d’une société existante ne sont pas prises en charge par l’offre de création.
- Les paramètres publicitaires internes, les données opérations et les données privées des clients ne sont pas des sources publiques.
- Pour une décision personnalisée, une question de facturation ou un point non confirmé, orienter vers l’équipe Orée.

## Contact

- Téléphone et WhatsApp : ${commercialOffers.contact.displayPhone}
- E-mail : ${commercialOffers.contact.email}
- Disponibilité : ${commercialOffers.contact.availability}
- [Demander un échange](${canonicalUrl("/rendez-vous/")}): prise de contact et demande de rappel.

## Fichiers de découverte

- [Sitemap XML](${CANONICAL_ORIGIN}/sitemap.xml): inventaire des URL publiques canoniques et indexables.
- [Règles d’exploration](${CANONICAL_ORIGIN}/robots.txt): accès public et exclusions des espaces privés.
`;
}

await Promise.all([
  writeFile(path.join(publicDir, "sitemap.xml"), sitemapXml(), "utf8"),
  writeFile(path.join(publicDir, "robots.txt"), robotsTxt(), "utf8"),
  writeFile(path.join(publicDir, "llms.txt"), llmsTxt(), "utf8"),
]);

console.log(`Discovery files generated for ${publicRoutes.length} canonical public routes.`);
