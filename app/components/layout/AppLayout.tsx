import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Bell, Bot, ChevronDown, Command, LogOut, Menu, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/ui/Logo";
import { clientNavigation } from "@/config/routes";
import { cn } from "@/lib/cn";
import { useAuth } from "@/features/auth/auth-context";
import { useQuery } from "@tanstack/react-query";
import { portalRepository } from "@/services/supabase/portal";

const mobilePrimary = ["/app", "/app/projet", "/app/documents", "/app/messages"];

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { data: portal } = useQuery({ queryKey: ["portal", "snapshot"], queryFn: portalRepository.getSnapshot, refetchInterval: 30_000 });
  const projectName = portal?.project?.displayName ?? (portal?.demo ? "Studio Horizon" : "Projet à créer");
  const progress = portal?.project?.progress ?? 0;
  const unreadMessages = portal?.messages.filter((message) => !message.isOwn && !message.read).length ?? 0;
  const initials = user ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase() || "OR" : "OR";
  const current = clientNavigation.find((item) => item.href === location.pathname) ?? clientNavigation[0];

  const sidebar = (
    <div className="flex h-full flex-col text-white">
      <div className="px-5 py-6"><Logo inverted /></div>
      <div className="mx-4 mb-5 rounded-[20px] border border-white/8 bg-white/[.045] p-4"><div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-white/72">Projet actif</p><p className="mt-1.5 truncate text-sm font-extrabold">{projectName}</p></div><span className="rounded-full bg-[var(--mint)] px-2.5 py-1 text-[9px] font-extrabold text-[color:var(--ink)]">{progress}%</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/7"><div className="h-full rounded-full bg-[linear-gradient(90deg,var(--mint),var(--sky))]" style={{ width: `${progress}%` }} /></div></div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 scrollbar-thin" aria-label="Espace client">
        {clientNavigation.map((item) => {
          const Icon = item.icon!;
          return (
            <NavLink end={item.href === "/app"} key={item.href} to={item.href} onClick={() => setMobileOpen(false)} className={({ isActive }) => cn("group flex items-center gap-3 rounded-[15px] px-3 py-3 text-[13px] font-bold transition", isActive ? "bg-white text-[color:var(--ink)] shadow-[0_12px_34px_rgba(11,18,32,.16)]" : "text-white/72 hover:bg-white/7 hover:text-white") }>
              <span className={cn("grid size-8 place-items-center rounded-[11px] transition", location.pathname === item.href ? "bg-[var(--mint-soft)] text-[color:var(--ink)]" : "bg-white/5 text-white/72 group-hover:bg-white/8") }><Icon className="size-4" /></span>{item.label}
              {item.href === "/app/messages" && unreadMessages > 0 ? <span className="ml-auto grid size-5 place-items-center rounded-full bg-[var(--blue)] text-[9px] text-white">{unreadMessages}</span> : null}
            </NavLink>
          );
        })}
      </nav>
      <div className="m-3 rounded-[20px] border border-white/8 bg-white/[.045] p-3"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-[var(--mint)] text-[11px] font-extrabold text-[color:var(--ink)]">{initials}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-extrabold">{user ? `${user.firstName} ${user.lastName}` : "Porteur de projet"}</p><p className="mt-0.5 truncate text-[9px] text-white/72">{user?.demo !== false ? "Mode démonstration" : user.email}</p></div><button type="button" onClick={() => void signOut()} className="grid size-9 place-items-center rounded-full text-white/72 transition hover:bg-white/8 hover:text-white" title="Se déconnecter"><LogOut className="size-4" /></button></div></div>
    </div>
  );

  return (
    <div className="app-shell-background min-h-screen text-[color:var(--ink)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[284px] overflow-hidden bg-[var(--night)] lg:block"><div className="absolute inset-0 hero-grid opacity-35" /> <div className="relative h-full">{sidebar}</div></aside>
      <div className="lg:pl-[284px]">
        <header className="sticky top-0 z-30 px-3 pt-3 sm:px-5 lg:px-7">
          <div className="flex h-[70px] items-center justify-between rounded-[22px] border border-white/70 bg-white/84 px-3 shadow-[0_12px_48px_rgba(11,18,32,.07)] backdrop-blur-2xl sm:px-5">
            <div className="flex items-center gap-3"><button type="button" onClick={() => setMobileOpen(true)} className="grid size-11 place-items-center rounded-full border border-[var(--line)] bg-white lg:hidden"><Menu className="size-5" /></button><div><p className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[color:var(--muted)]">Espace projet</p><h1 className="mt-1 text-lg font-extrabold tracking-[-.035em]">{current?.label ?? "Vue d'ensemble"}</h1></div></div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("oree:assistant-open"))} className="grid size-11 place-items-center rounded-full border border-[var(--line)] bg-[var(--mint-soft)] text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 xl:hidden" aria-label="Ouvrir le Guide Orée"><Bot className="size-4.5" /></button>
              <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("oree:assistant-open"))} className="hidden h-11 min-w-[300px] items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 text-left text-xs font-extrabold text-[color:var(--muted)] shadow-sm transition hover:border-[var(--blue)]/28 hover:text-[color:var(--ink)] xl:flex"><Search className="size-4" />Demander au Guide Orée <kbd className="ml-auto inline-flex items-center gap-1 rounded-md bg-[var(--paper)] px-2 py-1 text-[9px] font-extrabold"><Command className="size-2.5" />K</kbd></button>
              <Link to="/app/notifications" className="relative grid size-11 place-items-center rounded-full border border-[var(--line)] bg-white shadow-sm transition hover:-translate-y-0.5" aria-label="Ouvrir les notifications"><Bell className="size-4.5" /><span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-[var(--blue)] ring-2 ring-white" /></Link>
              <Link to="/app/parametres" className="hidden items-center gap-2 rounded-full bg-[var(--ink)] py-2 pl-2 pr-3 text-xs font-extrabold text-white shadow-[0_12px_32px_rgba(11,18,32,.18)] sm:flex"><span className="grid size-8 place-items-center rounded-full bg-[var(--mint)] text-[9px] text-[color:var(--ink)]">{initials}</span><span className="hidden md:inline">Mon compte</span><ChevronDown className="size-3.5 text-white/72" /></Link>
            </div>
          </div>
        </header>
        <main className="min-h-[calc(100vh-5rem)] p-3 pb-24 sm:p-5 sm:pb-24 lg:p-7 lg:pb-8"><Outlet /></main>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-[22px] border border-white/10 bg-[rgba(11,18,32,.92)] p-1.5 text-white shadow-[0_24px_70px_rgba(11,18,32,.28)] backdrop-blur-2xl lg:hidden" aria-label="Navigation mobile">
        {clientNavigation.filter((item) => mobilePrimary.includes(item.href)).map((item) => { const Icon = item.icon!; return <NavLink end={item.href === "/app"} key={item.href} to={item.href} className={({ isActive }) => cn("flex min-h-13 flex-col items-center justify-center gap-1 rounded-[16px] text-[9px] font-bold transition", isActive ? "bg-white text-[color:var(--ink)]" : "text-white/72") }><Icon className="size-4" /><span>{item.label.replace("Vue d'ensemble", "Accueil")}</span></NavLink>; })}
        <button type="button" onClick={() => setMobileOpen(true)} className="flex min-h-13 flex-col items-center justify-center gap-1 rounded-[16px] text-[9px] font-bold text-white/72"><Menu className="size-4" />Plus</button>
      </nav>

      <AnimatePresence>
        {mobileOpen ? <><motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 z-50 bg-[var(--ink)]/52 backdrop-blur-sm lg:hidden" aria-label="Fermer le menu" /><motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed inset-y-0 left-0 z-50 w-[min(330px,88vw)] overflow-hidden bg-[var(--night)] lg:hidden"><div className="absolute inset-0 hero-grid opacity-35" /><button type="button" onClick={() => setMobileOpen(false)} className="absolute right-4 top-5 z-10 grid size-10 place-items-center rounded-full border border-white/8 bg-white/7 text-white"><X className="size-5" /></button><div className="relative h-full">{sidebar}</div></motion.aside></> : null}
      </AnimatePresence>


    </div>
  );
}
