export type ImageSource = {
  src: string;
  width: number;
};

export type ImageVariant = {
  src: string;
  width: number;
  height: number;
  aspectRatio: string;
  sources: {
    avif: ImageSource[];
    webp: ImageSource[];
  };
};

export type ImageryAsset = ImageVariant & {
  alt: string;
  focalPosition: string;
  intendedRoutes: string[];
  loading: "eager" | "lazy";
  fetchPriority?: "high" | "auto" | "low";
  mobile?: ImageVariant;
};

function sources(base: string, widths: number[]) {
  return {
    avif: widths.map((width) => ({ src: `${base}-${width}.avif`, width })),
    webp: widths.map((width) => ({ src: `${base}-${width}.webp`, width })),
  };
}

function mobile(base: string): ImageVariant {
  const widths = [480, 640, 800];
  return {
    src: `${base}-800.webp`,
    width: 800,
    height: 1000,
    aspectRatio: "4 / 5",
    sources: sources(base, widths),
  };
}

function asset(options: {
  base: string;
  widths: number[];
  width: number;
  height: number;
  alt: string;
  focalPosition?: string;
  intendedRoutes: string[];
  hero?: boolean;
  mobileBase?: string;
}): ImageryAsset {
  return {
    src: `${options.base}-${options.width}.webp`,
    width: options.width,
    height: options.height,
    aspectRatio: `${options.width} / ${options.height}`,
    sources: sources(options.base, options.widths),
    alt: options.alt,
    focalPosition: options.focalPosition ?? "center",
    intendedRoutes: options.intendedRoutes,
    loading: options.hero ? "eager" : "lazy",
    fetchPriority: options.hero ? "high" : "auto",
    mobile: options.mobileBase ? mobile(options.mobileBase) : undefined,
  };
}

const imageryRoot = "/assets/imagery";

export const imagery = {
  homeHero: asset({
    base: `${imageryRoot}/heroes/hero-home-company-journey`,
    mobileBase: `${imageryRoot}/mobile/hero-home-company-journey-mobile`,
    widths: [640, 960, 1280, 1586],
    width: 1586,
    height: 992,
    alt: "Trois porteurs de projet examinent ensemble leur dossier de création de société.",
    focalPosition: "78% center",
    intendedRoutes: ["/"],
    hero: true,
  }),
  sasuHero: asset({
    base: `${imageryRoot}/landing/hero-sasu-solo-founder`,
    mobileBase: `${imageryRoot}/mobile/hero-sasu-solo-founder-mobile`,
    widths: [640, 960, 1280, 1586],
    width: 1586,
    height: 992,
    alt: "Créateur seul relisant les éléments de son projet de société près de son ordinateur.",
    focalPosition: "76% center",
    intendedRoutes: ["/creation-sasu", "/creer-entreprise-seul"],
    hero: true,
  }),
  eurlHero: asset({
    base: `${imageryRoot}/landing/hero-eurl-structured-founder`,
    mobileBase: `${imageryRoot}/mobile/hero-eurl-structured-founder-mobile`,
    widths: [640, 960, 1280, 1586],
    width: 1586,
    height: 992,
    alt: "Entrepreneur structurant seul son activité avec ses notes et son ordinateur.",
    focalPosition: "74% center",
    intendedRoutes: ["/creation-eurl"],
    hero: true,
  }),
  sasHero: asset({
    base: `${imageryRoot}/landing/hero-sas-multiple-founders`,
    mobileBase: `${imageryRoot}/mobile/hero-sas-multiple-founders-mobile`,
    widths: [640, 960, 1280, 1586],
    width: 1586,
    height: 992,
    alt: "Trois associés discutent des décisions d'un projet de société autour d'une table.",
    focalPosition: "78% center",
    intendedRoutes: ["/creation-sas"],
    hero: true,
  }),
  sarlHero: asset({
    base: `${imageryRoot}/landing/hero-sarl-organised-team`,
    mobileBase: `${imageryRoot}/mobile/hero-sarl-organised-team-mobile`,
    widths: [640, 960, 1280, 1448],
    width: 1448,
    height: 1086,
    alt: "Trois associés organisent ensemble les informations de leur future société.",
    focalPosition: "center",
    intendedRoutes: ["/creation-sarl"],
    hero: true,
  }),
  employeeHero: asset({
    base: `${imageryRoot}/landing/hero-employee-transition`,
    mobileBase: `${imageryRoot}/mobile/hero-employee-transition-mobile`,
    widths: [640, 960, 1280, 1586],
    width: 1586,
    height: 992,
    alt: "Salarié préparant progressivement son projet d'entreprise dans un espace de travail calme.",
    focalPosition: "76% center",
    intendedRoutes: ["/creer-entreprise-en-etant-salarie"],
    hero: true,
  }),
  existingBusinessHero: asset({
    base: `${imageryRoot}/landing/hero-existing-business-transition`,
    mobileBase: `${imageryRoot}/mobile/hero-existing-business-transition-mobile`,
    widths: [640, 960, 1280, 1448],
    width: 1448,
    height: 1086,
    alt: "Indépendant déjà en activité organisant sa transition vers une société.",
    focalPosition: "center",
    intendedRoutes: ["/passer-micro-entreprise-en-societe"],
    hero: true,
  }),
  blockedDossierHero: asset({
    base: `${imageryRoot}/landing/hero-blocked-dossier-review`,
    mobileBase: `${imageryRoot}/mobile/hero-blocked-dossier-review-mobile`,
    widths: [640, 960, 1280, 1586],
    width: 1586,
    height: 992,
    alt: "Entrepreneur examinant calmement les étapes d'un dossier de création à reprendre.",
    focalPosition: "70% center",
    intendedRoutes: ["/dossier-creation-entreprise-bloque"],
    hero: true,
  }),
  chooseStatusHero: asset({
    base: `${imageryRoot}/landing/hero-choose-status-decision`,
    mobileBase: `${imageryRoot}/mobile/hero-choose-status-decision-mobile`,
    widths: [640, 960, 1280, 1586],
    width: 1586,
    height: 992,
    alt: "Créateur prenant du recul avant de comparer les structures adaptées à son projet.",
    focalPosition: "76% center",
    intendedRoutes: ["/choisir-statut"],
    hero: true,
  }),
  soloPathway: asset({
    base: `${imageryRoot}/pathways/pathway-solo-founder`,
    mobileBase: `${imageryRoot}/mobile/pathway-solo-founder-mobile`,
    widths: [480, 720, 960, 1280],
    width: 1280,
    height: 801,
    alt: "Créateur travaillant seul sur les premières décisions de sa future société.",
    focalPosition: "75% center",
    intendedRoutes: ["/#parcours"],
  }),
  adviserConsultation: asset({
    base: `${imageryRoot}/support/support-adviser-consultation`,
    mobileBase: `${imageryRoot}/mobile/support-adviser-consultation-mobile`,
    widths: [480, 720, 960, 1280],
    width: 1280,
    height: 960,
    alt: "Porteuse de projet échangeant avec un accompagnant au sujet de son dossier.",
    focalPosition: "center",
    intendedRoutes: ["/accompagnement", "/rendez-vous"],
  }),
  remoteAppointment: asset({
    base: `${imageryRoot}/support/support-remote-appointment`,
    mobileBase: `${imageryRoot}/mobile/support-remote-appointment-mobile`,
    widths: [480, 720, 960, 1280],
    width: 1280,
    height: 960,
    alt: "Entrepreneur prenant des notes pendant un échange de cadrage en visioconférence.",
    focalPosition: "center",
    intendedRoutes: ["/rendez-vous"],
  }),
  documentReview: asset({
    base: `${imageryRoot}/process/process-document-review`,
    widths: [480, 720, 960, 1280],
    width: 1280,
    height: 960,
    alt: "Main annotant un document de travail dont le contenu reste illisible.",
    focalPosition: "center",
    intendedRoutes: ["/", "/comment-ca-marche"],
  }),
} satisfies Record<string, ImageryAsset>;

export const landingHeroBySlug: Record<string, ImageryAsset> = {
  "creation-sasu": imagery.sasuHero,
  "creation-eurl": imagery.eurlHero,
  "creation-sas": imagery.sasHero,
  "creation-sarl": imagery.sarlHero,
  "creer-entreprise-seul": imagery.soloPathway,
  "creer-entreprise-a-plusieurs": imagery.sasHero,
  "creer-entreprise-en-etant-salarie": imagery.employeeHero,
  "passer-micro-entreprise-en-societe": imagery.existingBusinessHero,
  "dossier-creation-entreprise-bloque": imagery.blockedDossierHero,
};
