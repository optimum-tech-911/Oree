import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowRight, ChevronDown, Globe2, Menu, Search, UserRound, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { publicNavigation } from "@/config/routes";
import { cn } from "@/lib/cn";

const creationLinks = [
  { label: "SASU", href: "/creation-sasu", note: "Créer seul, structure souple" },
  { label: "EURL", href: "/creation-eurl", note: "Créer seul, cadre structuré" },
  { label: "SAS", href: "/creation-sas", note: "Projet avec associés" },
  { label: "SARL", href: "/creation-sarl", note: "Organisation collective encadrée" },
];

function openAssistant() {
  window.dispatchEvent(new CustomEvent("oree:assistant-open"));
}

export function PublicHeader({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const creationMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrolled(window.scrollY > 22);
      setProgress(Math.min(100, (window.scrollY / max) * 100));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!createOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!creationMenuRef.current?.contains(event.target as Node)) setCreateOpen(false);
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCreateOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, [createOpen]);

  const floating = transparent && !scrolled;
  const close = () => setOpen(false);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-[80] transition-all duration-500", scrolled ? "py-2" : "py-3 sm:py-4") }>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-transparent">
        <motion.div className="h-full origin-left bg-[var(--action)]" animate={{ width: `${progress}%` }} transition={{ duration: .12 }} />
      </div>

      <div className={cn(
        "relative isolate flex h-[82px] items-center justify-between px-3.5 transition-all duration-500 sm:px-5",
        floating
          ? "container-wide border-y border-white/14 bg-[var(--ink)]/78 text-white shadow-[0_18px_58px_rgba(11,18,32,.22)] backdrop-blur-2xl sm:rounded-[18px] sm:border"
          : "container-shell rounded-2xl border border-[var(--line)] bg-[color:var(--canvas)]/95 text-[color:var(--ink)] shadow-[0_10px_36px_rgba(11,18,32,.09)] backdrop-blur-2xl",
      )}>
        <Logo inverted={floating} />

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Navigation principale">
          <div ref={creationMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setCreateOpen((value) => !value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition 2xl:px-3.5 2xl:text-[14px]",
                floating ? "text-white/86 hover:bg-white/10 hover:text-white" : "text-[color:var(--ink)] hover:bg-[var(--ink)]/[.045]",
                createOpen && (floating ? "bg-white/12 text-white" : "bg-[var(--action)]/10 text-[color:var(--action)]"),
              )}
              aria-expanded={createOpen}
              aria-controls="creation-menu"
            >
              Créer ma société <ChevronDown className={cn("size-3.5 transition", createOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {createOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: .985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: .985 }}
                  transition={{ duration: .2 }}
                  id="creation-menu"
                  className="absolute left-0 top-[calc(100%+12px)] z-[90] w-[660px] overflow-hidden rounded-[24px] border border-[var(--line-strong)] bg-[var(--canvas)] p-3 text-[color:var(--ink)] shadow-[0_30px_90px_rgba(11,18,32,.22)]"
                >
                  <div className="grid grid-cols-[1fr_210px] gap-2">
                    <div className="grid grid-cols-2 gap-1.5">
                      {creationLinks.map((item) => (
                        <Link key={item.href} to={item.href} onClick={() => setCreateOpen(false)} className="group rounded-[16px] border border-transparent p-4 transition hover:border-[var(--line)] hover:bg-[var(--ink)]/[.035]">
                          <div className="flex items-center justify-between"><span className="text-lg font-semibold tracking-[-.025em] text-[color:var(--ink)]">{item.label}</span><ArrowRight className="size-4 text-[color:var(--muted)] transition group-hover:translate-x-1 group-hover:text-[color:var(--action)]" /></div>
                          <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">{item.note}</p>
                        </Link>
                      ))}
                    </div>
                    <Link to="/diagnostic" onClick={() => setCreateOpen(false)} className="group relative overflow-hidden rounded-[20px] bg-[var(--ink)] p-5 text-[color:var(--canvas)]">
                      <div className="absolute -right-16 -top-14 size-40 rounded-full bg-[var(--action)]/30 blur-3xl" />
                      <span className="relative inline-flex rounded-full border border-white/20 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[.11em] text-white/72">Orientation</span>
                      <p className="relative mt-5 text-xl font-semibold leading-tight tracking-[-.03em] text-white">Vous hésitez encore&nbsp;?</p>
                      <p className="relative mt-2 text-xs leading-5 text-white">Le diagnostic part de votre situation avant d'aborder la forme juridique.</p>
                      <span className="relative mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[color:var(--mint)]">Démarrer le diagnostic <ArrowRight className="size-3.5 transition group-hover:translate-x-1" /></span>
                    </Link>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {publicNavigation.map((item) => (
            <NavLink key={item.href} to={item.href} className={({ isActive }) => cn(
              "rounded-xl px-3 py-2.5 text-[13px] font-medium transition 2xl:px-3.5 2xl:text-[14px]",
              floating ? "text-white/72 hover:bg-white/10 hover:text-white" : "text-[color:var(--muted)] hover:bg-[var(--ink)]/[.045] hover:text-[color:var(--ink)]",
              isActive && (floating ? "bg-white/12 text-white" : "bg-[var(--action)]/10 text-[color:var(--action)]"),
            )}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 lg:flex">
          <button type="button" onClick={openAssistant} className={cn("grid size-11 place-items-center rounded-xl transition", floating ? "text-white/82 hover:bg-white/10 hover:text-white" : "text-[color:var(--muted)] hover:bg-[var(--ink)]/[.045] hover:text-[color:var(--ink)]")} aria-label="Rechercher avec le Guide Orée">
            <Search className="size-5" />
          </button>
          <span className={cn("mx-1 h-7 w-px", floating ? "bg-white/24" : "bg-[var(--line-strong)]")} />
          <span className={cn("inline-flex h-11 items-center gap-1.5 px-2 text-[12px] font-semibold", floating ? "text-white/78" : "text-[color:var(--muted)]")}><Globe2 className="size-4" />FR</span>
          <Link to="/connexion" className={cn("nav-hover-line inline-flex h-11 items-center gap-2 rounded-xl px-3 text-[13px] font-medium transition", floating ? "text-white/82 hover:bg-white/10 hover:text-white" : "text-[color:var(--muted)] hover:bg-[var(--ink)]/[.045] hover:text-[color:var(--ink)]")}><UserRound className="size-4" />Se connecter</Link>
          <ButtonLink to="/diagnostic" variant="accent" size="md" className="px-5 text-[13px]" arrow>Démarrer mon diagnostic</ButtonLink>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ButtonLink to="/diagnostic" variant="accent" size="sm" className="h-11 px-3 text-[12px]">Démarrer</ButtonLink>
          <button type="button" className={cn("grid size-11 place-items-center rounded-xl border shadow-sm transition hover:-translate-y-0.5", floating ? "border-white/18 bg-white/8 text-white hover:border-white/36" : "border-[var(--line)] bg-[var(--canvas)] text-[color:var(--ink)] hover:border-[var(--action)]/35")} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[-1] bg-[var(--ink)] lg:hidden">
            <div className="absolute inset-0 hero-grid opacity-60" />
            <div className="container-shell relative flex h-full flex-col overflow-y-auto pb-8 pt-28 text-white">
              <Link to="/diagnostic" onClick={close} className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[.07] p-5 transition hover:-translate-y-1 hover:bg-white/[.1]"><span className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[color:var(--mint)]">Commencer</span><h2 className="mt-4 text-3xl font-extrabold tracking-[-.055em]">Trouver mon parcours</h2><p className="mt-2 text-sm leading-6 text-white/72">Une orientation adaptée à votre situation réelle.</p><ArrowRight className="absolute bottom-5 right-5 size-5 transition group-hover:translate-x-1" /></Link>

              <div className="mt-7 border-t border-white/10 pt-6">
                <p className="text-[10px] font-extrabold uppercase tracking-[.17em] text-white/72">Créer votre structure</p>
                <div className="mt-3 grid gap-1 sm:grid-cols-2">{creationLinks.map((item) => <Link key={item.href} to={item.href} onClick={close} className="flex items-center justify-between rounded-2xl px-3 py-3.5 text-sm font-extrabold text-white/74 transition hover:bg-white/8 hover:text-white"><span>{item.label}</span><ArrowRight className="size-4 text-white/72" /></Link>)}</div>
              </div>

              <nav className="mt-6 grid gap-1 border-t border-white/10 pt-6">{publicNavigation.map((item) => <NavLink key={item.href} to={item.href} onClick={close} className="flex items-center justify-between rounded-2xl px-3 py-3.5 text-sm font-extrabold text-white/74 hover:bg-white/8 hover:text-white"><span>{item.label}</span><ArrowRight className="size-4 text-white/72" /></NavLink>)}</nav>
              <div className="mt-auto grid grid-cols-2 gap-2 border-t border-white/10 pt-6"><ButtonLink to="/connexion" variant="ghost" className="w-full border border-white/10 text-white hover:bg-white/8">Espace client</ButtonLink><ButtonLink to="/diagnostic" variant="dark" className="w-full" arrow>Commencer</ButtonLink></div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
