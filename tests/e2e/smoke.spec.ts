import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

const routes = [
  "/",
  "/comment-ca-marche",
  "/offres",
  "/tarifs",
  "/accompagnement",
  "/choisir-statut",
  "/diagnostic",
  "/rendez-vous",
  "/creation-sasu",
  "/creation-eurl",
  "/creation-sas",
  "/creation-sarl",
  "/creer-entreprise-seul",
  "/creer-entreprise-a-plusieurs",
  "/creer-entreprise-en-etant-salarie",
  "/creer-entreprise-demandeur-emploi",
  "/passer-micro-entreprise-en-societe",
  "/dossier-creation-entreprise-bloque",
  "/confidentialite",
  "/mentions-legales",
  "/connexion",
  "/inscription",
  "/mot-de-passe-oublie",
  "/reinitialiser-mot-de-passe",
  "/app",
  "/app/projet",
  "/app/orientation",
  "/app/associes",
  "/app/documents",
  "/app/formalites",
  "/app/suivi",
  "/app/messages",
  "/app/rendez-vous",
  "/app/notifications",
  "/app/parametres",
  "/ops",
  "/ops/leads",
  "/ops/projets",
  "/ops/documents",
  "/ops/rendez-vous",
  "/ops/equipe",
  "/ops/aide",
  "/ops/profil",
];

test.beforeEach(async ({ page }) => {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort("blockedbyclient"));
});

async function skipWhenLoginIsRequired(page: Page, readySurface: Locator, reason: string) {
  const loginHeading = page.getByRole("heading", { name: "Retrouvez votre projet." });
  await expect(readySurface.or(loginHeading)).toBeVisible();
  test.skip(await loginHeading.isVisible(), reason);
}

async function waitForHydration(page: Page) {
  await expect(page.locator("#root")).toHaveAttribute("data-oree-hydrated", "true");
}

for (const route of routes) {
  test(`${route} se charge sans erreur d'exécution`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    await expect(page).toHaveTitle(/Orée/);
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("h1, h2").filter({ visible: true }).first()).toBeVisible();
    expect(pageErrors).toEqual([]);
  });
}

test("le diagnostic produit une orientation", async ({ page }) => {
  await page.goto("/diagnostic");
  await page.getByRole("button", { name: /je veux créer une société seul/i }).click();
  await page.getByRole("button", { name: /étape suivante/i }).click();
  await page.getByRole("button", { name: /seul/i }).click();
  await page.getByRole("button", { name: /étape suivante/i }).click();
  await expect(page.locator("body")).toContainText(/activité|situation/i);
});

test("le diagnostic dossier bloqué affiche une synthèse avant les coordonnées", async ({ page }) => {
  await page.goto("/diagnostic?intent=blocked_dossier");
  await page.getByRole("button", { name: /statuts ou décisions/i }).click();
  await page.getByLabel(/décrivez le message/i).fill("Une correction des statuts est demandée avant le dépôt.");
  await page.getByRole("button", { name: /étape suivante/i }).click();
  await expect(page.getByRole("heading", { name: /point de blocage doit d’abord être qualifié/i })).toBeVisible();
});

test("une intention SAS ouvre directement le bon embranchement du diagnostic", async ({ page }) => {
  await page.goto("/diagnostic?intent=creation_sas");
  await expect(page.getByRole("button", { name: /à plusieurs/i })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(/qui porte le projet/i)).toBeVisible();
});

for (const form of ["sasu", "eurl", "sas", "sarl"]) {
  test(`la landing ${form.toUpperCase()} affiche l’offre TTC et ses actions d’acquisition`, async ({ page }) => {
    await page.goto(`/creation-${form}`);
    await expect(page.getByRole("heading", { name: new RegExp(`Créez votre ${form} pour 600 € TTC tout compris`, "i") }).first()).toBeVisible();
    const hero = page.locator("main section").first();
    await expect(hero.getByRole("link", { name: form === "sasu" ? "Commencer mon dossier" : "Commencer ma création" })).toBeVisible();
    await expect(hero.getByRole("link", { name: "Être rappelé" })).toHaveAttribute("href", "#rappel");
    await expect(hero.getByRole("link", { name: form === "sasu" ? /Appeler maintenant/ : "Appeler" })).toHaveAttribute("href", /^tel:\+33787823208/);
    await expect(hero.getByRole("link", { name: "Écrire sur WhatsApp" })).toHaveAttribute("href", /wa\.me\/33787823208/);
  });
}

test("la landing SASU conserve l’attribution et initialise le suivi Google des appels une seule fois", async ({ page }) => {
  await page.goto("/creation-sasu/?gclid=XYZ&utm_source=google&utm_medium=cpc");
  await expect(page).toHaveURL(/\/creation-sasu\/\?gclid=XYZ&utm_source=google&utm_medium=cpc$/);
  await expect(page).toHaveTitle(/Création SASU : 600 € TTC tout compris/);
  await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", /\/creation-sasu\/$/);

  const tracking = await page.evaluate(() => {
    const layer = (window as Window & { dataLayer?: unknown[] }).dataLayer ?? [];
    const commands = layer
      .filter((entry) => typeof entry === "object" && entry !== null && "length" in entry)
      .map((entry) => Array.from(entry as unknown as ArrayLike<unknown>));
    return {
      loaders: document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]').length,
      ga4: commands.filter((entry) => entry[0] === "config" && entry[1] === "G-FL6QMMYVLM").length,
      adsCall: commands.filter((entry) => entry[0] === "config" && entry[1] === "AW-18362621917/mQHqCLOG6tscEN2__bNE").length,
    };
  });
  expect(tracking).toEqual({ loaders: 1, ga4: 1, adsCall: 1 });
  await expect(page.locator('[data-phone-number="07 87 82 32 08"]').first()).toHaveAttribute("href", "tel:+33787823208");
});

test("le formulaire de rappel reste utilisable sur mobile", async ({ page }) => {
  await page.route(/\/functions\/v1\/submit-lead/, async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ id: "58c55530-9c39-4c52-bf1f-0ad01fbe8844", claimToken: "x".repeat(64) }),
    });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/creation-sasu");
  const form = page.locator("[data-callback-form]");
  await form.scrollIntoViewIfNeeded();
  await expect(form).toBeVisible();
  await form.getByLabel("Prénom").fill("Camille");
  await form.getByLabel("Téléphone").fill("06 12 34 56 78");
  await form.getByLabel(/J’accepte le traitement/).check();
  await expect(form.getByRole("button", { name: "Être rappelé" })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await form.getByRole("button", { name: "Être rappelé" }).click();
  await expect(page.getByRole("heading", { name: /Votre demande de rappel est enregistrée/i })).toBeVisible();
});

test("la landing SASU utilise la scène de travail naturelle validée", async ({ page }) => {
  await page.goto("/creation-sasu");
  const hero = page.locator("main section").first();
  const image = hero.getByRole("img", { name: /Créatrice travaillant naturellement/i });
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute("src", /pathway-home-founder-1280\.webp$/);
});

for (const width of [375, 390, 430, 768, 1440]) {
  test(`la landing SASU reste lisible et sans débordement à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 800 ? 900 : 1000 });
    await page.goto("/creation-sasu/?gclid=RESPONSIVE-CHECK", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    const hero = page.locator("main section").first();
    await expect(hero.getByRole("heading", { name: /Créez votre SASU pour 600 € TTC tout compris/i })).toBeVisible();
    await expect(hero.getByRole("link", { name: /Appeler maintenant/i })).toBeVisible();
    await expect(hero.getByRole("link", { name: "Être rappelé" })).toBeVisible();
    await expect(hero.getByRole("link", { name: "Commencer mon dossier" })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    if (width < 1024) {
      await expect(page.getByLabel(/Appeler Orée au 07 87 82 32 08/).first()).toBeVisible();
    }
  });
}

test("le diagnostic présente une progression unique et un accès direct à l’équipe", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/diagnostic?intent=creation_sasu");
  await expect(page.getByText(/Question 2 sur 9/)).toBeVisible();
  await expect(page.getByRole("link", { name: /Besoin d’aide.*Appeler/i })).toHaveAttribute("href", "tel:+33787823208");
  await expect(page.locator("main")).not.toContainText(/Parcours adaptatif|Projet en direct|Lecture actuelle|Orientation indicative/i);
});

test("la récupération du mot de passe confirme la demande", async ({ page }) => {
  await page.goto("/mot-de-passe-oublie");
  await page.getByLabel("Adresse email").fill("utilisateur@exemple.fr");
  await page.getByRole("button", { name: /envoyer le lien sécurisé/i }).click();
  await expect(page.getByRole("heading", { name: /demande enregistrée/i })).toBeVisible();
});

test("la recherche documentaire filtre la liste", async ({ page }) => {
  await page.goto("/app/documents");
  const search = page.getByPlaceholder("Rechercher");
  await skipWhenLoginIsRequired(page, search, "Une session client réelle est requise quand Supabase est configuré.");
  await search.fill("capital");
  await expect(page.getByText("Attestation de dépôt du capital")).toBeVisible();
  await expect(page.getByText("Pièce d'identité")).toHaveCount(0);
});

test("un message peut être envoyé dans la démonstration", async ({ page }) => {
  await page.goto("/app/messages");
  const composer = page.getByPlaceholder("Rédiger un message…");
  await skipWhenLoginIsRequired(page, composer, "Une session client réelle est requise quand Supabase est configuré.");
  await composer.fill("Message de contrôle fonctionnel");
  await page.getByRole("button", { name: "Envoyer le message" }).click();
  await expect(page.getByText("Message de contrôle fonctionnel")).toBeVisible();
});

test("les filtres et détails opérations sont fonctionnels", async ({ page }) => {
  await page.goto("/ops/projets");
  const search = page.getByPlaceholder(/rechercher dans projets/i);
  await skipWhenLoginIsRequired(page, search, "Une session opérations réelle est requise quand Supabase est configuré.");
  await search.fill("cabinet");
  await expect(page.getByText("Cabinet de conseil")).toBeVisible();
  await page.getByRole("button", { name: "Détails" }).click();
  await expect(page.getByText(/projet orienté vers sasu/i)).toBeVisible();
});

test("les notifications peuvent être marquées comme lues", async ({ page }) => {
  await page.goto("/app/notifications");
  const button = page.getByRole("button", { name: /tout marquer comme lu/i });
  await skipWhenLoginIsRequired(page, button, "Une session client réelle est requise quand Supabase est configuré.");
  await button.click();
  await expect(button).toBeDisabled();
});

test("les modifications du projet sont enregistrées localement", async ({ page }) => {
  await page.goto("/app/projet");
  const projectName = page.getByLabel("Nom du projet");
  await skipWhenLoginIsRequired(page, projectName, "Une session client réelle est requise quand Supabase est configuré.");
  await projectName.fill("Projet éditorial");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText("Projet enregistré")).toBeVisible();
  await page.reload();
  await expect(projectName).toHaveValue("Projet éditorial");
});

test("le méga-menu de création reste lisible et contenu dans la fenêtre", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto("/");
  await expect(page.locator("header").getByRole("link", { name: "Se connecter" })).toBeVisible();
  await expect(page.locator("header").getByRole("link", { name: /Commencer mon dossier|Démarrer mon diagnostic/ })).toBeVisible();
  await page.getByRole("button", { name: "Créer ma société" }).click();
  const menu = page.locator("#creation-menu");
  await expect(menu).toBeVisible();
  await expect(menu.getByText("Vous hésitez encore ?")).toHaveCSS("color", "rgb(247, 245, 239)");
  await expect(menu.getByText(/Le diagnostic part de votre situation/)).toHaveCSS("color", "rgb(247, 245, 239)");
  const box = await menu.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(1280);
});

test("la page d'accueil applique les polices, la couleur d'action et les images prévues", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toHaveCSS("font-family", /Onest/);
  await expect(page.locator(".editorial-mark").first()).toHaveCSS("font-family", /Newsreader/);
  const heroCta = page.locator("main").getByRole("link", { name: /Commencer ma création/i }).first();
  await expect(heroCta).toHaveCSS("background-color", "rgb(36, 87, 255)");
  await expect(heroCta).toHaveCSS("color", "rgb(247, 245, 239)");
  const desktopHeaderCta = page.locator("header").getByRole("link", { name: /Commencer mon dossier|Démarrer mon diagnostic/ });
  if (await desktopHeaderCta.count()) {
    await expect(desktopHeaderCta).toHaveCSS("background-color", "rgb(36, 87, 255)");
  }
  const loadedImages = await page.locator("img").evaluateAll((images) => images.filter((image) => {
    const img = image as HTMLImageElement;
    return img.complete && img.naturalWidth > 0;
  }).length);
  expect(loadedImages).toBeGreaterThanOrEqual(2);
});

for (const width of [390, 768, 1280, 1440, 1728]) {
  test(`l'accueil ne déborde pas horizontalement à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("l'identité Orée et les métadonnées d'installation utilisent les nouveaux fichiers", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await waitForHydration(page);
  const logo = page.locator("[data-brand-logo='horizontal'] img").first();
  await expect(logo).toBeVisible();
  await expect(logo).toHaveAttribute("src", "/assets/brand/oree-entreprises-horizontal.webp");
  expect((await logo.boundingBox())!.width).toBeGreaterThanOrEqual(190);
  await expect(page.locator("link[rel='manifest']")).toHaveAttribute("href", "/manifest.webmanifest");
  await expect(page.locator("link[rel='apple-touch-icon']")).toHaveAttribute("href", "/apple-touch-icon.png");
  const manifest = await page.request.get("/manifest.webmanifest");
  expect(manifest.ok()).toBeTruthy();
  await expect(manifest.json()).resolves.toMatchObject({ short_name: "Orée Entreprises", theme_color: "#0B1220" });
});

test("le ruban de formalités défile, reste exact et se suspend au survol", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await waitForHydration(page);
  const rail = page.locator("[data-ecosystem-rail]");
  await expect(rail.getByRole("heading", { name: /organismes et prestataires qui peuvent jalonner une création/i })).toBeVisible();
  await expect(rail.getByRole("img", { name: "INPI et République française" })).toBeVisible();
  await expect(rail.getByRole("img", { name: "URSSAF" })).toBeVisible();
  await expect(rail.getByRole("img", { name: "INSEE" })).toBeVisible();
  await expect(rail).toContainText(/ne constitue pas l'affirmation d'un partenariat commercial/i);
  await expect(page.getByText(/nos partenaires/i)).toHaveCount(0);
  const track = rail.locator(".ecosystem-track");
  await expect(track).toHaveCSS("animation-name", "ecosystem-marquee");
  await expect(track).toHaveCSS("animation-duration", "38s");
  await rail.locator(".ecosystem-viewport").hover();
  await expect(track).toHaveCSS("animation-play-state", "paused");
});

test("le ruban reste animé et contrôlable sur mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await waitForHydration(page);
  const rail = page.locator("[data-ecosystem-rail]");
  await expect(rail.locator(".ecosystem-viewport")).toBeHidden();
  await expect(rail.locator("[data-ecosystem-mobile]").getByRole("img", { name: "URSSAF" })).toBeVisible();
  const mobileTrack = rail.locator(".ecosystem-mobile-track");
  await expect(mobileTrack).toHaveCSS("animation-name", "ecosystem-mobile-marquee");
  await rail.getByRole("button", { name: /Mettre en pause le défilement des organismes/i }).click();
  await expect(mobileTrack).toHaveCSS("animation-play-state", "paused");
  await expect(rail.getByText(/Les organismes et interlocuteurs concernés varient/)).toBeVisible();
});

test("le sélecteur d'activités reste utile et animé sur mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const spotlight = page.locator("[data-activity-spotlight]");
  await spotlight.scrollIntoViewIfNeeded();
  const artisan = spotlight.getByRole("button", { name: /Artisanat/i });
  const logistics = spotlight.getByRole("button", { name: /Logistique/i });
  await expect(artisan).toHaveAttribute("aria-pressed", "true");
  await expect(spotlight.getByRole("img", { name: /Artisan préparant son travail dans son atelier/i })).toBeVisible();
  await logistics.click();
  await expect(logistics).toHaveAttribute("aria-pressed", "true");
  await expect(spotlight.getByRole("img", { name: /Professionnel de la logistique préparant une livraison/i })).toBeVisible();
});

test("les contacts directs restent accessibles sur mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const hero = page.locator("[data-home-conversion-hero]");
  const launcher = page.locator("[data-contact-launcher]");
  await expect(launcher).toBeVisible();
  await expect(launcher.getByText("Contacter l’équipe", { exact: true })).toHaveCSS("color", "rgb(247, 245, 239)");
  await hero.getByRole("button", { name: /Contacter l’équipe/i }).click();
  const contact = page.locator("[data-contact-sheet]");
  await expect(contact).toBeVisible();
  await expect(contact.getByRole("link", { name: /Appeler/i })).toHaveAttribute("href", "tel:+33787823208");
  await expect(contact.getByRole("link", { name: /Envoyer un SMS/i })).toHaveAttribute("href", /sms:\+33787823208/);
  await expect(contact.getByRole("link", { name: /Écrire par e-mail/i })).toHaveAttribute("href", /mailto:sebaasofiene@gmail\.com/);
  await expect(contact.getByRole("link", { name: /^WhatsApp Continuer/i })).toHaveAttribute("href", /wa\.me\/33787823208/);
  await expect(contact.getByRole("link", { name: /^WhatsApp Business/i })).toHaveAttribute("href", /api\.whatsapp\.com\/send/);
});

test("le lanceur de contact reste présent sur ordinateur", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator("[data-contact-launcher]")).toBeVisible();
});

test("le Guide Orée peut basculer vers un contact direct", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Tout refuser" }).click();
  await page.getByRole("button", { name: "Ouvrir le Guide Orée" }).click();
  const directAssistantAction = page.getByRole("button", { name: /Parler directement à l’équipe/i });
  await expect(directAssistantAction).toBeVisible();
  await expect(directAssistantAction.getByText("Parler directement à l’équipe", { exact: true })).toHaveCSS("color", "rgb(247, 245, 239)");
  await directAssistantAction.click();
  await expect(page.locator("[data-contact-sheet]")).toBeVisible();
  await expect(page.locator("[data-contact-sheet]").getByRole("link", { name: /WhatsApp Business/i })).toBeVisible();
});

test("le Guide Orée répond précisément sur l’offre confirmée", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Tout refuser" }).click();
  await page.getByRole("button", { name: "Ouvrir le Guide Orée" }).click();

  const guide = page.getByLabel("Guide de navigation Orée");
  await expect(guide).toBeVisible();
  await expect(guide.locator(".lucide-bot, .lucide-sparkles")).toHaveCount(0);
  await expect(guide).not.toContainText(/prêt pour une fonction IA/i);

  const input = page.getByPlaceholder("Écrivez ou prononcez ce que vous cherchez…");
  await input.fill("Les frais de greffe et l’annonce légale sont-ils inclus ?");
  await input.press("Enter");
  await expect(page.getByText(/comprend.*frais de greffe inclus.*annonce légale incluse/i)).toBeVisible();

  await input.fill("Pouvez-vous modifier une société existante ?");
  await input.press("Enter");
  await expect(page.getByText(/modifications de sociétés existantes ne sont pas prises en charge/i)).toBeVisible();
});

test("les actions de réponse du Guide restent lisibles sans survol", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Tout refuser" }).click();
  await page.getByRole("button", { name: "Ouvrir le Guide Orée" }).click();
  await page.getByRole("button", { name: "Je suis salarié et je veux me lancer" }).click();
  const responseAction = page.locator("[data-assistant-response-action]").last();
  await expect(responseAction).toBeVisible();
  await expect(responseAction.locator("span").first()).toHaveCSS("color", "rgb(247, 245, 239)");
});

test("les mouvements respectent la préférence de réduction", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".ecosystem-track")).toHaveCSS("animation-name", "none");
  const section = page.locator("[data-section-reveal]").first();
  await expect(section).toHaveCSS("transform", "none");
});

test("le CTA principal réagit clairement au survol", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  test.skip(!await page.evaluate(() => matchMedia("(hover: hover)").matches), "Le projet tactile ne simule pas un pointeur avec survol.");
  const cta = page.locator("main").getByRole("link", { name: /Commencer ma création/i }).first();
  await page.waitForTimeout(1100);
  await cta.hover();
  await page.waitForTimeout(220);
  expect(await cta.evaluate((element) => element.matches(":hover"))).toBeTruthy();
  await expect(cta).not.toHaveCSS("transform", "none");
});

test("le héros d'accueil présente une proposition stable et un aperçu produit", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const hero = page.locator("[data-home-conversion-hero]");
  await expect(hero.getByRole("heading", { name: /Créez votre société pour 600 € TTC tout compris/i })).toBeVisible();
  await expect(hero.getByRole("link", { name: /Commencer ma création/i })).toBeVisible();
  await expect(hero.getByText("Studio Horizon", { exact: true }).filter({ visible: true })).toBeVisible();
  await expect(hero.getByRole("tab")).toHaveCount(0);
  await expect(hero.getByRole("button", { name: /Mettre en pause/i })).toHaveCount(0);
});

test("le héros d'accueil ne change pas automatiquement son message", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");
  const hero = page.locator("[data-home-conversion-hero]");
  const heading = hero.getByRole("heading").first();
  const copy = await heading.textContent();
  await expect(hero.getByText("Studio Horizon", { exact: true }).filter({ visible: true })).toBeVisible();
  await expect(hero.getByText("À vérifier", { exact: true }).filter({ visible: true })).toBeVisible();
  await page.waitForTimeout(3800);
  await expect(heading).toHaveText(copy ?? "");
});

test("la navigation d'accueil est sombre sur le héros puis claire au défilement", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const header = page.locator("header");
  await expect(header.locator(".container-wide")).toHaveClass(/bg-\[var\(--ink\)\]\/78/);
  await expect(header.getByRole("button", { name: /Rechercher avec le Guide Orée/ })).toBeVisible();
  await expect(header.getByText("FR", { exact: true })).toBeVisible();
  await expect(header.locator("[data-brand-logo] img")).not.toHaveCSS("filter", "none");
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(header.locator(".container-shell")).toHaveClass(/bg-\[color:var\(--canvas\)\]\/95/);
  await expect(header.locator("[data-brand-logo] img")).toHaveCSS("filter", "none");
});

for (const width of [320, 360, 390, 430]) {
  test(`la composition mobile reste complète et sans chevauchement à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const hero = page.locator("[data-home-conversion-hero]");
    const headerSurface = page.locator("header .container-wide");
    const heading = hero.getByRole("heading").first();
    const primaryCta = hero.locator("[data-primary-cta]");
    const assistant = page.locator("button[aria-label='Ouvrir le Guide Orée']");
    const contactLauncher = page.locator("[data-contact-launcher]");

    await expect(headerSurface).toBeVisible();
    await expect(page.locator("header").getByRole("link", { name: "Se connecter" })).toBeVisible();
    await expect(page.locator("header").getByRole("button", { name: "Ouvrir le menu" })).toBeVisible();
    await expect(heading).toBeVisible();
    await expect(primaryCta).toBeVisible();
    await expect(page.getByText("Orientation offerte")).toHaveCount(0);
    await page.getByRole("button", { name: "Tout refuser" }).click();
    await expect(assistant).toBeVisible();
    await expect(contactLauncher).toBeVisible();

    const boxes = await Promise.all([headerSurface, heading, primaryCta, assistant, contactLauncher].map((locator) => locator.boundingBox()));
    const [headerBox, headingBox, ctaBox, assistantBox, contactBox] = boxes;
    expect(headerBox && headingBox && ctaBox && assistantBox && contactBox).toBeTruthy();
    expect(headingBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height + 20);
    expect(ctaBox!.x).toBeGreaterThanOrEqual(0);
    expect(ctaBox!.x + ctaBox!.width).toBeLessThanOrEqual(width);
    expect(assistantBox!.x + assistantBox!.width).toBeLessThanOrEqual(width);
    expect(contactBox!.x + contactBox!.width).toBeLessThanOrEqual(assistantBox!.x - 8);

    for (const control of [page.locator("header").getByRole("link", { name: "Se connecter" }), page.locator("header").getByRole("button", { name: "Ouvrir le menu" }), primaryCta]) {
      const box = await control.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.width).toBeGreaterThanOrEqual(44);
    }

    await page.locator("header").getByRole("button", { name: "Ouvrir le menu" }).click();
    await expect(page.getByRole("heading", { name: "Trouver mon parcours" })).toBeVisible();
    await page.locator("header").getByRole("button", { name: "Fermer le menu" }).click();
  });
}

test("le consentement initial ne masque pas le CTA d'une page d'acquisition mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/creer-entreprise-demandeur-emploi");
  const primaryCta = page.locator("main").getByRole("link", { name: /Commencer ma création/i }).first();
  const consent = page.getByLabel("Préférences de confidentialité");
  await expect(primaryCta).toBeVisible();
  await expect(consent).toBeVisible();
  await expect(page.locator(".sticky-mobile-cta")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Ouvrir le Guide Orée" })).toHaveCount(0);
  const [ctaBox, consentBox] = await Promise.all([primaryCta.boundingBox(), consent.boundingBox()]);
  expect(ctaBox && consentBox).toBeTruthy();
  expect(consentBox!.y).toBeGreaterThanOrEqual(ctaBox!.y + ctaBox!.height + 8);

  await page.getByRole("button", { name: "Tout refuser" }).click();
  const sticky = page.locator(".sticky-mobile-cta");
  const assistant = page.getByRole("button", { name: "Ouvrir le Guide Orée" });
  await expect(sticky).toBeVisible();
  await expect(assistant).toBeVisible();
  const [stickyBox, assistantBox] = await Promise.all([sticky.boundingBox(), assistant.boundingBox()]);
  expect(stickyBox && assistantBox).toBeTruthy();
  expect(assistantBox!.y + assistantBox!.height).toBeLessThanOrEqual(stickyBox!.y - 8);
});

test("la page tarifs garde une action utile dans le premier écran mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/tarifs");
  await expect(page.locator("main").getByRole("link", { name: /Commencer ma création/i }).first()).toBeInViewport();
  await expect(page.locator(".sticky-mobile-cta")).toHaveCount(0);
});

test("le chargement direct réutilise le HTML prérendu sans écran vide", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("link", { name: /Orée Entreprises, accueil/ }).first()).toBeVisible();
  await expect(page.locator("[data-home-conversion-hero]")).toBeVisible();
  await expect(page.locator("main")).not.toBeEmpty();
});

test("les contrôles à fond plein conservent un contraste lisible sur toutes les routes", async ({ page }) => {
  test.slow();
  const violations: string[] = [];
  for (const route of routes) {
    await page.goto(route);
    await waitForHydration(page);
    const routeViolations = await page.locator("button, a").evaluateAll((elements) => {
      const parseColor = (value: string) => {
        const values = value.match(/[\d.]+/g)?.map(Number) ?? [];
        return { r: values[0] ?? 0, g: values[1] ?? 0, b: values[2] ?? 0, a: values[3] ?? 1 };
      };
      const luminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
        const channels = [r, g, b].map((channel) => {
          const value = channel / 255;
          return value <= .03928 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
        });
        return .2126 * channels[0]! + .7152 * channels[1]! + .0722 * channels[2]!;
      };
      return elements.flatMap((element) => {
        const node = element as HTMLElement;
        const text = node.innerText.trim().replace(/\s+/g, " ");
        const style = getComputedStyle(node);
        const box = node.getBoundingClientRect();
        if (!text || box.width < 2 || box.height < 2 || style.display === "none" || style.visibility === "hidden" || node.matches(":disabled")) return [];
        const foreground = parseColor(style.color);
        const background = parseColor(style.backgroundColor);
        if (background.a < .82 || foreground.a < .82) return [];
        const light = luminance(foreground);
        const dark = luminance(background);
        const ratio = (Math.max(light, dark) + .05) / (Math.min(light, dark) + .05);
        const fontSize = Number.parseFloat(style.fontSize);
        const fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
        const minimum = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 600) ? 3 : 4.5;
        return ratio + .05 < minimum ? [`${text.slice(0, 70)} (${ratio.toFixed(2)}:1)`] : [];
      });
    });
    violations.push(...routeViolations.map((violation) => `${route}: ${violation}`));
  }
  expect(violations).toEqual([]);
});
