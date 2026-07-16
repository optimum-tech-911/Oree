import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/comment-ca-marche",
  "/offres",
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

for (const route of routes) {
  test(`${route} se charge sans erreur d'exécution`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(route);
    await expect(page).toHaveTitle(/Orée/);
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("h1, h2").first()).toBeVisible();
    expect(pageErrors).toEqual([]);
  });
}

test("le diagnostic produit une orientation", async ({ page }) => {
  await page.goto("/diagnostic");
  await page.getByRole("button", { name: /je suis prêt à créer/i }).click();
  await page.getByRole("button", { name: /étape suivante/i }).click();
  await page.getByRole("button", { name: /seul/i }).click();
  await page.getByRole("button", { name: /étape suivante/i }).click();
  await expect(page.locator("body")).toContainText(/activité|situation/i);
});

test("la récupération du mot de passe confirme la demande", async ({ page }) => {
  await page.goto("/mot-de-passe-oublie");
  await page.getByLabel("Adresse email").fill("utilisateur@exemple.fr");
  await page.getByRole("button", { name: /envoyer le lien sécurisé/i }).click();
  await expect(page.getByRole("heading", { name: /demande enregistrée/i })).toBeVisible();
});

test("la recherche documentaire filtre la liste", async ({ page }) => {
  await page.goto("/app/documents");
  await page.getByPlaceholder("Rechercher").fill("capital");
  await expect(page.getByText("Attestation de dépôt du capital")).toBeVisible();
  await expect(page.getByText("Pièce d'identité")).toHaveCount(0);
});

test("un message peut être envoyé dans la démonstration", async ({ page }) => {
  await page.goto("/app/messages");
  await page.getByPlaceholder("Rédiger un message…").fill("Message de contrôle fonctionnel");
  await page.getByRole("button", { name: "Envoyer le message" }).click();
  await expect(page.getByText("Message de contrôle fonctionnel")).toBeVisible();
});

test("les filtres et détails opérations sont fonctionnels", async ({ page }) => {
  await page.goto("/ops/projets");
  await page.getByPlaceholder(/rechercher dans projets/i).fill("cabinet");
  await expect(page.getByText("Cabinet de conseil")).toBeVisible();
  await page.getByRole("button", { name: "Détails" }).click();
  await expect(page.getByText(/projet orienté vers sasu/i)).toBeVisible();
});

test("les notifications peuvent être marquées comme lues", async ({ page }) => {
  await page.goto("/app/notifications");
  const button = page.getByRole("button", { name: /tout marquer comme lu/i });
  await button.click();
  await expect(button).toBeDisabled();
});

test("les modifications du projet sont enregistrées localement", async ({ page }) => {
  await page.goto("/app/projet");
  await page.getByLabel("Nom du projet").fill("Projet éditorial");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText("Projet enregistré")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Nom du projet")).toHaveValue("Projet éditorial");
});

test("le méga-menu de création reste lisible et contenu dans la fenêtre", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto("/");
  await expect(page.locator("header").getByRole("link", { name: "Se connecter" })).toBeVisible();
  await expect(page.locator("header").getByRole("link", { name: /Démarrer mon diagnostic/ })).toBeVisible();
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
  const heroCta = page.locator("main").getByRole("link", { name: /Démarrer mon diagnostic/ }).first();
  await expect(heroCta).toHaveCSS("background-color", "rgb(247, 245, 239)");
  await expect(heroCta).toHaveCSS("color", "rgb(11, 18, 32)");
  await expect(page.locator("header").getByRole("link", { name: /Démarrer mon diagnostic/ })).toHaveCSS("background-color", "rgb(36, 87, 255)");
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
  const rail = page.locator("[data-ecosystem-rail]");
  await expect(rail.getByRole("heading", { name: /écosystème officiel de la création d'entreprise/i })).toBeVisible();
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

test("le ruban devient une grille lisible sur mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const rail = page.locator("[data-ecosystem-rail]");
  await expect(rail.locator(".ecosystem-viewport")).toBeHidden();
  await expect(rail.locator("[data-ecosystem-mobile]").getByRole("img", { name: "URSSAF" })).toBeVisible();
  await expect(rail.getByText(/Les organismes et interlocuteurs concernés varient/)).toBeVisible();
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
  const cta = page.locator("main").getByRole("link", { name: /Démarrer mon diagnostic/ }).first();
  await page.waitForTimeout(1100);
  await cta.hover();
  await page.waitForTimeout(220);
  expect(await cta.evaluate((element) => element.matches(":hover"))).toBeTruthy();
  await expect(cta).not.toHaveCSS("transform", "none");
});

test("le héros utilise plusieurs images, une navigation active et un zoom lent", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const hero = page.locator("[data-hero-carousel]");
  await expect(hero.getByRole("heading", { name: /Créez votre société avec une méthode claire/i })).toBeVisible();
  await expect(hero.getByRole("tab")).toHaveCount(5);
  await expect(hero.locator("[data-hero-zoom]")).not.toHaveCSS("transform", "none");
  await hero.getByRole("tab", { name: /Créer seul/i }).click();
  await expect(hero.getByRole("heading", { name: /Comparez les options avant de choisir votre structure/i })).toBeVisible();
  await expect(hero.getByRole("img", { name: /Créateur seul/ })).toBeVisible();
  const pause = hero.getByRole("button", { name: /Mettre en pause/ });
  await pause.click();
  await expect(hero.getByRole("button", { name: /Reprendre le défilement/ })).toBeVisible();
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
    const hero = page.locator("[data-hero-carousel]");
    const headerSurface = page.locator("header .container-wide");
    const heading = hero.getByRole("heading").first();
    const primaryCta = hero.locator(".hero-primary-cta");
    const storyTabs = hero.locator(".hero-story-tabs");
    const assistant = page.locator("button[aria-label='Ouvrir le Guide Orée']");

    await expect(headerSurface).toBeVisible();
    await expect(page.locator("header").getByRole("link", { name: "Démarrer" })).toBeVisible();
    await expect(page.locator("header").getByRole("button", { name: "Ouvrir le menu" })).toBeVisible();
    await expect(heading).toBeVisible();
    await expect(primaryCta).toBeVisible();
    await expect(storyTabs.locator(".hero-story-title").first()).toHaveCSS("color", "rgb(247, 245, 239)");
    await expect(storyTabs.locator(".hero-story-summary").first()).toContainText("Diagnostic, orientation et dossier");
    await expect(page.getByText("Orientation offerte")).toHaveCount(0);
    await expect(assistant).toBeVisible();

    const boxes = await Promise.all([headerSurface, heading, primaryCta, storyTabs, assistant].map((locator) => locator.boundingBox()));
    const [headerBox, headingBox, ctaBox, tabsBox, assistantBox] = boxes;
    expect(headerBox && headingBox && ctaBox && tabsBox && assistantBox).toBeTruthy();
    expect(headingBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height + 20);
    expect(ctaBox!.y + ctaBox!.height).toBeLessThanOrEqual(tabsBox!.y - 8);
    expect(assistantBox!.y + assistantBox!.height).toBeLessThanOrEqual(tabsBox!.y - 8);
    expect(tabsBox!.x).toBeGreaterThanOrEqual(0);
    expect(tabsBox!.x + tabsBox!.width).toBeLessThanOrEqual(width);

    for (const control of [page.locator("header").getByRole("link", { name: "Démarrer" }), page.locator("header").getByRole("button", { name: "Ouvrir le menu" }), hero.getByRole("button", { name: /Mettre en pause/ })]) {
      const box = await control.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.width).toBeGreaterThanOrEqual(44);
    }

    await page.locator("header").getByRole("button", { name: "Ouvrir le menu" }).click();
    await expect(page.getByRole("heading", { name: "Trouver mon parcours" })).toBeVisible();
    await page.locator("header").getByRole("button", { name: "Fermer le menu" }).click();
  });
}

test("le chargement de route affiche l'identité et une progression animée", async ({ page }) => {
  await page.route("**/assets/HomePage-*.js", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 850));
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const loader = page.locator("[data-page-loader]");
  await expect(loader).toBeVisible();
  await expect(loader.getByRole("link", { name: /Orée Entreprises, accueil/ })).toBeVisible();
  await expect(loader).toContainText("Préparation de votre espace");
  await expect(page.locator("[data-hero-carousel]")).toBeVisible();
});

test("les contrôles à fond plein conservent un contraste lisible sur toutes les routes", async ({ page }) => {
  const violations: string[] = [];
  for (const route of routes) {
    await page.goto(route);
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
