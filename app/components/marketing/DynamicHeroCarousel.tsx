import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, MessageCircle, Pause, Play } from "lucide-react";
import { ArtDirectedPicture } from "@/components/media/ArtDirectedPicture";
import { ButtonLink } from "@/components/ui/Button";
import { imagery, type ImageryAsset } from "@/content/imagery";
import { cn } from "@/lib/cn";

type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  asset: ImageryAsset;
  href: string;
  action: string;
  summary: string;
};

const heroSlides: HeroSlide[] = [
  {
    id: "methode",
    eyebrow: "Création de société",
    title: "Créez votre société avec",
    accent: "une méthode claire.",
    description: "Clarifiez le projet, comparez les structures pertinentes et organisez un dossier qui indique chaque prochaine action.",
    asset: imagery.homeHero,
    href: "/diagnostic",
    action: "Démarrer mon diagnostic",
    summary: "Diagnostic, orientation et dossier",
  },
  {
    id: "solo",
    eyebrow: "Créer seul",
    title: "Comparez les options avant de",
    accent: "choisir votre structure.",
    description: "Mettez en regard SASU et EURL à partir de votre activité, de vos priorités et de votre trajectoire réelle.",
    asset: imagery.sasuHero,
    href: "/creer-entreprise-seul",
    action: "Comparer SASU et EURL",
    summary: "SASU, EURL et trajectoire",
  },
  {
    id: "associes",
    eyebrow: "Projet à plusieurs",
    title: "Construisez un projet commun sur",
    accent: "des bases précises.",
    description: "Cadrez les rôles, le capital, les décisions et les pièces attendues avant d'engager la création de la société.",
    asset: imagery.sasHero,
    href: "/creer-entreprise-a-plusieurs",
    action: "Préparer le projet à plusieurs",
    summary: "Associés, capital et décisions",
  },
  {
    id: "transition",
    eyebrow: "Transition professionnelle",
    title: "Préparez votre entreprise avant",
    accent: "le changement de situation.",
    description: "Avancez sur le calendrier et les décisions structurantes pendant que votre projet est encore en préparation.",
    asset: imagery.employeeHero,
    href: "/creer-entreprise-en-etant-salarie",
    action: "Construire ma feuille de route",
    summary: "Calendrier et préparation",
  },
  {
    id: "reprise",
    eyebrow: "Dossier à reprendre",
    title: "Retrouvez la prochaine action pour",
    accent: "faire avancer le dossier.",
    description: "Identifiez le motif du blocage, les pièces concernées et l'ordre utile des corrections à effectuer.",
    asset: imagery.blockedDossierHero,
    href: "/dossier-creation-entreprise-bloque",
    action: "Reprendre mon dossier",
    summary: "Blocage, pièces et corrections",
  },
];

export function DynamicHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [loadedSlides, setLoadedSlides] = useState<Set<string>>(() => new Set());
  const heroRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduce = useReducedMotion();
  const activeSlide = heroSlides[activeIndex]!;
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -52]);
  const contentOpacity = useTransform(scrollYProgress, [0, .82], [1, .72]);

  useEffect(() => {
    if (reduce || paused || interactionPaused) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 7200);
    return () => window.clearInterval(interval);
  }, [activeIndex, interactionPaused, paused, reduce]);

  useEffect(() => {
    tabRefs.current[activeIndex]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest", inline: "center" });
  }, [activeIndex, reduce]);

  return (
    <section className="relative bg-[var(--canvas)] pb-8 pt-0 sm:pb-10" aria-roledescription="carrousel" aria-label="Parcours Orée" data-hero-carousel>
      <div className="container-wide">
        <div ref={heroRef} onPointerEnter={() => setInteractionPaused(true)} onPointerLeave={() => setInteractionPaused(false)} className="relative isolate min-h-[780px] overflow-hidden bg-[var(--ink)] shadow-[0_38px_110px_rgba(11,18,32,.24)] sm:rounded-b-[34px] lg:h-[100svh] lg:max-h-[980px] lg:min-h-[780px]">
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={activeSlide.id}
              className="absolute inset-0"
              initial={reduce ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0 }}
              transition={{ duration: reduce ? 0 : 1.05, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute -inset-5"
                initial={reduce ? false : { scale: 1.01 }}
                animate={reduce ? undefined : { scale: 1.07 }}
                transition={{ duration: 7.4, ease: "linear" }}
                data-hero-zoom
              >
                <ArtDirectedPicture
                  asset={activeSlide.asset}
                  sizes="100vw"
                  className="size-full"
                  imageClassName="size-full object-cover"
                  onImageLoad={() => setLoadedSlides((current) => new Set(current).add(activeSlide.id))}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {!loadedSlides.has(activeSlide.id) ? (
              <motion.div key={`${activeSlide.id}-loading`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hero-image-loading absolute inset-0 z-[1]" aria-hidden="true">
                <span className="hero-image-loading-line" />
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,18,32,.95)_0%,rgba(11,18,32,.81)_35%,rgba(11,18,32,.35)_69%,rgba(11,18,32,.2)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(11,18,32,.91)_0%,transparent_42%)]" />

          <motion.div style={reduce ? undefined : { y: contentY, opacity: contentOpacity }} className="relative z-10 flex min-h-[780px] flex-col px-5 pb-48 pt-36 text-white sm:px-10 sm:pt-40 lg:h-full lg:min-h-[780px] lg:px-[clamp(3rem,6vw,7rem)] lg:pb-48 lg:pt-[clamp(9rem,18vh,12rem)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSlide.id}-copy`}
                className="max-w-[850px]"
                initial={reduce ? false : { opacity: 0, y: 30, filter: "blur(7px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduce ? undefined : { opacity: 0, y: -18, filter: "blur(5px)" }}
                transition={{ duration: .72, ease: [0.16, 1, 0.3, 1] }}
                aria-live="polite"
              >
                <p className="inline-flex items-center gap-2.5 border-l-2 border-[var(--mint)] pl-3 text-[11px] font-semibold uppercase tracking-[.15em] text-white/82 sm:text-xs">{activeSlide.eyebrow}</p>
                <h1 className="mt-6 text-balance text-[clamp(2.65rem,12vw,3.45rem)] font-semibold leading-[.91] tracking-[-.06em] text-white sm:mt-7 sm:text-[clamp(3.45rem,6.3vw,7.6rem)]">
                  {activeSlide.title} <span className="font-editorial italic text-[color:var(--mint)]">{activeSlide.accent}</span>
                </h1>
                <p className="mt-6 max-w-3xl text-pretty text-[15px] leading-7 text-white/82 sm:mt-7 sm:text-xl sm:leading-9">{activeSlide.description}</p>
                <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
                  <ButtonLink to={activeSlide.href} variant="secondary" size="lg" className="hero-primary-cta h-14 min-w-[250px] px-6 text-[14px] sm:h-16 sm:px-8 sm:text-base" arrow>{activeSlide.action}</ButtonLink>
                  <ButtonLink to="/rendez-vous" variant="ghost" size="lg" className="hero-secondary-cta h-14 border border-white/44 bg-[var(--ink)]/35 px-6 text-[14px] text-white backdrop-blur-md hover:border-white hover:bg-[var(--ink)]/58 sm:h-16 sm:px-8 sm:text-base">
                    <MessageCircle className="size-5" />Parler à un conseiller
                  </ButtonLink>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            className="hero-pause-button absolute bottom-38 right-5 z-20 grid size-13 place-items-center rounded-full border border-white/55 bg-[var(--ink)]/72 text-white backdrop-blur-lg transition hover:scale-105 hover:border-white hover:bg-[var(--ink)] sm:bottom-39 sm:right-8"
            aria-label={paused ? "Reprendre le défilement du héros" : "Mettre en pause le défilement du héros"}
          >
            {paused ? <Play className="size-5 fill-current" /> : <Pause className="size-5 fill-current" />}
          </button>

          <div className="hero-story-tabs absolute inset-x-0 bottom-0 z-20 flex gap-2 overflow-x-auto bg-[linear-gradient(0deg,rgba(11,18,32,.98),rgba(11,18,32,.7))] p-4 pt-6 sm:gap-3 sm:px-8 sm:pb-6 lg:grid lg:grid-cols-5 lg:overflow-visible" role="tablist" aria-label="Choisir un parcours présenté">
            {heroSlides.map((slide, index) => {
              const active = index === activeIndex;
              return (
                <button
                  key={slide.id}
                  ref={(element) => { tabRefs.current[index] = element; }}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveIndex(index)}
                  className={cn("hero-story-tab group relative min-h-[112px] min-w-[205px] border-t border-white/32 px-3 pb-3 pt-4 text-left transition hover:border-white hover:bg-white/8 lg:min-w-0", active && "is-active border-white bg-white/9")}
                >
                  {active ? <span key={`${slide.id}-${activeIndex}`} className={cn("hero-slide-progress absolute -top-px left-0 h-[3px] bg-[var(--action)]", (paused || interactionPaused) && "[animation-play-state:paused]")} /> : null}
                  <span className="flex items-center justify-between gap-3"><span className="hero-story-number">0{index + 1}</span><ArrowRight className={cn("size-3.5 transition group-hover:translate-x-1", active ? "text-[color:var(--mint)]" : "text-white/58")} /></span>
                  <span className="hero-story-title mt-3 block">{slide.eyebrow}</span>
                  <span className="hero-story-summary mt-1.5 block line-clamp-2">{slide.summary}</span>
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-3 text-right text-[10px] leading-5 text-[color:var(--muted)]">Interfaces et situations présentées à titre illustratif.</p>
      </div>
    </section>
  );
}
