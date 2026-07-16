import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Bell, Bot, Command, Menu, Sparkles, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { opsNavigation } from "@/config/routes";
import { cn } from "@/lib/cn";

function OpsNav({ onSelect }: { onSelect?: () => void }) {
  return (
    <nav className="space-y-1 px-3">
      {opsNavigation.map((item) => {
        const Icon = item.icon!;
        return <NavLink end={item.href === "/ops"} key={item.href} to={item.href} onClick={onSelect} className={({ isActive }) => cn("group flex items-center gap-3 rounded-[15px] px-3.5 py-3 text-sm font-semibold transition duration-300", isActive ? "bg-white text-[color:var(--ink)] shadow-[0_12px_34px_rgba(11,18,32,.18)]" : "text-white/72 hover:bg-white/[.07] hover:text-white")}><Icon className="size-4 transition-transform group-hover:scale-110" />{item.label}<span className="ml-auto size-1.5 rounded-full bg-[var(--mint)] opacity-0 transition group-[.active]:opacity-100" /></NavLink>;
      })}
    </nav>
  );
}

export function OpsLayout() {
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const current = opsNavigation.find((item) => item.href === location.pathname);
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[color:var(--ink)]">
      <aside className="hero-grid surface-noise fixed inset-y-0 left-0 z-40 hidden w-[276px] overflow-hidden bg-[var(--night)] text-white xl:flex xl:flex-col">
        <div className="relative z-10 px-6 py-7"><Logo inverted /></div>
        <div className="relative z-10 mx-4 mb-7 rounded-[20px] border border-white/[.08] bg-white/[.045] p-4"><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-white/72">Environnement</p><Sparkles className="size-3.5 text-[color:var(--mint)]" /></div><p className="mt-2 flex items-center gap-2 text-sm font-semibold"><span className="size-2 rounded-full bg-[var(--mint)] shadow-[0_0_18px_var(--mint)]" />Pilotage démo</p><p className="mt-2 text-[11px] leading-5 text-white/72">Architecture prête pour les données Supabase et les rôles équipe.</p></div>
        <div className="relative z-10 flex-1"><OpsNav /></div>
        <Link to="/ops/profil" className="relative z-10 m-4 rounded-[22px] border border-white/[.08] bg-white/[.04] p-4 transition hover:bg-white/[.07]"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-[14px] bg-[var(--mint)] text-xs font-extrabold text-[color:var(--ink)]">OR</span><div><p className="text-xs font-semibold">Équipe Orée</p><p className="mt-1 text-[10px] text-white/72">Compte de démonstration</p></div></div></Link>
      </aside>

      <div className="xl:pl-[276px]">
        <header className="sticky top-0 z-30 border-b border-black/[.06] bg-white/86 backdrop-blur-2xl">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3"><button onClick={() => setOpen(true)} aria-label="Ouvrir la navigation" className="grid size-11 place-items-center rounded-2xl border border-black/[.08] bg-white xl:hidden"><Menu className="size-5" /></button><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[color:var(--muted)]">Orée Operations</p><h1 className="mt-1 text-base font-semibold tracking-[-.02em]">{current?.label ?? "Pilotage"}</h1></div></div>
            <div className="relative flex items-center gap-2"><button type="button" onClick={() => window.dispatchEvent(new CustomEvent("oree:assistant-open"))} className="group hidden h-11 min-w-[310px] items-center gap-3 rounded-2xl border border-black/[.08] bg-white/80 px-4 text-left text-sm font-bold text-[color:var(--muted)] shadow-[0_8px_30px_rgba(11,18,32,.04)] transition hover:border-[var(--blue)]/25 hover:bg-white md:flex"><Bot className="size-4 text-[color:var(--blue)]" /><span className="flex-1">Demander au Guide Orée</span><span className="inline-flex items-center gap-1 rounded-lg border border-black/[.07] bg-[var(--paper)] px-2 py-1 text-[10px] font-extrabold"><Command className="size-3" />K</span></button><button type="button" onClick={() => setNotificationsOpen((value) => !value)} aria-label="Afficher les notifications" aria-expanded={notificationsOpen} className="relative grid size-11 place-items-center rounded-2xl border border-black/[.08] bg-white/80 shadow-[0_8px_30px_rgba(11,18,32,.04)]"><Bell className="size-4" /><span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-[var(--blue)] ring-2 ring-white" /></button><Link to="/ops/profil" className="grid size-11 place-items-center rounded-2xl bg-[var(--night)] text-xs font-extrabold text-white xl:hidden">OR</Link>{notificationsOpen ? <div className="absolute right-0 top-14 z-50 w-[min(360px,calc(100vw-2rem))] rounded-[22px] border border-[var(--line)] bg-white p-4 shadow-[0_24px_70px_rgba(11,18,32,.18)]"><p className="text-xs font-bold uppercase tracking-[.12em] text-[color:var(--muted)]">Notifications opérations</p><Link to="/ops/documents" onClick={() => setNotificationsOpen(false)} className="mt-3 block rounded-2xl bg-[var(--paper)] p-4 transition hover:bg-[var(--mint-soft)]"><p className="text-sm font-semibold">Trois documents attendent un contrôle</p><p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">Ouvrir la file documentaire prioritaire.</p></Link><Link to="/ops/leads" onClick={() => setNotificationsOpen(false)} className="mt-2 block rounded-2xl bg-[var(--paper)] p-4 transition hover:bg-[var(--mint-soft)]"><p className="text-sm font-semibold">Deux demandes à qualifier</p><p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">Consulter les demandes les plus récentes.</p></Link></div> : null}</div>
          </div>
        </header>
        <main className="app-shell-background min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>

      <AnimatePresence>
        {open ? <><motion.button aria-label="Fermer la navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm xl:hidden" /><motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 280 }} className="hero-grid surface-noise fixed inset-y-0 left-0 z-[60] w-[min(88vw,330px)] bg-[var(--night)] text-white xl:hidden"><div className="relative z-10 flex items-center justify-between p-6"><Logo inverted /><button onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[.06]"><X className="size-5" /></button></div><div className="relative z-10 mt-3"><OpsNav onSelect={() => setOpen(false)} /></div></motion.aside></> : null}
      </AnimatePresence>
    </div>
  );
}
