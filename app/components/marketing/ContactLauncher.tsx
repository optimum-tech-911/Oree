import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Mail, MessageCircle, MessageSquareText, PhoneCall, Send, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { directContact, directContactOptions } from "@/content/contact";
import { analytics } from "@/services/analytics";
import { cn } from "@/lib/cn";

const icons = {
  call: PhoneCall,
  sms: MessageSquareText,
  email: Mail,
  whatsapp: MessageCircle,
  "whatsapp-business": Send,
} as const;

export function ContactLauncher() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const location = useLocation();
  const closeRef = useRef<HTMLButtonElement>(null);
  const onHome = location.pathname === "/";

  function openContact() {
    setOpen(true);
    analytics.track("primary_cta_clicked", { path: location.pathname, location: "contact_launcher", intent: "direct_contact" });
  }

  function closeContact() {
    setOpen(false);
  }

  useEffect(() => {
    const onOpen = () => openContact();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeContact();
    };
    window.addEventListener("oree:contact-open", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("oree:contact-open", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  });

  useEffect(() => {
    if (open) window.setTimeout(() => closeRef.current?.focus(), 120);
  }, [open]);

  return (
    <>
      {onHome ? (
        <motion.button
          data-contact-launcher
          type="button"
          onClick={openContact}
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .5, duration: .5, ease: [0.16, 1, 0.3, 1] }}
          whileHover={reduce ? undefined : { y: -3 }}
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-3 z-[69] inline-flex h-12 items-center gap-2 rounded-full border border-white/12 bg-[var(--ink)] px-4 text-xs font-semibold shadow-[0_18px_48px_rgba(11,18,32,.28)] backdrop-blur-xl transition hover:border-[var(--mint)]/70 hover:bg-[var(--ink-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mint)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)] sm:left-6 sm:h-13 sm:px-5 lg:bottom-6"
          aria-label="Contacter l’équipe : téléphone, message ou WhatsApp"
        >
          <span className="relative grid size-8 place-items-center rounded-full bg-[var(--mint)] text-[color:var(--ink)]"><PhoneCall className="size-4" /><span className="assistant-pulse" /></span>
          <span className="foreground-on-dark relative z-10">Contacter l’équipe</span>
        </motion.button>
      ) : null}

      <AnimatePresence>
        {open ? (
          <>
            <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeContact} className="fixed inset-0 z-[85] bg-[var(--ink)]/55 backdrop-blur-[5px]" aria-label="Fermer les options de contact" />
            <motion.aside
              data-contact-sheet
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-sheet-title"
              initial={reduce ? false : { opacity: 0, y: 24, scale: .985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: 20, scale: .985 }}
              transition={{ type: "spring", damping: 30, stiffness: 330 }}
              className="fixed inset-x-2 bottom-2 z-[90] max-h-[calc(100dvh-1rem)] overflow-y-auto rounded-[28px] border border-white/10 bg-[var(--paper)] p-4 shadow-[0_36px_110px_rgba(11,18,32,.42)] sm:bottom-5 sm:left-1/2 sm:w-[min(680px,calc(100vw-2.5rem))] sm:-translate-x-1/2 sm:p-6"
            >
              <div className="flex items-start justify-between gap-5 rounded-[20px] bg-[var(--ink)] p-5 text-white sm:p-6">
                <div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[color:var(--mint)]">Un contact direct</p><h2 id="contact-sheet-title" className="mt-2 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">Comment souhaitez-vous nous joindre ?</h2><p className="mt-2 text-sm leading-6 text-white/72">Choisissez le canal le plus pratique pour vous.</p></div>
                <button ref={closeRef} type="button" onClick={closeContact} className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[.06] text-white/72 transition hover:bg-white/[.12] hover:text-white" aria-label="Fermer"><X className="size-4" /></button>
              </div>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {directContactOptions.map((option, index) => {
                  const Icon = icons[option.id];
                  const primary = option.id === "call";
                  return <motion.a key={option.id} href={option.href} target={option.external ? "_blank" : undefined} rel={option.external ? "noreferrer" : undefined} onClick={() => analytics.track("contact_option_selected", { channel: option.id, location: "contact_sheet" })} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : .08 + index * .045, duration: .35 }} className={cn("group flex min-h-20 items-center gap-3 rounded-[18px] border p-4 transition duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action)] focus-visible:ring-offset-2", primary ? "border-[var(--action)] bg-[var(--action)] text-white shadow-[0_12px_30px_rgba(36,87,255,.2)] sm:col-span-2" : "border-[var(--line)] bg-white text-[color:var(--ink)] hover:border-[var(--action)]/35")}><span className={cn("grid size-10 shrink-0 place-items-center rounded-[13px]", primary ? "bg-white text-[color:var(--ink)]" : "bg-[var(--mint-soft)]")}><Icon className="size-4" /></span><span><span className="block text-sm font-semibold">{option.label}</span><span className={cn("mt-0.5 block text-xs", primary ? "text-white/72" : "text-[color:var(--muted)]")}>{option.description}</span></span></motion.a>;
                })}
              </div>
              <p className="mt-4 px-1 text-xs leading-5 text-[color:var(--muted)]">{directContact.displayPhone} · {directContact.email}</p>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
